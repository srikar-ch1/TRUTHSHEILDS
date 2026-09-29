# TRUTHSHIELD Deployment Script for Windows
# Run this script to deploy the application

Write-Host "=== TRUTHSHIELD Deployment Script ===" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is available
$dockerAvailable = $false
try {
    $null = docker --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        $dockerAvailable = $true
        Write-Host "Docker found" -ForegroundColor Green
    }
} catch {
    Write-Host "Docker not found" -ForegroundColor Yellow
}

# Check if Docker Compose is available
$composeAvailable = $false
try {
    $null = docker-compose --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        $composeAvailable = $true
        Write-Host "Docker Compose found" -ForegroundColor Green
    }
} catch {
    try {
        $null = docker compose version 2>&1
        if ($LASTEXITCODE -eq 0) {
            $composeAvailable = $true
            $useDockerPlugin = $true
            Write-Host "Docker Compose plugin found" -ForegroundColor Green
        }
    } catch {
        Write-Host "Docker Compose not found" -ForegroundColor Yellow
    }
}

Write-Host ""

# Deployment options
Write-Host "Deployment Options:" -ForegroundColor Cyan
Write-Host "1. Docker Compose - Full stack"
Write-Host "2. Manual Backend Only"
Write-Host "3. Manual Frontend Only"
Write-Host ""

$choice = Read-Host "Select deployment method (1-3)"

if ($choice -eq "1") {
    if (-not $dockerAvailable -or -not $composeAvailable) {
        Write-Host "Error: Docker and Docker Compose are required" -ForegroundColor Red
        exit 1
    }

    Write-Host ""
    Write-Host "Building and starting services..." -ForegroundColor Cyan
    if ($useDockerPlugin) {
        docker compose up -d --build
    } else {
        docker-compose up -d --build
    }

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "Deployment successful!" -ForegroundColor Green
        Write-Host "Frontend: http://localhost"
        Write-Host "Backend API: http://localhost:5000"
    } else {
        Write-Host "Deployment failed" -ForegroundColor Red
        exit 1
    }
}
elseif ($choice -eq "2") {
    Write-Host ""
    Write-Host "Setting up Backend..." -ForegroundColor Cyan

    if (-not (Test-Path "backend\venv")) {
        python -m venv backend\venv
    }

    & "backend\venv\Scripts\Activate.ps1"
    pip install -r backend\requirements.txt

    Write-Host ""
    Write-Host "Backend setup complete. To start: cd backend; .\venv\Scripts\Activate.ps1; python app.py" -ForegroundColor Green
}
elseif ($choice -eq "3") {
    Write-Host ""
    Write-Host "Building Frontend..." -ForegroundColor Cyan

    Set-Location frontend
    npm install
    npm run build

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "Frontend build complete. Output: frontend\dist" -ForegroundColor Green
    } else {
        Write-Host "Build failed" -ForegroundColor Red
        exit 1
    }

    Set-Location ..
}
else {
    Write-Host "Invalid choice" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Done" -ForegroundColor Cyan
