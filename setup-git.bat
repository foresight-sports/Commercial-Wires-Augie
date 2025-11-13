@echo off
echo Setting up Git repository and creating feature branch...
echo.

cd /d "%~dp0"

REM Initialize git if not already initialized
if not exist .git (
    echo Initializing Git repository...
    git init
    echo.
)

REM Add the remote (will update if it already exists)
echo Adding remote origin...
git remote remove origin 2>nul
git remote add origin https://github.com/foresight-sports/commercial-wires-augie.git
echo.

REM Check current branch status
echo Current branch status:
git branch
echo.

REM Create a new feature branch for development
echo Creating new feature branch: feature/development
git checkout -b feature/development 2>nul || git checkout feature/development
echo.

REM Add all files
echo Adding all files...
git add .
echo.

REM Create initial commit if needed
echo Checking if initial commit is needed...
git commit -m "Initial commit: Commercial wires application setup" 2>nul
echo.

echo Setup complete!
echo.
echo Current branch: feature/development
echo Remote: origin -> https://github.com/foresight-sports/commercial-wires-augie.git
echo.
echo To push this branch:
echo   git push -u origin feature/development
echo.
echo To switch to main and push:
echo   git checkout -b main
echo   git push -u origin main
echo.
pause


