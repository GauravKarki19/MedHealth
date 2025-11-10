# Fix Frontend Dependencies Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fixing Frontend Dependencies" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

cd frontend

Write-Host "Step 1: Removing node_modules and package-lock.json..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force node_modules
    Write-Host "✓ Removed node_modules" -ForegroundColor Green
}
if (Test-Path "package-lock.json") {
    Remove-Item -Force package-lock.json
    Write-Host "✓ Removed package-lock.json" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 2: Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force
Write-Host "✓ Cache cleared" -ForegroundColor Green

Write-Host ""
Write-Host "Step 3: Installing dependencies..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now run: npm run dev" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "Installation failed. Trying with legacy peer deps..." -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    npm install --legacy-peer-deps
}

cd ..


