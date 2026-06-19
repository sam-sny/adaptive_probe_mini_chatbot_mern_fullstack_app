@echo off
REM Adaptive Probe - Quick Start Script for Windows

echo.
echo ===================================
echo   Adaptive Probe - MERN Stack
echo   Quick Start for Windows
echo ===================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js found
echo.

REM Check if .env exists in server
if not exist "server\.env" (
    echo ERROR: server\.env not found
    echo Please create server\.env with your MongoDB and OpenAI keys
    echo Copy from server\.env.example
    pause
    exit /b 1
)

echo ✓ server\.env found

REM Check if .env.local exists in client
if not exist "client\.env.local" (
    echo ERROR: client\.env.local not found
    echo Creating client\.env.local...
    echo NEXT_PUBLIC_API_URL=http://localhost:5000 > client\.env.local
    echo ✓ client\.env.local created
)

echo.
echo Starting services...
echo.

REM Start backend in new window
echo Starting Backend Server (port 5000)...
start cmd /k "cd server && npm run dev"

REM Wait a bit for backend to start
timeout /t 3 /nobreak

REM Start frontend in new window
echo Starting Frontend Server (port 3000)...
start cmd /k "cd client && npm run dev"

echo.
echo ===================================
echo   Services Starting...
echo ===================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Check both terminal windows for startup messages.
echo.
echo If you see errors:
echo 1. Check your .env files in server/ and client/
echo 2. Verify MongoDB URI and OpenAI API key
echo 3. Ensure ports 5000 and 3000 are not in use
echo.
pause
