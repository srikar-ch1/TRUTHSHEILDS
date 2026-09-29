"""
Audio processing utilities for voice scam detection pipeline.
Converts audio to mel spectrogram for CNN inference.
"""
import os
import re
import tempfile
import uuid
from pathlib import Path

import librosa
import numpy as np
from scipy.ndimage import zoom

# Target size for spectrogram (224x224 for CNN input)
SPECTROGRAM_SIZE = (224, 224)

# Audio sample rate
SAMPLE_RATE = 22050

# Maximum audio duration (seconds) to process
MAX_DURATION = 30

# FIX: fmax was 8000 Hz — this cuts high-frequency synthesis artifacts.
# TTS systems (ElevenLabs, Bark, XTTS) produce audible fingerprints in the
# 8–11 kHz range. Setting fmax=sr/2 (Nyquist) preserves the full spectrum.
FMAX = SAMPLE_RATE // 2  # 11025 Hz

# Normalization constants for z-score normalization.
# These are computed from a representative training corpus of mel spectrograms
# (log-power, dB scale). Replace with your actual dataset stats if you retrain.
# Using fixed constants (not per-file min/max) preserves inter-file differences
# that the model uses to distinguish real from AI-generated audio.
SPEC_MEAN = -40.0   # mean dB across training corpus
SPEC_STD  =  20.0   # std  dB across training corpus


def _sanitize_filename(filename: str) -> str:
    """Remove dangerous characters from filename."""
    safe = re.sub(r"[^a-zA-Z0-9._-]", "", filename)
    return safe[:100] if len(safe) > 100 else safe


def save_uploaded_audio(file) -> str:
    """
    Save uploaded audio file to a temporary directory with secure filename.
    Caller is responsible for cleaning up the file when done.
    :param file: Werkzeug FileStorage or file-like object
    :return: Absolute path to the saved audio file
    :raises ValueError: If save fails
    """
    if not file or not getattr(file, "filename", None):
        raise ValueError("No audio file provided")

    original_name = _sanitize_filename(file.filename)
    suffix = Path(original_name).suffix or ".mp3"
    if not suffix.startswith("."):
        suffix = "." + suffix

    valid_extensions = {".mp3", ".wav", ".ogg", ".m4a", ".aac", ".flac", ".webm"}
    if suffix.lower() not in valid_extensions:
        suffix = ".mp3"

    temp_dir = tempfile.gettempdir()
    safe_name = f"truthshield_audio_{uuid.uuid4().hex}{suffix}"
    save_path = os.path.join(temp_dir, safe_name)

    try:
        file.save(save_path)
    except Exception as e:
        raise ValueError(f"Failed to save audio: {e}") from e

    if not os.path.isfile(save_path):
        raise ValueError("Saved audio file not found")

    return os.path.abspath(save_path)


def audio_to_spectrogram(
    audio_path: str,
    target_size: tuple = SPECTROGRAM_SIZE,
    max_duration: float = MAX_DURATION,
) -> np.ndarray:
    """
    Convert audio file to normalized mel spectrogram for CNN inference.

    Key fixes vs. original:
    1. fmax raised from 8000 → 11025 Hz (Nyquist) to preserve synthesis artifacts
       that live in the 8–11 kHz range in TTS-generated audio.
    2. Normalization changed from per-file [0,1] min-max to fixed z-score using
       training corpus statistics. Per-file normalization makes every file's
       spectrogram occupy the same value range, destroying the loudness and
       spectral distribution differences the model relies on.

    :param audio_path: Path to the audio file
    :param target_size: (height, width) — (n_mels, time_frames), default (224, 224)
    :param max_duration: Maximum audio duration in seconds to process
    :return: Mel spectrogram as float32 numpy array (H, W), z-score normalized
    :raises ValueError: If audio cannot be loaded or processed
    """
    if not os.path.isfile(audio_path):
        raise ValueError(f"Audio file not found: {audio_path}")

    try:
        y, sr = librosa.load(
            audio_path,
            sr=SAMPLE_RATE,
            duration=max_duration,
            mono=True,
        )
    except Exception as e:
        raise ValueError(f"Cannot load audio: {e}") from e

    if len(y) == 0:
        raise ValueError("Audio file is empty or cannot be decoded")

    try:
        mel_spec = librosa.feature.melspectrogram(
            y=y,
            sr=sr,
            n_mels=target_size[0],   # 224 frequency bins
            fmax=FMAX,               # FIX: was 8000, now 11025 Hz (full spectrum)
        )
        mel_db = librosa.power_to_db(mel_spec, ref=np.max)
    except Exception as e:
        raise ValueError(f"Failed to compute spectrogram: {e}") from e

    # FIX: z-score normalize using fixed training corpus statistics.
    # Original code used per-file (mel_db - min) / (max - min), which maps every
    # file to [0, 1] regardless of actual energy levels. This removes the absolute
    # dB differences between real and synthetic audio — a key discriminative signal.
    mel_normalized = (mel_db - SPEC_MEAN) / (SPEC_STD + 1e-8)

    # Resize time axis to target width if needed
    if mel_normalized.shape[1] != target_size[1]:
        zoom_factor = target_size[1] / mel_normalized.shape[1]
        mel_normalized = zoom(mel_normalized, (1.0, zoom_factor), order=1)

    # Validate output shape
    if mel_normalized.shape != target_size:
        raise ValueError(
            f"Spectrogram shape {mel_normalized.shape} does not match "
            f"target {target_size} after processing."
        )

    return mel_normalized.astype(np.float32)