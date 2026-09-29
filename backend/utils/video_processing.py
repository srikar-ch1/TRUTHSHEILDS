"""
Video processing utilities for deepfake detection pipeline.
Production-ready: secure filenames, efficient frame extraction, robust error handling.
"""
import os
import re
import tempfile
import uuid
from pathlib import Path

import cv2
import numpy as np

# Default frame size for ResNet/ViT-style input
TARGET_SIZE = (224, 224)

# Extract 1 frame per second (assuming ~30fps: every 30 frames)
DEFAULT_FRAME_INTERVAL = 30

# Maximum frames for fast inference (< 5 seconds on CPU)
MAX_FRAMES = 20


def _sanitize_filename(filename: str) -> str:
    """Remove dangerous characters from filename."""
    safe = re.sub(r"[^a-zA-Z0-9._-]", "", filename)
    return safe[:100] if len(safe) > 100 else safe


def save_uploaded_video(file) -> str:
    """
    Save uploaded file to a temporary directory with secure filename.
    Caller is responsible for cleaning up the file when done.

    :param file: Werkzeug FileStorage or file-like object
    :return: Absolute path to the saved video file
    :raises ValueError: If save fails
    """
    if not file or not getattr(file, "filename", None):
        raise ValueError("No video file provided")

    original_name = _sanitize_filename(file.filename)
    suffix = Path(original_name).suffix or ".mp4"
    if not suffix.startswith("."):
        suffix = "." + suffix

    valid_extensions = {".mp4", ".webm", ".mov", ".avi", ".mkv", ".mpeg", ".mpg", ".flv"}
    if suffix.lower() not in valid_extensions:
        suffix = ".mp4"

    temp_dir = tempfile.gettempdir()
    safe_name = f"truthshield_{uuid.uuid4().hex}{suffix}"
    save_path = os.path.join(temp_dir, safe_name)

    try:
        file.save(save_path)
    except Exception as e:
        raise ValueError(f"Failed to save video: {e}") from e

    if not os.path.isfile(save_path):
        raise ValueError("Saved video file not found after write")

    return os.path.abspath(save_path)


def extract_frames(
    video_path: str,
    frame_interval: int = DEFAULT_FRAME_INTERVAL,
    target_size: tuple = TARGET_SIZE,
    max_frames: int = MAX_FRAMES,
) -> list:
    """
    Extract frames from a video for inference.
    Samples frames evenly (1 per second by default).
    Frames are resized to target_size and returned as RGB uint8 arrays.

    :param video_path: Path to the video file
    :param frame_interval: Take 1 frame every N frames (default 30 = ~1fps at 30fps)
    :param target_size: (width, height) to resize each frame (default 224x224)
    :param max_frames: Maximum number of frames to return (default 20)
    :return: List of numpy arrays shape (H, W, 3), RGB, uint8
    :raises ValueError: If video cannot be opened or no frames extracted
    """
    if not os.path.isfile(video_path):
        raise ValueError(f"Video file not found: {video_path}")

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError(f"Cannot open video: {video_path}")

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    # If video is short, sample more densely so we still get max_frames
    if total_frames > 0 and total_frames < max_frames * frame_interval:
        frame_interval = max(1, total_frames // max_frames)

    frames = []
    frame_idx = 0

    try:
        while len(frames) < max_frames:
            ret, frame = cap.read()
            if not ret:
                break
            if frame_idx % frame_interval == 0:
                rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                resized = cv2.resize(rgb, target_size, interpolation=cv2.INTER_LINEAR)
                frames.append(resized)
            frame_idx += 1
    except Exception as e:
        raise ValueError(f"Error extracting frames: {e}") from e
    finally:
        cap.release()

    if not frames:
        raise ValueError(f"No frames extracted from video: {video_path}")

    return frames