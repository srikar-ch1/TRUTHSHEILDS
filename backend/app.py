"""
TRUTHSHIELD – AI Digital Trust Engine
Flask application entry point.
Production-ready: logging, error handling, CORS, health checks.
"""
import logging
import os
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

from flask import Flask, redirect
from flask_cors import CORS

from routes.video_routes import video_bp
from routes.audio_routes import audio_bp
from routes.url_routes import url_bp
from routes.text_routes import text_bp

FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173")
CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174").split(",")

# Setup logging
LOG_DIR = Path(__file__).parent / "logs"
LOG_DIR.mkdir(exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.FileHandler(LOG_DIR / f"truthshield_{datetime.now().strftime('%Y%m%d')}.log"),
        logging.StreamHandler(),
    ],
)

logger = logging.getLogger(__name__)


def create_app() -> Flask:
    app = Flask(__name__)
    app.config["MAX_CONTENT_LENGTH"] = int(os.environ.get("MAX_CONTENT_LENGTH", 100 * 1024 * 1024))  # 100 MB default
    CORS(app)

    app.register_blueprint(video_bp, url_prefix="/api")
    app.register_blueprint(audio_bp, url_prefix="/api")
    app.register_blueprint(url_bp, url_prefix="/api")
    app.register_blueprint(text_bp, url_prefix="/api")

    @app.route("/")
    def index():
        return redirect(FRONTEND_URL, code=302)

    @app.route("/health")
    def health():
        return {
            "status": "ok",
            "service": "truthshield-api",
            "version": "2.0.0",
            "capabilities": ["video", "audio", "url", "text"],
        }

    @app.errorhandler(413)
    def too_large(e):
        logger.warning("Request too large: %s", e)
        return {"error": "File too large"}, 413

    @app.errorhandler(500)
    def internal_error(e):
        logger.exception("Internal server error: %s", e)
        return {"error": "Internal server error"}, 500

    logger.info("TRUTHSHIELD API v2.0.0 initialized — capabilities: video, audio, url, text")
    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
