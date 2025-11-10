# TelMedSphere - Step by Step Setup Guide

## Overview
This guide will help you set up and run TelMedSphere step by step. Follow each command in order and report the output.

## Current Status
- ✅ Frontend: node_modules exists (may need verification)
- 🔄 Backend: Virtual environment created, dependencies installation in progress
- ⏳ Models: Not yet set up

---

## Step 1: Check Current Directory and Python Installation

**Command to run:**
```powershell
cd D:\VeersaHackathon\TelMedSphere
python --version
```

**Expected output:** Python version (e.g., Python 3.13.1)

**What to report:** The Python version shown, or any error message

---

## Step 2: Check Node.js Installation

**Command to run:**
```powershell
node --version
npm --version
```

**Expected output:** Node.js and npm versions

**What to report:** Both version numbers, or any error message

---

## Step 3: Check Frontend Dependencies

**Command to run:**
```powershell
cd frontend
Test-Path node_modules
```

**Expected output:** True or False

**What to report:** Whether node_modules exists (True/False)

---

## Step 4: Check Backend Virtual Environment

**Command to run:**
```powershell
cd ..
cd backend
Test-Path venv
```

**Expected output:** True or False

**What to report:** Whether venv folder exists

---

## Step 5: Verify Backend Dependencies Installation

**Command to run:**
```powershell
.\venv\Scripts\Activate.ps1
pip list
```

**Expected output:** List of installed packages

**What to report:** 
- Whether activation worked
- List of packages (especially check for: flask, flask-cors, pymongo, etc.)
- Any error messages

---

## Step 6: Install Missing Backend Dependencies (if needed)

**Command to run:**
```powershell
pip install -r requirements.txt
```

**Expected output:** Installation progress and "Successfully installed..." messages

**What to report:** 
- Whether installation completed successfully
- Any error messages
- List of any packages that failed to install

---

## Step 7: Check Models Directory

**Command to run:**
```powershell
deactivate
cd ..
cd models
dir
```

**Expected output:** List of files in models directory

**What to report:** 
- Whether all model files are present (ExtraTrees, GradientBoost, etc.)
- Whether CSV files are present
- Any missing files

---

## Step 8: Set Up Models Virtual Environment

**Command to run:**
```powershell
python -m venv venv
```

**Expected output:** (No output if successful)

**What to report:** Any error messages

---

## Step 9: Install Models Dependencies

**Command to run:**
```powershell
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**Expected output:** Installation progress

**What to report:** 
- Whether installation completed successfully
- Any error messages

---

## Step 10: Verify Frontend Dependencies

**Command to run:**
```powershell
deactivate
cd ..
cd frontend
npm list --depth=0
```

**Expected output:** List of installed packages

**What to report:** 
- Whether packages are installed
- Any missing packages
- Any error messages

---

## Step 11: Install/Update Frontend Dependencies (if needed)

**Command to run:**
```powershell
npm install
```

**Expected output:** Installation progress

**What to report:** 
- Whether installation completed successfully
- Any error messages

---

## Step 12: Check for Environment Files

**Command to run:**
```powershell
cd ..
Test-Path backend\.env
Test-Path frontend\.env
```

**Expected output:** True or False for each

**What to report:** Whether .env files exist in backend and frontend

---

## Next Steps (After Installation)

Once all dependencies are installed, we'll:
1. Create .env files with proper configuration
2. Start the backend server
3. Start the ML models server
4. Start the frontend development server

---

## Important Notes

- Run each command in order
- Report the complete output, especially any error messages
- If a command fails, stop and report the error before proceeding
- Make sure you're in the correct directory before running each command
- For PowerShell, you may need to allow script execution: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

---

## Quick Reference: Directory Structure

```
TelMedSphere/
├── frontend/          (React app)
├── backend/           (Flask API)
└── models/            (ML models Flask server)
```

---

## Troubleshooting Common Issues

1. **PowerShell execution policy error:**
   - Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

2. **Port already in use:**
   - Backend uses port 5000
   - Models uses port 5001
   - Frontend uses port 3000 (or next available)

3. **Virtual environment activation fails:**
   - Make sure you're in the correct directory
   - Try: `.\venv\Scripts\python.exe` directly

4. **pip install fails:**
   - Upgrade pip: `python -m pip install --upgrade pip`
   - Try: `pip install -r requirements.txt --no-cache-dir`

