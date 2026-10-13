"""
Orchestrates the full pipeline described in the project spec:

  Raw text -> Preprocessing -> Tokenization -> Normalization -> Stop-words ->
  Lemmatization -> Symptom Extraction -> Negation Detection -> Duration /
  Severity / Body-part Extraction -> Intent Classification -> Structured
  Patient Context

This structured context is what gets sent to the knowledge base for
matching and then to the Groq service -- the raw sentence itself is never
forwarded to the LLM.
"""
from .preprocessing import preprocess
from .symptom_extractor import extract_symptoms
from .entity_extractor import extract_duration, extract_severity, extract_body_parts
from .intent_classifier import classify_intent

RED_FLAG_PHRASES = [
    "chest pain", "can't breathe", "cant breathe", "difficulty breathing",
    "worst headache", "blood in", "confusion", "fainted", "unconscious",
    "severe bleeding",
]


def _confidence_score(symptoms, duration, severity):
    active = [s for s in symptoms if not s["negated"]]
    score = 55 + len(active) * 12
    if duration:
        score += 8
    if severity:
        score += 6
    return min(97, score)


def run_pipeline(raw_text: str) -> dict:
    pre = preprocess(raw_text)
    cleaned = pre["cleaned"]

    symptoms = extract_symptoms(cleaned)
    active_symptoms = [s for s in symptoms if not s["negated"]]

    duration = extract_duration(cleaned)
    severity = extract_severity(cleaned)
    body_parts = extract_body_parts(cleaned)

    intent = classify_intent(cleaned, symptoms_found=bool(active_symptoms))

    red_flag = any(phrase in cleaned for phrase in RED_FLAG_PHRASES) or (
        severity == "severe" and len(active_symptoms) > 1
    )
    if red_flag:
        intent = "emergency_warning"

    confidence = _confidence_score(symptoms, duration, severity)

    keywords = sorted(set(pre["lemmas"]), key=len, reverse=True)[:6]

    return {
        "raw_text": raw_text,
        "pipeline_trace": {
            "tokens": pre["tokens"],
            "tokens_no_stopwords": pre["tokens_no_stopwords"],
            "lemmas": pre["lemmas"],
        },
        "symptoms": symptoms,
        "active_symptoms": active_symptoms,
        "duration": duration,
        "severity": severity,
        "body_parts": body_parts,
        "intent": intent,
        "keywords": keywords,
        "confidence": confidence,
        "red_flag": red_flag,
    }
