# TRUTHSHIELD – AI Digital Trust Engine

**Restoring Digital Trust in the AI Era**

Production-ready full-stack AI cybersecurity web platform for deepfake video and voice scam detection.

---

## Project structure

```
truthshield/
├── frontend/     # React (Vite) + TailwindCSS
├── backend/      # Python Flask API
├── model/        # Placeholder for future ML models
└── README.md
```

## Quick start

### Backend

```bash
cd truthshield/backend
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
python app.py
```

API runs at **http://localhost:5000**.

Optional: copy `backend/.env.example` to `backend/.env` and set `FRONTEND_URL`, `PORT`, `MAX_CONTENT_LENGTH`, or `FLASK_DEBUG` as needed.

### Frontend

```bash
cd truthshield/frontend
npm install
npm run dev
```

App runs at **http://localhost:5173**. API requests are proxied to the backend.

## Features

- **Landing** – Hero, feature cards, stats, CTAs
- **Deepfake Video Detection** – Upload video, analyze, authenticity score, risk badge, AI explanation, heatmap placeholder
- **Voice Scam Detection** – Upload audio, analyze, authenticity & scam probability meters, spectrogram placeholder
- **Analytics Dashboard** – Summary cards, Real vs Fake bar chart, Scam categories pie chart, detection trends line chart
- **404 page** – Friendly “page not found” with link back home

## API (simulated)

- `POST /api/analyze-video` – Returns `{ authenticity_score, risk_level, explanation }`
- `POST /api/analyze-audio` – Returns `{ authenticity_score, scam_probability, explanation }`

Scores are simulated with a **short delay** (~0.5–1.2s). Backend uses a thread pool so multiple analyses can run in parallel without blocking. Replace with real model inference in `backend/` and `model/`.

## Performance & versatility

- **Faster:** Lazy-loaded routes (code splitting), shorter simulated delay, 60s API timeout, abort on navigate away.
- **Versatile:** More video/audio formats (MP4, WebM, MOV, MP3, WAV, OGG, M4A, AAC, FLAC, etc.), configurable API base and timeout via env.

## Optional backend env (.env)

| Variable | Default | Description |
|----------|--------|-------------|
| `FRONTEND_URL` | `http://localhost:5173` | Where GET `/` redirects |
| `PORT` | `5000` | Server port |
| `MAX_CONTENT_LENGTH` | `104857600` (100 MB) | Max upload size in bytes |
| `FLASK_DEBUG` | `true` | Set to `false` in production |

## Optional frontend env (.env)

| Variable | Default | Description |
|----------|--------|-------------|
| `VITE_API_BASE` | `/api` | API base URL (e.g. for production backend) |
| `VITE_API_TIMEOUT` | `60000` | Request timeout in ms |

## Deployment

### Quick Deploy with Docker Compose

```bash
# Windows
.\deploy.ps1

# Linux/macOS
chmod +x deploy.sh
./deploy.sh

# Or manually
docker-compose up -d --build
```

Services will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions and production setup.

## Tech stack

- **Frontend:** React 18, Vite, TypeScript, TailwindCSS, Framer Motion, Recharts, Lucide React
- **Backend:** Flask, Flask-CORS

## License

MIT.
