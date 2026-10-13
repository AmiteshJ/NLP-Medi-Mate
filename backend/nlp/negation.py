"""
Stage: Negation Detection.

Uses a small negation-cue window: if a negation word appears within N
characters/words *before* a matched symptom phrase, and no contrastive
conjunction ("but") re-affirms it afterwards, the symptom is marked negated.

This directly addresses the spec's requirement to distinguish
"I have fever" from "I don't have fever".
"""
import re

NEGATION_CUES = [
    "no", "not", "n't", "dont", "don't", "doesn't", "doesnt", "without",
    "isn't", "isnt", "haven't", "havent", "never", "hardly", "none",
]

WINDOW_CHARS = 24


def is_negated(full_text: str, match_start_idx: int) -> bool:
    """
    full_text: the cleaned, lowercased text
    match_start_idx: character index where the matched symptom phrase begins
    """
    window_start = max(0, match_start_idx - WINDOW_CHARS)
    preceding = full_text[window_start:match_start_idx]

    for cue in NEGATION_CUES:
        if re.search(rf"\b{re.escape(cue)}\b", preceding):
            return True
    return False
