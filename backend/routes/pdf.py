from flask import Blueprint, request, jsonify, send_file
import io

from services.pdf_service import generate_pdf

pdf_bp = Blueprint("pdf", __name__)


@pdf_bp.route("/api/pdf", methods=["POST"])
def download_pdf():
    payload = request.get_json(silent=True) or {}
    user_input = payload.get("text", "")
    analysis = payload.get("analysis", {})
    remedies = payload.get("remedies", [])

    if not analysis:
        return jsonify({"error": "Field 'analysis' is required."}), 400

    pdf_bytes = generate_pdf(user_input, analysis, remedies)
    return send_file(
        io.BytesIO(pdf_bytes),
        mimetype="application/pdf",
        as_attachment=True,
        download_name="MediMate-Summary.pdf",
    )
