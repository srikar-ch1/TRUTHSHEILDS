"""
In-memory scan statistics for enterprise dashboard.
Used by GET /api/system-metrics.
"""
import time
import threading
from typing import Dict, Any

_lock = threading.Lock()
_start_time = time.time()

# In-memory counters
_total_video_scans = 0
_total_audio_scans = 0
_fake_detected_count = 0
_total_processing_time = 0.0
_processing_count = 0


def record_video_scan(authenticity_score: float, processing_time: float) -> None:
    global _total_video_scans, _fake_detected_count, _total_processing_time, _processing_count
    with _lock:
        _total_video_scans += 1
        _total_processing_time += processing_time
        _processing_count += 1
        if authenticity_score < 60:
            _fake_detected_count += 1


def record_audio_scan(processing_time: float, scam_high: bool = False) -> None:
    global _total_audio_scans, _fake_detected_count, _total_processing_time, _processing_count
    with _lock:
        _total_audio_scans += 1
        _total_processing_time += processing_time
        _processing_count += 1
        if scam_high:
            _fake_detected_count += 1


def get_scan_stats() -> Dict[str, Any]:
    """Return total_scans, fake_detected_count, average_processing_time_sec, uptime_seconds."""
    with _lock:
        total_scans = _total_video_scans + _total_audio_scans
        avg_time = (_total_processing_time / _processing_count) if _processing_count else 0.0
        return {
            "total_scans": total_scans,
            "fake_detected_count": _fake_detected_count,
            "average_processing_time_sec": round(avg_time, 2),
            "uptime_seconds": round(time.time() - _start_time, 1),
            "video_scans": _total_video_scans,
            "audio_scans": _total_audio_scans,
        }
