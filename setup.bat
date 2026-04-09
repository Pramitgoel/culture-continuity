@echo off
REM Culture Continuity - Quick Start Script for Windows

echo.
echo 🌏 Culture Continuity - Installation ^& Setup
echo =============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

echo ✅ Node.js found
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Check if .env.local exists
if not exist ".env.local" (
    echo.
    echo ⚠️  .env.local file not found!
    echo 📋 Creating .env.local from template...
    copy .env.example .env.local
    echo ✅ .env.local created!
    echo.
    echo 📝 Please edit .env.local and add your API keys:
    echo    - NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
    echo    - EVENTBRITE_API_KEY
    echo    - MEETUP_API_KEY
)

echo.
echo ✅ Setup complete!
echo.
echo 🚀 To start the development server, run:
echo    npm run dev
echo.
echo 📖 For more information, check README.md
echo.
pause
