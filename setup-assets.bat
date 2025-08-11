@echo off
echo 🐢 TurtleQuest Asset Setup Helper
echo ================================
echo.
echo This script will help you set up your game assets.
echo.
echo Step 1: Open the asset generator in your browser
echo   - Go to: http://localhost:8000/create-game-assets.html
echo   - Click "Auto-Download All Assets"
echo   - Save all PNG files to your Downloads folder
echo.
echo Step 2: Move the assets to your game folder
echo   - Copy the downloaded PNG files to: assets/
echo   - Replace any existing SVG files with the new PNG files
echo.
echo Step 3: Refresh your game
echo   - Go to: http://localhost:8000/test.html
echo   - Check the browser console for any errors
echo.
echo Required PNG files:
echo   - turtle-sheet.png (128x128 spritesheet)
echo   - trash-items.png (64x64 spritesheet)
echo   - hazards.png (64x64 spritesheet)
echo   - powerups.png (64x64 spritesheet)
echo   - background.png (256x128 background)
echo.
echo Press any key to continue...
pause >nul

echo.
echo Checking current assets folder...
if exist "assets\" (
    echo ✅ Assets folder found
    dir assets\
) else (
    echo ❌ Assets folder not found
    echo Creating assets folder...
    mkdir assets
    echo ✅ Assets folder created
)

echo.
echo Asset setup complete! 
echo Now download the PNG assets and place them in the assets/ folder.
echo.
pause
