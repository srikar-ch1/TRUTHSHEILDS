"""
Voice Scam & AI Voice Clone Detection Model – TruthShield Audio Engine
Acoustic feature analysis using librosa, scipy, and numpy.
Extracts pitch dynamics, spectral roll-off, harmonic consistency, and MFCC variance.
Optimized for CPU inference without external network dependencies.
"""

import logging
import os
import time
from typing import Tuple

import librosa
import numpy as np
import scipy.signal

logger = logging.getLogger(__name__)

SAMPLE_RATE = 16000
MAX_DURATION = 30.0  # seconds


def _load_audio_file(audio_path: str) -> Tuple[np.ndarray, int]:
    """Load audio file as mono float32 array at standard 16kHz."""
    if not os.path.isfile(audio_path):
        raise FileNotFoundError(f"Audio file not found: {audio_path}")

    try:
        y, sr = librosa.load(
            audio_path,
            sr=SAMPLE_RATE,
            mono=True,
            duration=MAX_DURATION,
        )
    except Exception as e:
        raise ValueError(f"Cannot decode audio file '{audio_path}': {e}") from e

    if len(y) == 0:
        raise ValueError(f"Audio file is empty or cannot be decoded: {audio_path}")

    # Remove silent lead/trail
    y_trimmed, _ = librosa.effects.trim(y, top_db=35)
    if len(y_trimmed) < int(SAMPLE_RATE * 0.2):
        # Too short after trim, retain original
        y_trimmed = y

    return y_trimmed, sr


def _analyze_pitch_dynamics(y: np.ndarray, sr: int) -> float:
    """
    Analyze pitch (F0) dynamics to detect synthetic flat pitch or rigid quantization.
    Returns synthetic indicator score (0-1, higher = more synthetic).
    """
    try:
        # Use YIN algorithm with human speech fundamental frequency bounds [65Hz - 400Hz]
        f0 = librosa.yin(y, fmin=65, fmax=400, sr=sr)
        valid_f0 = f0[~np.isnan(f0)]

        if len(valid_f0) < 10:
            return 0.4

        # Compute pitch coefficient of variation
        mean_f0 = np.mean(valid_f0)
        std_f0 = np.std(valid_f0)
        cv_f0 = std_f0 / (mean_f0 + 1e-4)

        # Natural human speech pitch CV is typically 0.15 - 0.40
        # Overly flat (<0.10) or erratic jumps (>0.55) indicate synthetic vocoder artifacts
        if cv_f0 < 0.10:
            pitch_anomaly = (0.10 - cv_f0) / 0.10
        elif cv_f0 > 0.55:
            pitch_anomaly = min(1.0, (cv_f0 - 0.55) / 0.30)
        else:
            pitch_anomaly = 0.15

        # Measure micro-jitter (pitch perturbation between adjacent frames)
        diff_f0 = np.abs(np.diff(valid_f0))
        jitter = np.mean(diff_f0) / (mean_f0 + 1e-4)

        # Extreme jitter or near-zero jitter indicates unnatural synthesis
        jitter_anomaly = 1.0 if jitter < 0.005 or jitter > 0.25 else 0.2

        return float(np.clip(0.6 * pitch_anomaly + 0.4 * jitter_anomaly, 0.0, 1.0))
    except Exception as e:
        logger.debug("Pitch analysis fallback: %s", e)
        return 0.35


