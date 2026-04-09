#!/bin/bash

# 🌏 Culture Continuity - Project Verification Script
# This script verifies that all files have been created correctly

echo ""
echo "🌏 Culture Continuity - Project Verification"
echo "============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter
PASSED=0
FAILED=0

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1"
        ((FAILED++))
    fi
}

# Function to check if directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1/"
        ((FAILED++))
    fi
}

echo "📁 Checking Directory Structure..."
check_dir "app"
check_dir "app/api/resources"
check_dir "components"
check_dir "lib"
check_dir "lib/types"
check_dir "lib/api"
check_dir "public"
check_dir "styles"

echo ""
echo "📄 Checking Configuration Files..."
check_file "package.json"
check_file "tsconfig.json"
check_file "tailwind.config.ts"
check_file "next.config.ts"
check_file "next.config.js"
check_file "postcss.config.js"
check_file ".eslintrc.json"
check_file ".env.example"
check_file ".env.local"
check_file ".gitignore"

echo ""
echo "📚 Checking Documentation..."
check_file "README.md"
check_file "SETUP.md"
check_file "QUICKSTART.md"
check_file "PROJECT_SUMMARY.md"
check_file "FILE_INVENTORY.md"

echo ""
echo "🚀 Checking Setup Scripts..."
check_file "setup.sh"
check_file "setup.bat"

echo ""
echo "🎨 Checking React Components..."
check_file "components/InputForm.tsx"
check_file "components/ResultsDisplay.tsx"
check_file "components/ResourceCard.tsx"

echo ""
echo "🖥️  Checking Pages & Routes..."
check_file "app/page.tsx"
check_file "app/layout.tsx"
check_file "app/globals.css"
check_file "app/api/resources/route.ts"

echo ""
echo "💼 Checking Business Logic..."
check_file "lib/types/index.ts"
check_file "lib/api/googlePlaces.ts"
check_file "lib/api/eventbrite.ts"
check_file "lib/api/meetup.ts"
check_file "lib/api/university.ts"
check_file "lib/api/resourceAggregator.ts"
check_file "lib/api/resourceAggregatorEnhanced.ts"
check_file "lib/mockData.ts"
check_file "lib/config.ts"

echo ""
echo "🎨 Checking Styles..."
check_file "styles/globals.css"

echo ""
echo "=========================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo "=========================================="
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All files present!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. npm install"
    echo "2. npm run dev"
    echo "3. Visit http://localhost:3000"
    exit 0
else
    echo -e "${RED}❌ Some files are missing!${NC}"
    exit 1
fi
