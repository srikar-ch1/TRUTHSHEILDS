@echo off
echo ===================================================
echo     TRUTHSHIELD - VERCEL FULL-STACK DEPLOYMENT
echo ===================================================
echo.
echo Checking Vercel CLI...
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Vercel CLI not found. Installing globally via npm...
    call npm install -g vercel
)

echo.
echo Building frontend bundle...
call npm run build
if %errorlevel% neq 0 (
    echo [!] Build failed. Please fix errors before deploying.
    pause
    exit /b %errorlevel%
)

echo.
echo [OK] Build passed successfully.
echo Starting Vercel deployment...
echo.
echo (If prompted, log in with your GitHub/email and select defaults)
echo.
vercel --prod

echo.
echo ===================================================
echo Deployment command finished!
echo ===================================================
pause
