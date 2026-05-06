@echo off
setlocal enabledelayedexpansion

title Primora Installer

echo.
echo  =========================================
echo   Primora - Controller Mapping Tool
echo   Installer by Primers Corporation
echo  =========================================
echo.

:: Define paths
set INSTALL_PATH=%LOCALAPPDATA%\Primora
set SHORTCUT_PATH=%USERPROFILE%\Desktop\Primora.lnk
set GITHUB_API=https://api.github.com/repos/Primers-Corperation/Primora/releases/latest

:: Fetch latest version tag from GitHub
echo [*] Fetching latest version from GitHub...
for /f "delims=" %%A in ('powershell -Command ^
  "try { (Invoke-WebRequest -Uri '%GITHUB_API%' -UseBasicParsing -Headers @{'User-Agent'='PrimoraInstaller'}).Content | ConvertFrom-Json | Select-Object -ExpandProperty tag_name } catch { Write-Output 'ERROR' }"') do (
  set LATEST_TAG=%%A
)

if "!LATEST_TAG!"=="ERROR" (
  echo [!] Could not reach GitHub. Check your internet connection and try again.
  goto :error
)

:: Strip leading 'v' if present
if "!LATEST_TAG:~0,1!"=="v" set VERSION=!LATEST_TAG:~1!
if not "!LATEST_TAG:~0,1!"=="v" set VERSION=!LATEST_TAG!

echo [*] Latest version: !VERSION!
echo.

:: Build download URL
set DOWNLOAD_URL=https://github.com/Primers-Corperation/Primora/releases/download/!LATEST_TAG!/Primora_!VERSION!_x64.zip
set ZIP_FILE=%TEMP%\Primora_!VERSION!_x64.zip
set EXTRACT_DIR=%TEMP%\Primora_Extract

:: Download release zip
echo [*] Downloading Primora v!VERSION!...
powershell -Command ^
  "Invoke-WebRequest -Uri '!DOWNLOAD_URL!' -OutFile '!ZIP_FILE!' -UseBasicParsing" 2>nul

if not exist "!ZIP_FILE!" (
  echo [!] Download failed. Please check your connection or download manually from:
  echo     https://primora-website.vercel.app/
  goto :error
)

echo [*] Download complete.

:: Clean up any previous install
if exist "%INSTALL_PATH%" (
  echo [*] Removing previous installation...
  rmdir /S /Q "%INSTALL_PATH%"
)

:: Extract
echo [*] Extracting files...
if exist "!EXTRACT_DIR!" rmdir /S /Q "!EXTRACT_DIR!"
powershell -Command "Expand-Archive -Path '!ZIP_FILE!' -DestinationPath '!EXTRACT_DIR!' -Force"

:: Handle both flat and nested zip structures
for /d %%D in ("!EXTRACT_DIR!\*") do set INNER_DIR=%%D
if exist "!INNER_DIR!\Primora.exe" (
  move /Y "!INNER_DIR!" "%INSTALL_PATH%" >nul
) else (
  move /Y "!EXTRACT_DIR!" "%INSTALL_PATH%" >nul
)

if not exist "%INSTALL_PATH%\Primora.exe" (
  echo [!] Extraction failed. Could not find Primora.exe in expected location.
  goto :error
)

:: Create Desktop Shortcut
echo [*] Creating desktop shortcut...
powershell -Command ^
  "$s = New-Object -COMObject WScript.Shell; $sc = $s.CreateShortcut('%SHORTCUT_PATH%'); $sc.TargetPath = '%INSTALL_PATH%\Primora.exe'; $sc.WorkingDirectory = '%INSTALL_PATH%'; $sc.Description = 'Primora - Controller Mapping Tool'; $sc.IconLocation = '%INSTALL_PATH%\Primora.exe,0'; $sc.Save()"

:: Register in Add/Remove Programs
echo [*] Registering in Windows...
set REG_PATH=HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\Primora
reg add "%REG_PATH%" /v "DisplayName"     /t REG_SZ /d "Primora" /f >nul
reg add "%REG_PATH%" /v "DisplayVersion"  /t REG_SZ /d "!VERSION!" /f >nul
reg add "%REG_PATH%" /v "Publisher"       /t REG_SZ /d "Primers Corporation" /f >nul
reg add "%REG_PATH%" /v "InstallLocation" /t REG_SZ /d "%INSTALL_PATH%" /f >nul
reg add "%REG_PATH%" /v "DisplayIcon"     /t REG_SZ /d "%INSTALL_PATH%\Primora.exe" /f >nul
reg add "%REG_PATH%" /v "UninstallString" /t REG_SZ /d "powershell.exe -ExecutionPolicy Bypass -File \"%INSTALL_PATH%\Uninstall-Primora.ps1\"" /f >nul

:: Write uninstaller
(
echo # Primora Uninstaller - Primers Corporation
echo $installPath = "$env:LOCALAPPDATA\Primora"
echo $shortcut    = "$env:USERPROFILE\Desktop\Primora.lnk"
echo $regPath     = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\Primora"
echo Write-Host "[*] Uninstalling Primora..." -ForegroundColor Yellow
echo if (Test-Path $shortcut^)    { Remove-Item $shortcut -Force }
echo if (Test-Path $regPath^)     { Remove-Item $regPath -Recurse -Force }
echo if (Test-Path $installPath^) { Remove-Item $installPath -Recurse -Force }
echo Write-Host "[+] Primora removed successfully." -ForegroundColor Green
) > "%INSTALL_PATH%\Uninstall-Primora.ps1"

:: Cleanup temp files
del /Q "!ZIP_FILE!" >nul 2>&1

echo.
echo  =========================================
echo   [+] Primora v!VERSION! installed!
echo   Shortcut created on your Desktop.
echo  =========================================
echo.
echo  Press any key to launch Primora...
pause >nul
start "" "%INSTALL_PATH%\Primora.exe"
goto :end

:error
echo.
echo  Installation did not complete. Press any key to exit.
pause >nul

:end
endlocal
