"""
Stage: Intent Classification.

A small rule-based classifier over lemmatized tokens / keyword cues. This is
intentionally simple (a mini-project should be explainable end-to-end in a
viva) but is structured so it could be swapped for a scikit-learn
TF-IDF + LogisticRegression classifier trained on a labelled utterance set
without changing the function's return contract.
"""

INTENT_RULES = [
    ("emergency_warning", ["can't breathe", "cant breathe", "chest pain", "unconscious", "severe bleeding", "fainted"]),
    ("medicine_query", ["medicine", "tablet", "pill", "dose", "dosage", "should i take"]),
    ("remedy_request", ["remedy", "what should i do", "what can i do", "how do i treat", "help me", "cure"]),
    ("follow_up", ["still", "again", "even after", "not better", "worse now"]),
]


def classify_intent(cleaned_text: str, symptoms_found: bool) -> str:
    for intent, cues in INTENT_RULES:
        for cue in cues:
            if cue in cleaned_text:
                return intent
    if symptoms_found:
        return "symptom_report"
    return "general_health_advice"
