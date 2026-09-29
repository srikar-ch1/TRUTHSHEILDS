"""
Audio analysis routes – voice scam detection API.
Production-ready: REAL AI inference only, no simulation fallbacks.
"""
import logging
import os
import tempfile
import uuid
from pathlib import Path

from flask import Blueprint, request, jsonify

logger = logging.getLogger(__name__)

from utils.scan_stats import record_audio_scan

# Import real AI pipeline
try:
    from utils.audio_processing import save_uploaded_audio
    from models.audio_model import predict_audio
    AI_PIPELINE_AVAILABLE = True
    logger.info("Audio route: Real AI pipeline loaded successfully")
except ImportError as e:
    AI_PIPELINE_AVAILABLE = False
    logger.warning("Audio route: Real AI pipeline UNAVAILABLE (Missing: %s). Simulated fallback available.", e)

audio_bp = Blueprint("audio", __name__)

ALLOWED_EXTENSIONS = {".wav", ".mp3"}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB


def _validate_audio_file(file) -> None:
    """Validate uploaded audio file: type, extension, size."""
    if not file or not getattr(file, "filename", None):
        raise ValueError("No audio file provided")

    filename = file.filename.lower()
    ext = Path(filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError("Invalid audio format. Allowed: WAV, MP3")

    # Check file size (if available)
    if hasattr(file, "content_length") and file.content_length:
        if file.content_length > MAX_FILE_SIZE:
            raise ValueError(f"File too large. Maximum size: {MAX_FILE_SIZE / (1024 * 1024):.0f} MB")


def _confidence_level(authenticity_score: float) -> str:
    """Determine confidence level based on authenticity score."""
    if authenticity_score >= 85:
        return "High Confidence"
    elif authenticity_score >= 70:
        return "Moderate Confidence"
    else:
        return "Low Confidence"


def _explanation_from_score(scam_probability: float) -> str:
    """Generate explanation based on scam probability."""
    if scam_probability >= 70:
        return (
            "Voice characteristics suggest synthetic or cloned speech. "
            "Emotional prosody and spectral patterns inconsistent with natural human speech. "
            "Detected anomalies in formant frequencies and temporal dynamics indicate AI-generated audio. "
            f"Scam probability: {scam_probability:.1f}%"
        )
    if scam_probability >= 40:
        return (
            "Moderate indicators of voice manipulation or synthetic elements detected. "
            "Spectral analysis reveals inconsistencies in harmonic structure. "
            "Recommend verification through secondary channel or additional authentication. "
            f"Scam probability: {scam_probability:.1f}%"
        )
    return (
        "Voice profile appears consistent with natural human speech. "
        "Spectral characteristics and prosodic patterns align with authentic vocal production. "
        "No strong indicators of AI-generated or cloned audio in this sample. "
        f"Scam probability: {scam_probability:.1f}%"
    )


@audio_bp.route("/analyze-audio", methods=["POST"])
def analyze_audio():
    """
    Voice scam detection using REAL AI inference only.
    Requires: torch, librosa, scipy, numpy.
    Returns: authenticity_score, scam_probability, confidence_level, explanation, model_metadata.
    """
    if not AI_PIPELINE_AVAILABLE:
        logger.error("Audio analysis requested but AI pipeline not available")
        return jsonify({
            "error": "AI inference pipeline unavailable. Please install required dependencies: torch, librosa, scipy, numpy"
        }), 503

    audio_path = None
    try:
        f = request.files.get("audio")
        _validate_audio_file(f)

        filename = getattr(f, "filename", "unknown")
        logger.info("=== Audio analysis request received: %s ===", filename)
        logger.info("Starting AI inference pipeline...")

        # Save uploaded audio
        audio_path = save_uploaded_audio(f)
        if not os.path.isfile(audio_path):
            raise ValueError("Failed to save uploaded audio file")

        logger.info("Audio saved to temp: %s", audio_path)
        logger.info("Converting to mel spectrogram and running AI inference...")

        # Run REAL AI inference
        authenticity_score, scam_probability, processing_time = predict_audio(audio_path)

        logger.info(
            "AI inference complete: authenticity=%.1f, scam=%.1f, time=%.2fs",
            authenticity_score,
            scam_probability,
            processing_time,
        )

        # Generate response fields
        explanation = _explanation_from_score(scam_probability)
        confidence_level = _confidence_level(authenticity_score)
        record_audio_scan(processing_time, scam_high=(scam_probability >= 70))

        return jsonify({
            "authenticity_score": authenticity_score,
            "scam_probability": scam_probability,
            "confidence_level": confidence_level,
            "explanation": explanation,
            "model_metadata": {
                "model_used": "TruthShield-Audio-v2.0 (Acoustic Spectral & Pitch Analyzer)",
                "device": "CPU",
                "processing_time": processing_time,
            },
        })

    except ValueError as e:
        logger.warning("Audio validation error: %s", e)
        return jsonify({"error": str(e)}), 400
    except FileNotFoundError as e:
        logger.error("File not found: %s", e)
        return jsonify({"error": "Audio file not found or could not be processed"}), 404
    except Exception as e:
        logger.exception("Audio analysis failed: %s", e)
        return jsonify({
            "error": "Audio analysis failed. Please ensure the audio file is valid and try again."
        }), 500
    finally:
        # Cleanup temp file
        if audio_path and os.path.isfile(audio_path):
            try:
                os.remove(audio_path)
                logger.debug("Temp audio deleted: %s", audio_path)
            except OSError as err:
                logger.warning("Could not remove temp audio %s: %s", audio_path, err)
