# TelMedSphere - Start All Servers Script
# This script will start all three servers in separate PowerShell windows

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting TelMedSphere Servers" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = "D:\VeersaHackathon\TelMedSphere"

# Start Backend Server
Write-Host "Starting Backend Server (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectPath\backend'; .\venv\Scripts\Activate.ps1; `$env:FLASK_APP='app.py'; Write-Host 'Backend Server Starting...' -ForegroundColor Green; flask run"

Start-Sleep -Seconds 3

# Start ML Models Server
Write-Host "Starting ML Models Server (Port 5001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectPath\models'; .\venv\Scripts\Activate.ps1; `$env:FLASK_APP='app.py'; Write-Host 'ML Models Server Starting...' -ForegroundColor Green; flask run --port 5001"

Start-Sleep -Seconds 3

# Start Frontend Server
Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectPath\frontend'; Write-Host 'Frontend Server Starting...' -ForegroundColor Green; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "All servers are starting!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Servers will open in separate windows:" -ForegroundColor White
Write-Host "  - Backend:    http://127.0.0.1:5000" -ForegroundColor Cyan
Write-Host "  - ML Models:  http://127.0.0.1:5001" -ForegroundColor Cyan
Write-Host "  - Frontend:   http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit this window (servers will keep running)..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

