@echo off
echo ========================================
echo TelMedSphere Dependency Installation
echo ========================================
echo.

echo [1/4] Installing Frontend Dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo Frontend installation failed!
    cd ..
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
cd ..

echo.
echo [2/4] Setting up Backend Python Environment...
cd backend
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)
echo Activating virtual environment and installing dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt
if errorlevel 1 (
    echo Backend installation failed!
    deactivate
    cd ..
    pause
    exit /b 1
)
call deactivate
echo Backend dependencies installed successfully!
cd ..

echo.
echo [3/4] Setting up ML Models Python Environment...
cd models
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)
echo Activating virtual environment and installing dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt
if errorlevel 1 (
    echo ML Models installation failed!
    deactivate
    cd ..
    pause
    exit /b 1
)
call deactivate
echo ML Models dependencies installed successfully!
cd ..

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Create .env files for frontend, backend, and models
echo 2. Start backend: cd backend ^&^& venv\Scripts\activate ^&^& flask run
echo 3. Start ML models: cd models ^&^& venv\Scripts\activate ^&^& flask run --port 5001
echo 4. Start frontend: cd frontend ^&^& npm run dev
echo.
pause

