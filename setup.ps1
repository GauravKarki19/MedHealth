# TelMedSphere Setup Script for Windows PowerShell
# This script will help you install all dependencies for the project

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TelMedSphere Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if Python is installed
Write-Host "Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version
    Write-Host "✓ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Python is not installed. Please install Python from https://www.python.org/" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 1: Installing Frontend Dependencies" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Frontend dependencies installation failed" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✓ Frontend dependencies installed successfully" -ForegroundColor Green
Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 2: Installing Backend Dependencies" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Set-Location backend

# Create virtual environment if it doesn't exist
if (-Not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Install dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Backend dependencies installation failed" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✓ Backend dependencies installed successfully" -ForegroundColor Green

# Deactivate virtual environment
deactivate
Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 3: Installing ML Models Dependencies" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Set-Location models

# Create virtual environment if it doesn't exist
if (-Not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Install dependencies
Write-Host "Installing ML models dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ ML models dependencies installation failed" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✓ ML models dependencies installed successfully" -ForegroundColor Green

# Deactivate virtual environment
deactivate
Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Set up .env files for frontend, backend, and models directories" -ForegroundColor White
Write-Host "2. Start the backend server: cd backend && venv\Scripts\activate && flask run" -ForegroundColor White
Write-Host "3. Start the ML models server: cd models && venv\Scripts\activate && flask run" -ForegroundColor White
Write-Host "4. Start the frontend: cd frontend && npm run dev" -ForegroundColor White
Write-Host ""

