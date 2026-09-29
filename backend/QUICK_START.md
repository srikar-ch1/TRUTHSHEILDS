# TRUTHSHIELD Backend - Quick Start Guide

## 🚀 Production-Ready AI Inference System

### Prerequisites

- Python 3.8+
- Virtual environment (recommended)

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # Linux/Mac:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

   **Note:** If you encounter "No space left on device" errors, the backend will automatically fall back to simulated scores. Install dependencies later when disk space is available.

### Running the Backend

**Option 1: Direct Python**
```bash
python app.py
```

**Option 2: Using run.bat (Windows)**
```bash
run.bat
```

The backend will start on `http://127.0.0.1:5000`

### Environment Variables (Optional)

Create a `.env` file in the `backend/` directory:

```env
# Frontend URL (for redirects)
FRONTEND_URL=http://localhost:5173

# CORS origins (comma-separated)
CORS_ORIGINS=http://localhost:5173,http://localhost:5174

# Server port
PORT=5000

# Max file size (bytes, default: 100MB)
MAX_CONTENT_LENGTH=104857600

# Debug mode (true/false)
FLASK_DEBUG=true
```

### API Endpoints

**Health Check:**
```
GET /health
```

**Video Analysis:**
```
POST /api/analyze-video
Content-Type: multipart/form-data
Body: video file (max 100MB)
```

**Response:**
```json
{
  "authenticity_score": 85.3,
  "risk_level": "Real",
  "explanation": "Analysis of 20 frames shows...",
  "frames_analyzed": 20,
  "processing_time": 3.2
}
```

**Audio Analysis:**
```
POST /api/analyze-audio
Content-Type: multipart/form-data
Body: audio file (max 50MB)
```

**Response:**
```json
{
  "authenticity_score": 78.5,
  "scam_probability": 21.5,
  "explanation": "Voice profile appears...",
  "processing_time": 1.8
}
```

### Logs

Logs are written to `backend/logs/truthshield_YYYYMMDD.log`

### Performance

- **Video inference:** < 5 seconds (20 frames max)
- **Audio inference:** < 3 seconds (30-second audio max)
- **CPU-only:** No GPU required
- **Singleton models:** Loaded once, reused for all requests

### Troubleshooting

**"ModuleNotFoundError: No module named 'cv2'"**
- Install dependencies: `pip install -r requirements.txt`
- If disk space is limited, backend will use simulated scores automatically

**"Connection Refused"**
- Ensure backend is running: `python app.py`
- Check port 5000 is not in use

**Slow inference**
- Normal for first request (model loading)
- Subsequent requests are faster (model cached)
- Ensure CPU has sufficient resources

### Production Deployment

For production:
1. Set `FLASK_DEBUG=false` in `.env`
2. Use a production WSGI server (gunicorn, uwsgi)
3. Configure proper CORS origins
4. Set up log rotation
5. Monitor disk space for temp files
