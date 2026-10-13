"""
Final stage of the architecture:

  Structured Patient Context -> Knowledge Base excerpt -> Groq API -> Safe Response

Only structured data is sent to Groq -- never the raw user sentence alone --
so the model's answer is grounded in what the NLP pipeline actually
extracted, not just whatever it infers from free text.
"""
import os
import requests

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "REPLACE_WITH_YOUR_GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

SYSTEM_PROMPT = """You are the chemist character inside MediMate, a student NLP
mini-project (NOT a real medical device). You will be given structured
information already extracted by an NLP pipeline: symptoms, duration,
severity, intent, and matching knowledge-base entries.

Reply the way a real person behind a pharmacy counter would -- ONE short,
warm, natural sentence. Never more than 18 words. No lists, no multiple
sentences, no clinical tone. Think of it as the caption under a facial
expression, not a report.

Rules:
- Use ONLY the structured information given -- never invent new symptoms or remedies.
- Never claim a diagnosis or certainty.
- If `red_flag` is true, the one sentence must clearly say to see a doctor now.
- Do not repeat the disclaimer or mention OTC dosages -- that lives elsewhere in the UI.
- Sound human: contractions, warmth, brevity. E.g. "Ooh, that sounds rough -- since yesterday too. Let's sort you out." or "That combo worries me a little -- please get it checked today."
"""


def _build_user_message(structured_context: dict) -> str:
    return (
        "Structured patient context (from the NLP pipeline):\n"
        f"{structured_context}\n\n"
        "Write the chemist's reply following the system instructions."
    )


def get_chemist_reply(structured_context: dict) -> str:
    """
    Calls the Groq API with the structured context. Falls back to a safe
    templated reply if no real API key is configured or the call fails, so
    the app remains fully demoable offline (e.g. during a viva with no
    internet access).
    """
    if not GROQ_API_KEY or GROQ_API_KEY == "REPLACE_WITH_YOUR_GROQ_API_KEY":
        return _fallback_reply(structured_context)

    try:
        response = requests.post(
            GROQ_URL,
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": GROQ_MODEL,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": _build_user_message(structured_context)},
                ],
                "temperature": 0.6,
                "max_tokens": 60,
            },
            timeout=15,
        )
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"].strip()
    except Exception:
        # Network / auth / rate-limit failure -- degrade gracefully instead
        # of breaking the demo.
        return _fallback_reply(structured_context)


def _fallback_reply(ctx: dict) -> str:
    active = ctx.get("active_symptoms") or []

    if ctx.get("red_flag"):
        return "That sounds serious -- please see a doctor now, don't wait on this."

    if not active:
        return "Hmm, tell me a little more -- what exactly are you feeling?"

    names = " and ".join(s["label"].lower() for s in active)
    dur = ctx.get("duration")
    duration = f" {dur}" if dur else ""
    return f"Got it -- {names}{duration}. Let's sort you out."
