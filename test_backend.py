"""
TRUTHSHIELD - Comprehensive Backend Test Suite
Can execute either against a live running server (http://127.0.0.1:5000)
or directly in-process via Flask test_client if the server is offline.
"""

import io
import json
import os
import sys
import tempfile
import urllib.request
import urllib.error
import wave
import numpy as np

# Add api directory to import index
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "api"))
try:
    from index import app as flask_app
    FLASK_CLIENT = flask_app.test_client()
except Exception as e:
    FLASK_CLIENT = None

BASE_URL = "http://127.0.0.1:5000"


def _is_server_alive() -> bool:
    try:
        res = urllib.request.urlopen(f"{BASE_URL}/health", timeout=1.0)
        return res.status == 200
    except Exception:
        return False


USE_LIVE_SERVER = _is_server_alive()


def _request_get(path: str):
    if USE_LIVE_SERVER:
        res = urllib.request.urlopen(f"{BASE_URL}{path}")
        return json.loads(res.read())
    else:
        res = FLASK_CLIENT.get(path)
        assert res.status_code == 200, f"GET {path} returned {res.status_code}"
        return res.get_json()


def _request_post_json(path: str, data: dict):
    if USE_LIVE_SERVER:
        payload = json.dumps(data).encode("utf-8")
        req = urllib.request.Request(
            f"{BASE_URL}{path}",
            data=payload,
            headers={"Content-Type": "application/json"},
        )
        res = urllib.request.urlopen(req)
        return json.loads(res.read())
    else:
        res = FLASK_CLIENT.post(path, json=data)
        assert res.status_code == 200, f"POST {path} returned {res.status_code}"
        return res.get_json()


def _request_post_file(path: str, field_name: str, file_name: str, file_bytes: bytes, content_type: str):
    if USE_LIVE_SERVER:
        boundary = "----TruthShieldBoundaryXYZ12345"
        body = bytearray()
        body.extend(f"--{boundary}\r\n".encode("utf-8"))
        body.extend(f'Content-Disposition: form-data; name="{field_name}"; filename="{file_name}"\r\n'.encode("utf-8"))
        body.extend(f"Content-Type: {content_type}\r\n\r\n".encode("utf-8"))
        body.extend(file_bytes)
        body.extend(f"\r\n--{boundary}--\r\n".encode("utf-8"))

        req = urllib.request.Request(
            f"{BASE_URL}{path}",
            data=bytes(body),
            headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
        )
        res = urllib.request.urlopen(req)
        return json.loads(res.read())
    else:
        data = {field_name: (io.BytesIO(file_bytes), file_name)}
        res = FLASK_CLIENT.post(path, data=data, content_type="multipart/form-data")
        assert res.status_code == 200, f"POST {path} returned {res.status_code}"
        return res.get_json()


def test_health():
    print("Testing /health ...")
    data = _request_get("/health")
    print("  Status:", data.get("status"), "| Capabilities:", data.get("capabilities"))
    assert data.get("status") == "ok"
    assert "video" in data.get("capabilities", [])
    assert "audio" in data.get("capabilities", [])
    assert "url" in data.get("capabilities", [])
    assert "text" in data.get("capabilities", [])
    print("  -> /health PASSED")


def test_system_metrics():
    print("Testing /api/system-metrics ...")
    data = _request_get("/api/system-metrics")
    print("  Total Scans:", data.get("total_scans"))
    assert "total_scans" in data
    assert "fake_detected_count" in data
    assert "uptime_seconds" in data
    print("  -> /api/system-metrics PASSED")


def test_analyze_url():
    print("Testing /api/analyze-url ...")
    # Test suspicious URL with keywords
    data = _request_post_json("/api/analyze-url", {"url": "https://secure-bank-login.xyz/account"})
    print(f"  URL: {data['url']} | Threat Score: {data['threat_score']} | Risk: {data['risk_level']}")
    assert "threat_score" in data
    assert "flags" in data
    assert data["risk_level"] in ("Dangerous", "Suspicious")

    # Test typosquatting detection
    typo_data = _request_post_json("/api/analyze-url", {"url": "https://paypa1.com/login"})
    print(f"  Typosquat test: {typo_data['typosquatting']}")
    assert typo_data["typosquatting"]["detected"] is True
    assert typo_data["typosquatting"]["target"] == "Paypal"
    print("  -> /api/analyze-url PASSED")


