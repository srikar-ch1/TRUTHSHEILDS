@echo off
cd /d "%~dp0"
echo Starting TRUTHSHIELD backend...
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
) else (
    echo No venv found. Run: python -m venv venv   then   venv\Scripts\pip install -r requirements.txt
)
python app.py
pause
