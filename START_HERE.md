# TRUTHSHIELD – How to run (Windows)

Follow these steps **in order**. Use **two separate PowerShell windows**.

---

## Step 1: Backend (first window)

1. Open **PowerShell**.
2. Run exactly:
   ```powershell
   cd C:\Users\rvbal\truthshield\backend
   .\venv\Scripts\Activate.ps1
   python app.py
   ```
3. Wait until you see: **`Running on http://127.0.0.1:5000`**
4. **Leave this window open.** Do not close it.

**Important:** Do **not** run `npm run dev` in the backend folder. There is no npm dev script there.

---

## Step 2: Frontend (second window)

1. Open a **new** PowerShell window (leave the first one open).
2. Run exactly:
   ```powershell
   cd C:\Users\rvbal\truthshield\frontend
   npm run dev
   ```
3. Wait until you see: **`Local: http://localhost:5173/`**
4. **Leave this window open.**

If you get **"out of memory"** or **"fatal error: out of memory"**:

- Close other programs (browsers, etc.) to free RAM, then try again.
- Or use the low-memory dev script:
  ```powershell
  cd C:\Users\rvbal\truthshield\frontend
  npm run dev:lowmem
  ```
- Or build once and run the built site (no dev server):
  ```powershell
  cd C:\Users\rvbal\truthshield\frontend
  npm run build
  npm run preview
  ```
  Then open the URL shown (e.g. http://localhost:5173).

---

## Step 3: Open the site

In your browser go to: **http://localhost:5173**

(Do **not** use http://localhost:5000 for the website – that is the API. The app is on 5173.)

---

## Quick reference

| You want to…        | Where to run        | Command              |
|---------------------|---------------------|----------------------|
| Start the API       | `truthshield\backend`  | `python app.py`      |
| Start the website   | `truthshield\frontend` | `npm run dev`        |
| Open the app        | Browser             | http://localhost:5173 |
| If frontend runs out of memory | `truthshield\frontend` | `npm run dev:lowmem` or `npm run build` then `npm run preview` |