def test_analyze_text():
    print("Testing /api/analyze-text ...")
    sample_text = (
        "According to a study published in the Journal of Technology, "
        "new advancements in artificial intelligence are transforming data analytics across the industry."
    )
    data = _request_post_json("/api/analyze-text", {"text": sample_text})
    print(f"  Credibility Score: {data['credibility_score']} | Risk: {data['risk_level']}")
    assert "credibility_score" in data
    assert "readability" in data
    assert "emotional_language" in data
    assert data["risk_level"] == "Credible"
    print("  -> /api/analyze-text PASSED")


def test_analyze_audio():
    print("Testing /api/analyze-audio ...")
    # Generate 1-second 16kHz sine wave audio
    sr = 16000
    t = np.linspace(0, 1.0, sr, endpoint=False)
    sig = (np.sin(2 * np.pi * 440 * t) * 16384).astype(np.int16)

    buf = io.BytesIO()
    with wave.open(buf, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(sig.tobytes())

    audio_bytes = buf.getvalue()
    data = _request_post_file(
        "/api/analyze-audio",
        field_name="audio",
        file_name="test_tone.wav",
        file_bytes=audio_bytes,
        content_type="audio/wav",
    )
    print(f"  Audio Authenticity: {data['authenticity_score']}% | Scam Prob: {data['scam_probability']}%")
    assert "authenticity_score" in data
    assert "scam_probability" in data
    assert "explanation" in data
    assert "model_metadata" in data
    print("  -> /api/analyze-audio PASSED")


def test_analyze_video():
    print("Testing /api/analyze-video ...")
    # Generate a brief 10-frame test MP4 video using cv2 if available or synthetic dummy bytes
    try:
        import cv2
        temp_dir = tempfile.gettempdir()
        temp_video_path = os.path.join(temp_dir, "test_truthshield.mp4")
        fourcc = cv2.VideoWriter_fourcc(*"mp4v")
        out = cv2.VideoWriter(temp_video_path, fourcc, 10, (224, 224))
        for i in range(15):
            frame = np.full((224, 224, 3), (i * 15, 120, 200), dtype=np.uint8)
            cv2.circle(frame, (112, 112), 40 + i, (255, 255, 255), -1)
            out.write(frame)
        out.release()

        with open(temp_video_path, "rb") as vf:
            video_bytes = vf.read()
        try:
            os.remove(temp_video_path)
        except OSError:
            pass
    except Exception:
        video_bytes = b"FAKE_SYNTHETIC_VIDEO_DATA_FOR_TESTING"

    data = _request_post_file(
        "/api/analyze-video",
        field_name="video",
        file_name="test_clip.mp4",
        file_bytes=video_bytes,
        content_type="video/mp4",
    )
    print(f"  Video Authenticity: {data['authenticity_score']}% | Risk: {data['risk_level']} | Heatmap: {data['heatmap_available']}")
    assert "authenticity_score" in data
    assert "risk_level" in data
    assert "threat_index" in data
    assert "temporal_stability_score" in data
    print("  -> /api/analyze-video PASSED")


if __name__ == "__main__":
    mode_str = f"Live Server ({BASE_URL})" if USE_LIVE_SERVER else "In-Process Flask Engine (Standalone)"
    print(f"=== Running TruthShield Backend Test Suite [{mode_str}] ===")
    test_health()
    test_system_metrics()
    test_analyze_url()
    test_analyze_text()
    test_analyze_audio()
    test_analyze_video()
    print("\n[SUCCESS] ALL 6 BACKEND TEST SUITES PASSED SUCCESSFULLY!")
