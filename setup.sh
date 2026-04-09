#!/bin/bash

# Culture Continuity - Quick Start Script

echo "🌏 Culture Continuity - Installation & Setup"
echo "=============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node -v) found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ ! -f ".env.local" ]; then
    echo ""
    echo "⚠️  .env.local file not found!"
    echo "📋 Creating .env.local from template..."
    cp .env.example .env.local
    echo "✅ .env.local created!"
    echo ""
    echo "📝 Please edit .env.local and add your API keys:"
    echo "   - NEXT_PUBLIC_GOOGLE_PLACES_API_KEY"
    echo "   - EVENTBRITE_API_KEY"
    echo "   - MEETUP_API_KEY"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the development server, run:"
echo "   npm run dev"
echo ""
echo "📖 For more information, check README.md"
