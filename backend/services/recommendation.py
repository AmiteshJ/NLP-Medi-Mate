"""
Knowledge Base Retrieval + Recommendation assembly.
Takes the NLP pipeline's structured output and pulls the matching
remedy / OTC / warning info for each active (non-negated) symptom.
"""
from knowledge_base.loader import get_entry


def build_remedies(pipeline_result: dict):
    remedies = []
    for symptom in pipeline_result["active_symptoms"]:
        entry = get_entry(symptom["key"])
        if not entry:
            continue
        remedies.append({
            "key": symptom["key"],
            "label": entry["label"],
            "remedies": entry["remedies"],
            "otc": entry["otc"],
            "warning_signs": entry["warning_signs"],
            "consult_if": entry["consult_if"],
        })
    return remedies
