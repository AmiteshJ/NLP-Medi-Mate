from flask import Blueprint, request, jsonify

from nlp.pipeline import run_pipeline
from services.recommendation import build_remedies
from services.groq_service import get_chemist_reply
from database import save_consultation

analyze_bp = Blueprint("analyze", __name__)


@analyze_bp.route("/api/analyze", methods=["POST"])
def analyze():
    payload = request.get_json(silent=True) or {}
    text = (payload.get("text") or "").strip()

    if not text:
        return jsonify({"error": "Field 'text' is required."}), 400

    pipeline_result = run_pipeline(text)
    remedies = build_remedies(pipeline_result)

    structured_context = {
        "active_symptoms": pipeline_result["active_symptoms"],
        "duration": pipeline_result["duration"],
        "severity": pipeline_result["severity"],
        "intent": pipeline_result["intent"],
        "red_flag": pipeline_result["red_flag"],
        "knowledge_base_matches": remedies,
    }
    reply = get_chemist_reply(structured_context)

    save_consultation(
        user_input=text,
        symptoms=[s["label"] for s in pipeline_result["active_symptoms"]],
        intent=pipeline_result["intent"],
        reply=reply,
    )

    return jsonify({
        "reply": reply,
        "analysis": {
            "symptoms": pipeline_result["symptoms"],
            "duration": pipeline_result["duration"],
            "severity": pipeline_result["severity"],
            "body_parts": pipeline_result["body_parts"],
            "intent": pipeline_result["intent"],
            "keywords": pipeline_result["keywords"],
            "confidence": pipeline_result["confidence"],
            "red_flag": pipeline_result["red_flag"],
            "pipeline_trace": pipeline_result["pipeline_trace"],
        },
        "remedies": remedies,
    })
