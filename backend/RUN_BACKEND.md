# Run TRUTHSHIELD backend

**Connection refused** means the backend is not running. Start it first.

## Option 1: Double‑click (Windows)
- Double‑click **`run.bat`** in the `backend` folder.

## Option 2: Terminal (any OS)

1. Open a terminal in the project folder.
2. Go to backend and activate venv:
   ```powershell
   cd C:\Users\rvbal\truthshield\backend
   .\venv\Scripts\Activate.ps1
   ```
   If you see "cannot be loaded" for scripts, run once:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Install deps (first time only):
   ```powershell
   pip install -r requirements.txt
   ```
4. Start the server:
   ```powershell
   python app.py
   ```
5. When you see **"Running on http://127.0.0.1:5000"**, the backend is up.

## Check it’s working
- In the browser open: **http://localhost:5000/health**  
  You should see: `{"status":"ok","service":"truthshield-api"}`  
- Or open **http://localhost:5000** – it will redirect to the frontend.

## If port 5000 is in use
- Set another port: `$env:PORT=5001; python app.py`  
- Then in the frontend, the Vite proxy must target 5001, or call `http://localhost:5001/api/...`.
