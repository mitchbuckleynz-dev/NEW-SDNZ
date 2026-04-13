@echo off
setlocal EnableDelayedExpansion
title Install — Revit Version Checker Context Menu

echo.
echo  ============================================
echo   Revit Version Checker — Install
echo   Sprinkler Design NZ
echo  ============================================
echo.

:: Resolve exe path
set "EXE=%~dp0dist\RevitChecker.exe"

if not exist "%EXE%" (
    echo  [ERROR] RevitChecker.exe not found at:
    echo          %EXE%
    echo.
    echo  Please run  build.bat  first to create the executable.
    echo.
    pause & exit /b 1
)

echo  Installing context menu for:
echo   %EXE%
echo.

:: ── For each extension, register under its ProgID (preferred) AND extension ──
:: Windows resolves context menus from the ProgID when Revit is installed.

call :register rvt
call :register rfa
call :register rte
call :register rft
goto :done

:register
set "EXT=%1"
set "PROGID="

:: Look up the ProgID registered for this extension (e.g. AutodeskRevit.Project)
for /f "skip=2 tokens=3*" %%A in ('reg query "HKCR\.%EXT%" /ve 2^>nul') do (
    set "PROGID=%%A %%B"
    set "PROGID=!PROGID: =!"
)
:: Also try HKCU override
for /f "skip=2 tokens=3*" %%A in ('reg query "HKCU\Software\Classes\.%EXT%" /ve 2^>nul') do (
    set "PROGID=%%A %%B"
    set "PROGID=!PROGID: =!"
)

if defined PROGID (
    echo   .%EXT% -^> ProgID: !PROGID!
    :: Register under the ProgID — this is what Windows actually reads
    reg add "HKCU\Software\Classes\!PROGID!\shell\CheckRevitVersion"         /ve /d "Check Revit Version" /f >nul
    reg add "HKCU\Software\Classes\!PROGID!\shell\CheckRevitVersion"         /v "Icon" /d "\"%EXE%\",0"   /f >nul
    reg add "HKCU\Software\Classes\!PROGID!\shell\CheckRevitVersion\command" /ve /d "\"%EXE%\" \"%%1\""   /f >nul
) else (
    echo   .%EXT% -^> no ProgID found, registering on extension directly
)

:: Also register on the extension as fallback (catches edge cases)
reg add "HKCU\Software\Classes\.%EXT%\shell\CheckRevitVersion"         /ve /d "Check Revit Version" /f >nul
reg add "HKCU\Software\Classes\.%EXT%\shell\CheckRevitVersion"         /v "Icon" /d "\"%EXE%\",0"   /f >nul
reg add "HKCU\Software\Classes\.%EXT%\shell\CheckRevitVersion\command" /ve /d "\"%EXE%\" \"%%1\""   /f >nul

goto :eof

:done
echo.
echo  ============================================
echo   DONE
echo  ============================================
echo.
echo  Right-click any .rvt / .rfa / .rte / .rft
echo  file in Windows Explorer and choose:
echo.
echo    "Check Revit Version"
echo.
echo  NOTE: If you don't see it yet, open a new
echo  Explorer window — the menu cache may need
echo  to refresh.
echo.
echo  To remove: run  uninstall.bat
echo.
pause
