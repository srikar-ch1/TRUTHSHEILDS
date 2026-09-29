"""
Lightweight system metrics for enterprise dashboard.
Uses psutil when available; returns safe defaults otherwise.
"""
import logging
import time
from typing import Dict, Any

logger = logging.getLogger(__name__)

_psutil = None

def _get_psutil():
    global _psutil
    if _psutil is None:
        try:
            import psutil as p
            _psutil = p
        except ImportError:
            _psutil = False
    return _psutil


def get_system_metrics() -> Dict[str, Any]:
    """Return inference_device, memory_usage_mb, cpu_usage_percent."""
    metrics = {
        "inference_device": "CPU",
        "memory_usage_mb": 0.0,
        "cpu_usage_percent": 0.0,
    }
    p = _get_psutil()
    if p:
        try:
            process = p.Process()
            metrics["memory_usage_mb"] = round(process.memory_info().rss / (1024 * 1024), 2)
            metrics["cpu_usage_percent"] = round(p.cpu_percent(interval=0.1), 1)
        except Exception as e:
            logger.debug("System metrics partial: %s", e)
    return metrics
