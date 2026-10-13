from flask import Blueprint, jsonify
from database import list_consultations

history_bp = Blueprint("history", __name__)


@history_bp.route("/api/history", methods=["GET"])
def history():
    return jsonify({"consultations": list_consultations()})
