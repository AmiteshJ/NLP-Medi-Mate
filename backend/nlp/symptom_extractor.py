"""
Stage: Symptom Extraction + Synonym Normalization.

Matches the cleaned input text against the synonym lists in the knowledge
base (data/symptoms.json) so that many different phrasings normalize to the
same canonical symptom key, e.g.:

    "my head hurts" / "head is killing me" / "pain in my head"  -->  headache
    "I feel like throwing up" / "I'm nauseous"                  -->  stomachDiscomfort

Each match also runs through negation.is_negated() so "no fever" is captured
as a negated symptom rather than silently dropped -- this is shown in the
"How MediMate understood you" panel with a strikethrough on the frontend.
"""
from knowledge_base.loader import load_knowledge_base
from .negation import is_negated


def extract_symptoms(cleaned_text: str):
    kb = load_knowledge_base()
    found = []
    seen_keys = set()

    for key, entry in kb.items():
        for synonym in entry["synonyms"]:
            idx = cleaned_text.find(synonym)
            if idx == -1:
                continue
            if key in seen_keys:
                break
            negated = is_negated(cleaned_text, idx)
            found.append({
                "key": key,
                "label": entry["label"],
                "matched_phrase": synonym,
                "negated": negated,
            })
            seen_keys.add(key)
            break  # one match per symptom key is enough

    return found
