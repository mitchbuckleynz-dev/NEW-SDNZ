@echo off
setlocal
title Build — Revit Version Checker

echo.
echo  ============================================
echo   Revit Version Checker — Build Script
echo   Sprinkler Design NZ
echo  ============================================
echo.

python --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Python not found. Install from https://python.org
    pause & exit /b 1
)

echo  [1/3] Installing dependencies...
python -m pip install pyinstaller pillow tkinterdnd2 --quiet
if errorlevel 1 (
    echo  [ERROR] pip install failed.
    pause & exit /b 1
)

echo  [2/3] Copying logo...
set "LOGO_SRC=%~dp0..\public\logo.png"
set "LOGO_DST=%~dp0logo.png"
if exist "%LOGO_SRC%" (
    copy /y "%LOGO_SRC%" "%LOGO_DST%" >nul
    echo         Logo copied.
) else (
    echo         [WARN] Logo not found — app will run without logo.
)

echo  [3/3] Building executable...
cd /d "%~dp0"

if exist "logo.png" (
    python -m PyInstaller ^
        --onefile ^
        --windowed ^
        --name "RevitChecker" ^
        --collect-all tkinterdnd2 ^
        --add-data "logo.png;." ^
        --clean ^
        main.py
) else (
    python -m PyInstaller ^
        --onefile ^
        --windowed ^
        --name "RevitChecker" ^
        --collect-all tkinterdnd2 ^
        --clean ^
        main.py
)

if errorlevel 1 (
    echo  [ERROR] Build failed.
    pause & exit /b 1
)

echo.
echo  ============================================
echo   BUILD COMPLETE
echo   Executable: %~dp0dist\RevitChecker.exe
echo  ============================================
echo.
echo  Run RevitChecker.exe, then click "Setup" in
echo  the app to install the right-click menu.
echo.
pause
