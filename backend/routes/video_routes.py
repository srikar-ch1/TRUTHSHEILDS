"""
Video analysis routes – deepfake detection API.
Production-ready: REAL AI inference only, no simulation fallbacks.
"""
import logging
import os
import re
import tempfile
import uuid
from pathlib import Path

from flask import Blueprint, request, jsonify

logger = logging.getLogger(__name__)

from utils.system_metrics import get_system_metrics
from utils.scan_stats import record_video_scan, get_scan_stats

try:
    from utils.video_processing import save_uploaded_video
    from models.deepfake_model import predict_video
    AI_PIPELINE_AVAILABLE = True
    logger.info("Video route: Real AI pipeline loaded successfully")
except ImportError as e:
    AI_PIPELINE_AVAILABLE = False
    logger.warning("Video route: Real AI pipeline UNAVAILABLE (Missing: %s). Simulated fallback available.", e)

video_bp = Blueprint("video", __name__)

ALLOWED_EXTENSIONS = {".mp4", ".mov"}
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100 MB


def _sanitize_filename(filename: str) -> str:
    safe = re.sub(r"[^a-zA-Z0-9._-]", "", filename)
    return safe[:100] if len(safe) > 100 else safe


def _validate_video_file(file) -> None:
    if not file or not getattr(file, "filename", None):
        raise ValueError("No video file provided")
    raw_name = getattr(file, "filename", "") or ""
    filename = _sanitize_filename(raw_name).lower() or "video.mp4"
    ext = Path(filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError("Invalid video format. Allowed: MP4, MOV")
    if hasattr(file, "content_length") and file.content_length and file.content_length > MAX_FILE_SIZE:
        raise ValueError(f"File too large. Maximum size: {MAX_FILE_SIZE / (1024*1024):.0f} MB")


def _confidence_level(authenticity_score: float) -> str:
    if authenticity_score >= 85:
        return "High Confidence"
    elif authenticity_score >= 70:
        return "Moderate Confidence"
    else:
        return "Low Confidence"


def _threat_category(threat_index: float) -> str:
    if threat_index < 30:
        return "Low Threat"
    elif threat_index < 60:
        return "Medium Threat"
    else:
        return "High Threat"


def _risk_and_explanation(authenticity_score: float, frames_analyzed: int) -> tuple:
    if authenticity_score >= 80:
        return (
            "Real",
            f"Analysis of {frames_analyzed} frames shows natural temporal consistency. "
            "No significant synthetic artifacts detected.",
        )
    if authenticity_score >= 60:
        return (
            "Suspicious",
            f"Analysis of {frames_analyzed} frames detected minor spatial artifacts. "
            "Recommend manual review.",
        )
    return (
        "Fake",
        f"Analysis of {frames_analyzed} frames detected synthetic artifacts across multiple regions. "
        "High confidence of AI-generated or manipulated content.",
    )


def _compute_threat_index(
    authenticity_score: float,
    temporal_stability: float,
) -> float:
    """
    Compute threat index from two INDEPENDENT signals.

    FIX: Original code defined artifact_score = fake_prob, making it identical
    to fake_prob. The formula looked like it used 3 signals but only used 2,
    with fake_prob effectively weighted at 0.8 instead of 0.6.

    Now uses genuinely separate signals:
      - fake_probability    (0–1): direct model output — how likely is this fake?
      - temporal_instability(0–1): inconsistency across frames — flickering = AI tell
    """
    fake_probability = (100.0 - authenticity_score) / 100.0
    temporal_instability = (100.0 - temporal_stability) / 100.0

    # 70% weight on model's fake probability, 30% on temporal inconsistency
    threat_index = (fake_probability * 0.70 + temporal_instability * 0.30) * 100.0
    return round(max(0.0, min(100.0, threat_index)), 1)


@video_bp.route("/analyze-video", methods=["POST"])
def analyze_video():
    """
    Deepfake video analysis using REAL AI inference only.
    Requires: torch, transformers, opencv-python-headless, numpy.
    """
    if not AI_PIPELINE_AVAILABLE:
        logger.error("Video analysis requested but AI pipeline not available")
        return jsonify({
            "error": "AI inference pipeline unavailable. "
                     "Install: torch, transformers, opencv-python-headless, numpy"
        }), 503

    video_path = None
    try:
        f = request.files.get("video")
        _validate_video_file(f)

        filename = getattr(f, "filename", "unknown")
        logger.info("=== Video analysis request: %s ===", filename)

        video_path = save_uploaded_video(f)
        if not os.path.isfile(video_path):
            raise ValueError("Failed to save uploaded video file")

        logger.info("Extracting frames and running AI inference...")

        result = predict_video(
            video_path,
            frame_interval=30,
            max_frames=20,
        )
        (
            authenticity_score,
            frames_analyzed,
            processing_time,
            temporal_stability_score,
            heatmap_base64,
        ) = result

        logger.info(
            "Inference complete | authenticity=%.1f | frames=%d | time=%.2fs | stability=%.1f",
            authenticity_score, frames_analyzed, processing_time, temporal_stability_score,
        )

        # Threat index using two genuinely independent signals
        threat_index = _compute_threat_index(authenticity_score, temporal_stability_score)

        risk_level, explanation = _risk_and_explanation(authenticity_score, frames_analyzed)
        confidence_level = _confidence_level(authenticity_score)
        threat_category = _threat_category(threat_index)

        sys_metrics = get_system_metrics()
        record_video_scan(authenticity_score, processing_time)

        return jsonify({
            "authenticity_score": authenticity_score,
            "risk_level": risk_level,
            "confidence_level": confidence_level,
            "explanation": explanation,
            "threat_index": threat_index,
            "threat_category": threat_category,
            "temporal_stability_score": temporal_stability_score,
            "frames_analyzed": frames_analyzed,
            "processing_time": processing_time,
            "heatmap_available": heatmap_base64 is not None,
            "heatmap_image": heatmap_base64,
            "model_used": "TruthShield-Vision-v2.0 (Spatial-Frequency & Temporal Analyzer)",
            "inference_device": sys_metrics["inference_device"],
            "memory_usage_mb": sys_metrics["memory_usage_mb"],
            "cpu_usage_percent": sys_metrics["cpu_usage_percent"],
        })

    except ValueError as e:
        logger.warning("Validation error: %s", e)
        return jsonify({"error": str(e)}), 400
    except FileNotFoundError as e:
        logger.error("File not found: %s", e)
        return jsonify({"error": "Video file not found or could not be processed"}), 404
    except Exception as e:
        logger.exception("Video analysis failed: %s", e)
        return jsonify({"error": "Video analysis failed. Please ensure the video is valid."}), 500
    finally:
        if video_path and os.path.isfile(video_path):
            try:
                os.remove(video_path)
                logger.debug("Temp video deleted: %s", video_path)
            except OSError as err:
                logger.warning("Could not remove temp video %s: %s", video_path, err)


@video_bp.route("/system-metrics", methods=["GET"])
def system_metrics():
    try:
        stats = get_scan_stats()
        return jsonify(stats)
    except Exception as e:
        logger.exception("System metrics failed: %s", e)
        return jsonify({
            "total_scans": 0,
            "fake_detected_count": 0,
            "average_processing_time_sec": 0.0,
            "uptime_seconds": 0.0,
            "video_scans": 0,
            "audio_scans": 0,
        }), 500