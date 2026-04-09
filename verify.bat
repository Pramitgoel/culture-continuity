@echo off
REM 🌏 Culture Continuity - Project Verification Script for Windows

echo.
echo 🌏 Culture Continuity - Project Verification
echo =============================================
echo.

setlocal enabledelayedexpansion
set PASSED=0
set FAILED=0

REM Check directories
echo Checking Directory Structure...
if exist "app" (
    echo [OK] app/
) else (
    echo [FAIL] app/
)
if exist "app\api\resources" (
    echo [OK] app\api\resources\
) else (
    echo [FAIL] app\api\resources\
)
if exist "components" (
    echo [OK] components\
) else (
    echo [FAIL] components\
)
if exist "lib" (
    echo [OK] lib\
) else (
    echo [FAIL] lib\
)
if exist "lib\types" (
    echo [OK] lib\types\
) else (
    echo [FAIL] lib\types\
)
if exist "lib\api" (
    echo [OK] lib\api\
) else (
    echo [FAIL] lib\api\
)
if exist "public" (
    echo [OK] public\
) else (
    echo [FAIL] public\
)
if exist "styles" (
    echo [OK] styles\
) else (
    echo [FAIL] styles\
)

echo.
echo Checking Critical Files...
set FILES=^
package.json ^
tsconfig.json ^
tailwind.config.ts ^
next.config.ts ^
next.config.js ^
postcss.config.js ^
.eslintrc.json ^
.env.example ^
.env.local ^
.gitignore ^
README.md ^
SETUP.md ^
QUICKSTART.md ^
PROJECT_SUMMARY.md ^
FILE_INVENTORY.md ^
setup.sh ^
setup.bat ^
app\page.tsx ^
app\layout.tsx ^
app\globals.css ^
app\api\resources\route.ts ^
components\InputForm.tsx ^
components\ResultsDisplay.tsx ^
components\ResourceCard.tsx ^
lib\types\index.ts ^
lib\api\googlePlaces.ts ^
lib\api\eventbrite.ts ^
lib\api\meetup.ts ^
lib\api\university.ts ^
lib\api\resourceAggregator.ts ^
lib\api\resourceAggregatorEnhanced.ts ^
lib\mockData.ts ^
lib\config.ts ^
lib\config.ts ^
styles\globals.css

for %%F in (%FILES%) do (
    if exist "%%F" (
        set /a PASSED+=1
        echo [OK] %%F
    ) else (
        set /a FAILED+=1
        echo [FAIL] %%F
    )
)

echo.
echo ==========================================
echo Passed: !PASSED!
echo Failed: !FAILED!
echo ==========================================
echo.

if !FAILED! equ 0 (
    echo Success! All files are present.
    echo.
    echo Next steps:
    echo 1. npm install
    echo 2. npm run dev
    echo 3. Visit http://localhost:3000
) else (
    echo Error: Some files are missing.
)

echo.
pause
