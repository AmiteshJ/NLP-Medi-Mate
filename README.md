# MediMate

**An NLP-Based Intelligent Symptom Analysis and Remedy Recommendation System**
*(college NLP mini-project — not a medical diagnosis tool)*

You walk into a friendly digital pharmacy and tell the animated chemist what you're feeling, in your own words.
MediMate runs that sentence through a real NLP pipeline — tokenization, lemmatization, symptom/entity extraction,
negation detection, and intent classification — before ever touching an LLM, then hands the *structured* result to
Groq to generate a safe, conversational reply grounded in a small curated knowledge base.

```
User Input → NLP Preprocessing → Symptom Extraction → Negation Detection →
Duration/Severity Extraction → Intent Classification → Knowledge Base →
Groq API → Safe Response → React UI
```

## Project structure

```
medimate/
├── frontend/            React (Vite) — chemist UI, chat, NLP pipeline visualizer, history, about
│   └── src/
│       ├── components/  Chemist, ChatBubble, AnalysisPanel, RemedyCard, MicButton
│       ├── pages/        Home, Analysis, History, About
│       ├── animations/  Chemist keyframes
│       └── services/    api.js — talks to the Flask backend
├── backend/              Flask API
│   ├── nlp/               preprocessing, symptom_extractor, entity_extractor, negation, intent_classifier, pipeline
│   ├── knowledge_base/   loader for data/symptoms.json
│   ├── services/         groq_service.py, recommendation.py, pdf_service.py
│   ├── routes/            /api/analyze, /api/history, /api/pdf
│   └── database.py        SQLite persistence (no auth, by design)
├── data/symptoms.json     curated healthcare knowledge base
└── .env.example
```

## Running it

### 1. Backend

```bash
cd backend
python3 -m venv venv && source venv/bin/activate   # optional but recommended
pip install -r requirements.txt
cp ../.env.example .env        # then edit GROQ_API_KEY
python app.py                  # runs on http://localhost:5000
```

Until you add a real `GROQ_API_KEY`, the backend automatically falls back to safe templated
chemist replies (see `services/groq_service.py`) — so the whole app is fully demoable offline,
e.g. during a viva with no internet.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                    # runs on http://localhost:5173, proxies /api to :5000
```

Open `http://localhost:5173`. The Vite dev server proxies API calls to the Flask backend automatically
(see `vite.config.js`), so no extra configuration is needed in development.

## Pages

| Page | What it shows |
|---|---|
| **Home** | Bento-grid dashboard — the chemist tile never leaves the screen and reacts with expression + gesture (wave, listening cup-ear, thinking hand-on-chin, talking, concerned point), speaks its short reply aloud via the Web Speech API, and stays glassmorphic and hover-responsive throughout. Replies are deliberately short and human — one line, not a paragraph. |
| **NLP Pipeline** | Step-by-step visualizer of raw text → tokens → lemmas → symptoms → negation → duration → severity → intent → recommendation. Built for presentations/viva. |
| **History** | Past consultations, read from the local SQLite database |
| **About** | Explains the architecture and why MediMate isn't "just a chatbot" |

### Home page interaction notes
- The chemist's tile is fixed in the bento grid at all times — there's no "before/after first message" screen swap.
- `frontend/src/utils/quip.js` trims whatever the backend returns down to one short, human sentence, as a safety net regardless of what Groq or the fallback template produce.
- `frontend/src/hooks/useSpeech.js` wraps the browser's `SpeechSynthesis` API, picks a softer-sounding voice where available, and exposes a mute toggle in the chemist tile.
- Gestures live in `frontend/src/components/Chemist.jsx` + `frontend/src/animations/chemist.css` — a separate arm/hand element rotates per state (idle micro-wave loop, listening cup-ear, thinking hand-on-chin, talking gesture loop, concerned point), and a one-shot head nod fires each time a new reply lands.


## Extending the knowledge base

Add a new entry to `data/symptoms.json` following the existing shape (`synonyms`, `remedies`, `otc`,
`warning_signs`, `consult_if`) — no code changes needed, the pipeline picks it up automatically.

## Upgrading the NLP

`backend/nlp/preprocessing.py` currently uses lightweight, dependency-free rules so the project runs
anywhere without downloading large language models. It's structured so you can swap in spaCy
(`en_core_web_sm`) for proper POS-aware lemmatization and dependency parsing without changing
`pipeline.py`'s contract — see the note at the bottom of that file.

## Safety

MediMate never claims a diagnosis, never prescribes dosages, and always surfaces red-flag symptoms with a
clear recommendation to seek professional care. See `backend/services/groq_service.py`'s system prompt and
`backend/nlp/pipeline.py`'s `RED_FLAG_PHRASES` for the exact rules.