def _analyze_spectral_features(y: np.ndarray, sr: int) -> float:
    """
    Analyze spectral rolloff and flatness.
    AI speech generators frequently exhibit high-frequency dampening and uniform noise floors.
    Returns synthetic indicator score (0-1, higher = more synthetic).
    """
    try:
        # Spectral Flatness: synthetic vocoders often have higher flatness in unvoiced regions
        flatness = librosa.feature.spectral_flatness(y=y)
        mean_flatness = float(np.mean(flatness))

        # Spectral Rolloff (85% energy frequency)
        rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr, roll_percent=0.85)
        mean_rolloff = float(np.mean(rolloff))

        # Typical human speech rolloff: 2500 - 4500 Hz at 16kHz
        rolloff_anomaly = 0.0
        if mean_rolloff < 2000:
            rolloff_anomaly = min(1.0, (2000 - mean_rolloff) / 1000)
        elif mean_rolloff > 5500:
            rolloff_anomaly = min(1.0, (mean_rolloff - 5500) / 1500)

        flatness_anomaly = min(1.0, mean_flatness * 18.0)

        return float(np.clip(0.55 * rolloff_anomaly + 0.45 * flatness_anomaly, 0.0, 1.0))
    except Exception as e:
        logger.debug("Spectral analysis fallback: %s", e)
        return 0.35


def _analyze_mfcc_dynamics(y: np.ndarray, sr: int) -> float:
    """
    Analyze Mel-Frequency Cepstral Coefficients and transition deltas.
    Human speech exhibits rich phoneme transition dynamics.
    Returns synthetic indicator score (0-1, higher = more synthetic).
    """
    try:
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        delta_mfcc = librosa.feature.delta(mfcc)

        # Measure temporal variance across delta coefficients
        delta_vars = np.var(delta_mfcc, axis=1)
        mean_delta_var = float(np.mean(delta_vars))

        # Synthetic voices often have lower dynamic variation across phoneme transitions
        if mean_delta_var < 1.2:
            mfcc_anomaly = min(1.0, (1.2 - mean_delta_var) / 1.0)
        else:
            mfcc_anomaly = 0.15

        return float(np.clip(mfcc_anomaly, 0.0, 1.0))
    except Exception as e:
        logger.debug("MFCC analysis fallback: %s", e)
        return 0.35


def predict_audio(audio_path: str) -> Tuple[float, float, float]:
    """
    Run voice scam / deepfake audio detection on an audio file.

    Returns:
        Tuple of:
            - authenticity_score (0-100, higher = more likely authentic human voice)
            - scam_probability (0-100, higher = more likely AI-generated / voice scam)
            - processing_time (seconds)
    """
    start_time = time.time()

    y, sr = _load_audio_file(audio_path)

    # Multi-feature extraction
    pitch_score = _analyze_pitch_dynamics(y, sr)
    spectral_score = _analyze_spectral_features(y, sr)
    mfcc_score = _analyze_mfcc_dynamics(y, sr)

    # Harmonic to noise check
    try:
        y_harmonic, y_percussive = librosa.effects.hpss(y)
        harmonic_ratio = float(np.sum(y_harmonic ** 2) / (np.sum(y ** 2) + 1e-6))
        # Excessive harmonicity (>0.92) or lack of harmonics (<0.35) can indicate synthetic generation
        hnr_anomaly = 0.6 if harmonic_ratio > 0.92 or harmonic_ratio < 0.35 else 0.15
    except Exception:
        hnr_anomaly = 0.3

    # Weighted synthetic probability (0 - 1)
    synthetic_prob = (
        0.35 * pitch_score
        + 0.25 * spectral_score
        + 0.25 * mfcc_score
        + 0.15 * hnr_anomaly
    )
    synthetic_prob = float(np.clip(synthetic_prob, 0.05, 0.95))

    # Authenticity score: 100 - (synthetic_prob * 100)
    authenticity_score = round(max(5.0, min(96.0, (1.0 - synthetic_prob) * 100.0)), 1)
    scam_probability = round(100.0 - authenticity_score, 1)

    processing_time = round(time.time() - start_time, 2)

    logger.info(
        "predict_audio completed: auth=%.1f, scam=%.1f, time=%.2fs, pitch=%.2f, spectral=%.2f, mfcc=%.2f",
        authenticity_score,
        scam_probability,
        processing_time,
        pitch_score,
        spectral_score,
        mfcc_score,
    )

    return (authenticity_score, scam_probability, processing_time)