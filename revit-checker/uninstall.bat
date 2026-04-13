@echo off
setlocal EnableDelayedExpansion
title Uninstall — Revit Version Checker Context Menu

echo.
echo  Removing Revit Version Checker context menu...
echo.

call :remove rvt
call :remove rfa
call :remove rte
call :remove rft
goto :done

:remove
set "EXT=%1"
set "PROGID="

for /f "skip=2 tokens=3*" %%A in ('reg query "HKCR\.%EXT%" /ve 2^>nul') do (
    set "PROGID=%%A %%B"
    set "PROGID=!PROGID: =!"
)

if defined PROGID (
    reg delete "HKCU\Software\Classes\!PROGID!\shell\CheckRevitVersion" /f >nul 2>&1
    echo   Removed from ProgID: !PROGID!
)
reg delete "HKCU\Software\Classes\.%EXT%\shell\CheckRevitVersion" /f >nul 2>&1
echo   Removed .%EXT%
goto :eof

:done
echo.
echo  Context menu removed.
echo.
pause
