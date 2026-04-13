@echo off
setlocal
title Revit Version Checker — Build Installer

echo.
echo  ============================================================
echo   Revit Version Checker  ^|  Sprinkler Design NZ
echo   Build Installer
echo  ============================================================
echo.

cd /d "%~dp0"

:: ── 1. Check Python ──────────────────────────────────────────────────────────
echo  [1/4] Checking Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Python not found. Install from https://python.org
    pause & exit /b 1
)
for /f "tokens=*" %%V in ('python --version 2^>^&1') do echo         %%V

:: ── 2. Install dependencies ──────────────────────────────────────────────────
echo  [2/4] Installing dependencies...
python -m pip install pyinstaller pillow tkinterdnd2 --quiet --upgrade
if errorlevel 1 ( echo  [ERROR] pip failed. & pause & exit /b 1 )
echo         OK

:: ── 3. Prepare assets ────────────────────────────────────────────────────────
echo  [3/4] Preparing assets...

if exist "%~dp0..\public\logo.png" (
    copy /y "%~dp0..\public\logo.png" "%~dp0logo.png" >nul
    echo         logo.png copied.
)
if exist "%~dp0logo.png" (
    python make_icon.py
)

:: First build RevitChecker.exe (the main app)
echo         Building RevitChecker.exe...
if exist "icon.ico" (
    python -m PyInstaller --onefile --windowed --name RevitChecker ^
        --icon icon.ico --collect-all tkinterdnd2 --add-data "logo.png;." ^
        --clean --noconfirm main.py >nul 2>&1
) else (
    python -m PyInstaller --onefile --windowed --name RevitChecker ^
        --collect-all tkinterdnd2 --clean --noconfirm main.py >nul 2>&1
)
if not exist "dist\RevitChecker.exe" (
    echo  [ERROR] RevitChecker.exe build failed.
    pause & exit /b 1
)
echo         RevitChecker.exe — OK

:: ── 4. Build the installer exe ───────────────────────────────────────────────
echo  [4/4] Building installer...

:: Bundle RevitChecker.exe inside the installer
if exist "icon.ico" (
    python -m PyInstaller --onefile --windowed --name "RevitChecker_Setup" ^
        --icon icon.ico ^
        --add-data "dist\RevitChecker.exe;." ^
        --add-data "logo.png;." ^
        --clean --noconfirm installer.py >nul 2>&1
) else (
    python -m PyInstaller --onefile --windowed --name "RevitChecker_Setup" ^
        --add-data "dist\RevitChecker.exe;." ^
        --clean --noconfirm installer.py >nul 2>&1
)

if not exist "dist\RevitChecker_Setup.exe" (
    echo  [ERROR] Installer build failed.
    pause & exit /b 1
)

:: Move to installer_output
if not exist "installer_output" mkdir "installer_output"
move /y "dist\RevitChecker_Setup.exe" "installer_output\RevitChecker_Setup.exe" >nul

echo.
echo  ============================================================
echo   DONE
echo.
echo   Installer:  %~dp0installer_output\RevitChecker_Setup.exe
echo  ============================================================
echo.
echo  Distribute  RevitChecker_Setup.exe  to your team.
echo  Double-click to install — no admin rights required.
echo.
pause
