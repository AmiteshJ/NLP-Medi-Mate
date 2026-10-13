"""
Stage 1-4 of the pipeline: Text Preprocessing -> Tokenization -> Normalization
-> Stop-word handling -> (light) Lemmatization.

Implemented with lightweight, dependency-free rules so the project runs
anywhere without downloading large language models. It is written so a
spaCy/NLTK-based version can be dropped in later without changing the
function signatures used by pipeline.py -- see the note at the bottom.
"""
import re
import string

STOP_WORDS = {
    "a", "an", "the", "is", "am", "are", "was", "were", "been", "being",
    "i", "me", "my", "myself", "we", "our", "you", "your", "he", "she",
    "it", "its", "they", "them", "this", "that", "these", "those",
    "and", "or", "but", "if", "so", "of", "at", "by", "for", "with",
    "about", "to", "from", "in", "on", "up", "down", "as", "than",
    "very", "just", "really", "kind of", "sort of", "also", "too",
}

# Minimal suffix-stripping lemmatizer -- not linguistically perfect, but
# good enough to normalize common verb/noun forms in symptom descriptions
_LEMMA_RULES = [
    (re.compile(r"(\w+)ing$"), r"\1"),
    (re.compile(r"(\w+)ed$"), r"\1"),
    (re.compile(r"(\w{3,}?)s$"), r"\1"),
]


def clean_text(raw: str) -> str:
    """Lowercase, normalize whitespace, strip most punctuation (keep apostrophes)."""
    text = raw.lower().strip()
    text = re.sub(r"\s+", " ", text)
    keep = string.punctuation.replace("'", "")
    text = text.translate(str.maketrans("", "", keep.replace(",", "").replace(".", "")))
    return text


def tokenize(text: str):
    return re.findall(r"[a-z']+", text.lower())


def remove_stopwords(tokens):
    return [t for t in tokens if t not in STOP_WORDS]


def lemmatize_token(token: str) -> str:
    # Guard common irrelevant short words / already-simple words
    if len(token) <= 3:
        return token
    for pattern, repl in _LEMMA_RULES:
        if pattern.match(token):
            return pattern.sub(repl, token)
    return token


def lemmatize(tokens):
    return [lemmatize_token(t) for t in tokens]


def preprocess(raw_text: str) -> dict:
    """Runs the full preprocessing stage and returns intermediate artifacts
    (useful for the 'NLP Pipeline' viva visualization)."""
    cleaned = clean_text(raw_text)
    tokens = tokenize(cleaned)
    no_stop = remove_stopwords(tokens)
    lemmas = lemmatize(no_stop)
    return {
        "raw": raw_text,
        "cleaned": cleaned,
        "tokens": tokens,
        "tokens_no_stopwords": no_stop,
        "lemmas": lemmas,
    }


# ---------------------------------------------------------------------------
# NOTE for future upgrade:
# Swap this module's internals for spaCy (`nlp = spacy.load("en_core_web_sm")`)
# to get proper POS-aware lemmatization and dependency parsing, while keeping
# `preprocess()` returning the same dict shape so pipeline.py doesn't change.
# ---------------------------------------------------------------------------
