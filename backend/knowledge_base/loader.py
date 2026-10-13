"""
Loads the curated healthcare knowledge base (data/symptoms.json) once at
startup and exposes it to the rest of the NLP pipeline and the recommendation
engine. Keeping this as a small JSON file (rather than a database table)
keeps the mini-project easy to extend during a viva -- add an entry, restart,
done.
"""
import json
import os

_DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "symptoms.json")

_cache = None


def load_knowledge_base():
    global _cache
    if _cache is None:
        with open(_DATA_PATH, "r", encoding="utf-8") as f:
            _cache = json.load(f)
    return _cache


def get_entry(symptom_key):
    return load_knowledge_base().get(symptom_key)
