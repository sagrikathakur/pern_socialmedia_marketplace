@echo off
echo ===================================================
echo Windows PATH Environment Variable Fixer
echo ===================================================
echo.

:: Define standard paths
set "SYS32=C:\Windows\System32"
set "PS1=C:\Windows\System32\WindowsPowerShell\v1.0"
set "NODE64=C:\Program Files\nodejs"
set "NODE32=C:\Program Files (x86)\nodejs"

:: Retrieve the current User PATH from registry using absolute path to reg.exe
for /f "tokens=2*" %%A in ('C:\Windows\System32\reg.exe query HKCU\Environment /v PATH 2^>nul') do set "USERPATH=%%B"

echo Current User PATH:
echo %USERPATH%
echo.

:: Initialize new path with existing user path
set "NEWPATH=%USERPATH%"

:: Helper to append if not present using absolute path to findstr.exe
echo %NEWPATH% | C:\Windows\System32\findstr.exe /I /C:"%SYS32%" >nul || (
    echo Adding System32 to Path...
    set "NEWPATH=%NEWPATH%;%SYS32%"
)

echo %NEWPATH% | C:\Windows\System32\findstr.exe /I /C:"%PS1%" >nul || (
    echo Adding PowerShell to Path...
    set "NEWPATH=%NEWPATH%;%PS1%"
)

if exist "%NODE64%\node.exe" (
    echo Found 64-bit Node.js at "%NODE64%"
    echo %NEWPATH% | C:\Windows\System32\findstr.exe /I /C:"%NODE64%" >nul || (
        echo Adding Node.js to Path...
        set "NEWPATH=%NEWPATH%;%NODE64%"
    )
) else if exist "%NODE32%\node.exe" (
    echo Found 32-bit Node.js at "%NODE32%"
    echo %NEWPATH% | C:\Windows\System32\findstr.exe /I /C:"%NODE32%" >nul || (
        echo Adding Node.js to Path...
        set "NEWPATH=%NEWPATH%;%NODE32%"
    )
) else (
    echo [WARNING] Node.js was not found in standard installation paths.
    echo Please make sure you have downloaded and installed Node.js from https://nodejs.org/
)

:: Update User PATH in registry permanently using absolute path to reg.exe
echo.
echo Updating User PATH permanently in Registry...
C:\Windows\System32\reg.exe add HKCU\Environment /v PATH /t REG_EXPAND_SZ /d "%NEWPATH%" /f

if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] PATH updated successfully!
    echo.
    echo ===================================================
    echo IMPORTANT: Please CLOSE and RESTART all open terminals, 
    echo VS Code, and IDE/editor windows for changes to take effect.
    echo ===================================================
) else (
    echo [ERROR] Failed to update PATH in registry.
)

echo.
pause
