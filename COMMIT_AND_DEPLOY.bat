@echo off
REM Script to help with committing and deploying MedHealth (Windows)
REM Usage: COMMIT_AND_DEPLOY.bat

echo 🚀 MedHealth Deployment Helper Script
echo ======================================
echo.

REM Check if git is initialized
if not exist ".git" (
    echo ⚠️  Git repository not initialized. Initializing...
    git init
    echo ✅ Git initialized
    echo.
)

REM Show status
echo 📊 Current git status:
git status --short
echo.

REM Ask user what to do
echo What would you like to do?
echo 1. Commit all changes with a message
echo 2. Push to GitHub
echo 3. Both (commit and push)
echo 4. Exit
set /p choice="Enter choice (1-4): "

if "%choice%"=="1" (
    set /p commit_msg="Enter commit message: "
    git add .
    git commit -m "%commit_msg%"
    echo ✅ Changes committed
) else if "%choice%"=="2" (
    set /p remote="Enter remote name (default: origin): "
    if "%remote%"=="" set remote=origin
    set /p branch="Enter branch name (default: main): "
    if "%branch%"=="" set branch=main
    git push %remote% %branch%
    echo ✅ Changes pushed to GitHub
) else if "%choice%"=="3" (
    set /p commit_msg="Enter commit message: "
    git add .
    git commit -m "%commit_msg%"
    set /p remote="Enter remote name (default: origin): "
    if "%remote%"=="" set remote=origin
    set /p branch="Enter branch name (default: main): "
    if "%branch%"=="" set branch=main
    git push %remote% %branch%
    echo ✅ Changes committed and pushed to GitHub
) else if "%choice%"=="4" (
    echo 👋 Exiting...
    exit /b 0
) else (
    echo ❌ Invalid choice
    exit /b 1
)

echo.
echo 🎉 Done!
pause

