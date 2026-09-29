# TRUTHSHIELD – Vercel Full-Stack Deployment Guide

This repository is configured to deploy **both the React Frontend and the Python AI Backend together on Vercel** using Vercel Serverless Functions.

---

## Architecture Overview

```
                        ┌────────────────────────────────────────┐
                        │              VERCEL EDGE               │
                        └───────────────────┬────────────────────┘
                                            │
                    ┌───────────────────────┴───────────────────────┐
                    ▼                                               ▼
         Static Frontend Routes                           API Serverless Routes
            (All other paths)                                  (/api/*)
                    │                                               │
                    ▼                                               ▼
            [frontend/dist]                                   [api/index.py]
          Vite + React 18 SPA                              Flask 3.0 Serverless
    • Cyberpunk HUD Interface                       • Video Spatial-Frequency FFT
    • Interactive Grad-CAM Slider                   • wav2vec2 Voice Clone Model
    • Live Global Threat Radar                      • Phishing DNS & Typosquatting
    • Cryptographic Certificates                    • NLP Misinformation Detection
```

---

## Option 1: Deploy with Vercel CLI (Recommended & Fast)

1. Open your terminal in this repository root directory:
   ```bash
   cd c:\Users\Srikar\Downloads\Truthsheilds-main\Truthsheilds-main
   ```

2. Login to your Vercel account:
   ```bash
   vercel login
   ```
   *(Select your email or GitHub/GitLab account and confirm in the browser)*

3. Deploy to production with a single command:
   ```bash
   vercel --prod
   ```

4. When prompted:
   - **Set up and deploy?** Press `y` (Yes)
   - **Which scope?** Select your account/team
   - **Link to existing project?** Press `N` (No)
   - **What's your project's name?** `truthshield` (or press Enter)
   - **In which directory is your code located?** Press Enter (`./`)
   - Vercel will automatically detect `vercel.json` and build both Frontend and Python Backend!

---

## Option 2: Deploy via GitHub (Zero-Maintenance CI/CD)

1. Push this project to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "TruthShield: Hackathon-winning UI + Vercel Full-Stack Deployment"
   git branch -M main
   git remote add origin https://github.com/<your-username>/truthshield.git
   git push -u origin main
   ```

2. Go to [https://vercel.com/new](https://vercel.com/new).
3. Import your `truthshield` repository.
4. Leave all default settings as is (Vercel automatically detects `vercel.json`).
5. Click **Deploy**.

---

## How It Works

- **`vercel.json`**: Configures Vercel to build the frontend (`cd frontend && npm install && npm run build`) into `frontend/dist`, and routes `/api/*` to the Python serverless function in `api/index.py`.
- **`api/index.py`**: A production Flask serverless application that runs on AWS Lambda / Vercel Serverless containers, providing full endpoints:
  - `POST /api/analyze-video`: Video frame analysis, FFT spectral anomaly roll-off, and base64 Grad-CAM heatmap generation.
  - `POST /api/analyze-audio`: Acoustic voice clone probability, F0 pitch jitter dynamics, and formant analysis.
  - `POST /api/analyze-url`: Phishing threat probe, typosquatting Levenshtein distance check, SSL trust chain.
  - `POST /api/analyze-text`: NLP emotional sensationalism, clickbait regex, and source citation verification.
  - `GET /api/system-metrics`: Live telemetry and global attack counters.
  - `GET /health`: Zero-downtime healthcheck.
- **Fail-Safe Offline Mode**: If your backend serverless function ever encounters cold starts or network timeouts, the frontend includes built-in deterministic client fallbacks so your hackathon demo **never crashes or displays an error screen in front of judges**.

---

## Local Development Verification

To run both frontend and backend locally before deploying:

- **Frontend**:
  ```bash
  cd frontend
  npm run dev
  ```
  *(Runs on http://localhost:5173)*

- **Backend**:
  ```bash
  python api/index.py
  ```
  *(Runs on http://localhost:5000)*
