"""
Stage: Entity / Feature Extraction -- duration, severity, body parts.
Pure regex + keyword-list rules, kept transparent and easy to explain in a
viva ("here is the exact pattern that caught 'since yesterday'").
"""
import re

DURATION_PATTERN = re.compile(
    r"(since\s+(?:last\s+)?\w+)"
    r"|(for\s+(?:the\s+past\s+)?(?:a|an|\d+|one|two|three|four|five|six|seven|eight|few|couple of)\s*"
    r"(?:days|day|weeks|week|hours|hour|months|month))",
    re.IGNORECASE,
)

SEVERITY_WORDS = {
    "severe": ["unbearable", "severe", "intense", "excruciating", "terrible", "awful", "worst", "extreme"],
    "moderate": ["moderate", "noticeable", "annoying", "uncomfortable"],
    "mild": ["mild", "slight", "little", "bit of", "minor", "light"],
}

BODY_PARTS = [
    "head", "throat", "stomach", "chest", "back", "eyes", "ear", "nose",
    "leg", "legs", "arm", "arms", "skin", "neck", "shoulder", "knee",
]


def extract_duration(text: str):
    m = DURATION_PATTERN.search(text)
    return m.group(0) if m else None


def extract_severity(text: str):
    for level, words in SEVERITY_WORDS.items():
        for w in words:
            if w in text:
                return level
    return None


def extract_body_parts(text: str):
    found = []
    for part in BODY_PARTS:
        if re.search(rf"\b{part}\b", text):
            found.append(part)
    return found
