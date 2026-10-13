import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

from database import init_db
from routes.analyze import analyze_bp
from routes.history import history_bp
from routes.pdf import pdf_bp


def create_app():
    app = Flask(__name__)
    CORS(app)  # dev-friendly; tighten origins for production

    init_db()

    app.register_blueprint(analyze_bp)
    app.register_blueprint(history_bp)
    app.register_blueprint(pdf_bp)

    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok", "service": "medimate-backend"})

    return app


app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(debug=True, port=port)
