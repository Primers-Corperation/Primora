<#
.SYNOPSIS
    Primora v2.0.0 Installer

.DESCRIPTION
    Automated installation script for Primora controller mapping tool.
    Downloads the latest release from GitHub and installs to AppData.

.PARAMETER Version
    Optional specific version to install (default: latest)

.PARAMETER Architecture
    Target architecture: x64 (default) or x86

.EXAMPLE
    .\Install-Primora.ps1
    .\Install-Primora.ps1 -Version "2.0.0" -Architecture "x64"
#>

param (
    [string]$Version = "",
    [ValidateSet("x64", "x86")]
    [string]$Architecture = "x64"
)

#Requires -Version 5.1
$ErrorActionPreference = "Stop"

# ============================================================================
# Configuration
# ============================================================================
$Config = @{
    AppName       = "Primora"
    Publisher     = "Primers Corporation"
    RepoOwner     = "Primers-Corperation"
    RepoName      = "Primora"
    InstallPath   = "$env:LOCALAPPDATA\Primora"
    ApiUrl        = "https://api.github.com/repos"
}

# ============================================================================
# Helper Functions
# ============================================================================
function Write-Header {
    Write-Host ""
    Write-Host ("  " + ("=" * 55)) -ForegroundColor White
    Write-Host "   $($Config.AppName) v2.0.0 - Controller Mapping Tool" -ForegroundColor Cyan
    Write-Host "   Official Installer by $($Config.Publisher)" -ForegroundColor DarkGray
    Write-Host ("  " + ("=" * 55)) -ForegroundColor White
    Write-Host ""
}

function Write-Step {
    param([string]$Message)
    Write-Host "  [*] $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "  [+] $Message" -ForegroundColor Green
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "  [!] $Message" -ForegroundColor Red
}

function Test-Internet {
    try {
        $null = Invoke-WebRequest -Uri "https://api.github.com" -UseBasicParsing -TimeoutSec 3
        return $true
    } catch {
        return $false
    }
}

# ============================================================================
# Main Installation Process
# ============================================================================

Write-Header

# Check internet connectivity
Write-Step "Checking internet connectivity..."
if (-not (Test-Internet)) {
    Write-Error-Custom "No internet connection detected."
    Write-Error-Custom "Visit https://primora-website.vercel.app to download manually."
    exit 1
}
Write-Success "Internet connection verified."

# Resolve version
Write-Step "Resolving version..."
try {
    $apiUrl = "$($Config.ApiUrl)/$($Config.RepoOwner)/$($Config.RepoName)/releases"
    $headers = @{ "User-Agent" = "PrimoraInstaller/2.0" }

    if ($Version -ne "") {
        $tag = if ($Version -notmatch "^v") { "v$Version" } else { $Version }
        $release = Invoke-RestMethod "$apiUrl/tags/$tag" -Headers $headers -UseBasicParsing
    } else {
        $release = Invoke-RestMethod "$apiUrl/latest" -Headers $headers -UseBasicParsing
    }
} catch {
    Write-Error-Custom "Failed to resolve version: $_"
    Write-Error-Custom "Check your internet connection and try again."
    exit 1
}

$resolvedVersion = $release.tag_name -replace "^v", ""
Write-Success "Resolved version: $resolvedVersion"

# Find release asset
Write-Step "Locating release asset for $Architecture..."
$asset = $release.assets | Where-Object {
    $_.name -match "Primora.*$Architecture.*\.zip$"
} | Select-Object -First 1

if (-not $asset) {
    Write-Error-Custom "No matching release found for architecture: $Architecture"
    Write-Error-Custom "Visit: https://github.com/$($Config.RepoOwner)/$($Config.RepoName)/releases"
    exit 1
}

$downloadUrl = $asset.browser_download_url
$assetName = $asset.name
$zipPath = "$env:TEMP\$assetName"
$extractPath = "$env:TEMP\Primora_Extract_$resolvedVersion"

Write-Success "Found: $assetName"

# Download release
Write-Step "Downloading Primora v$resolvedVersion..."
try {
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath -UseBasicParsing
    $fileSize = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)
    Write-Success "Downloaded $fileSize MB"
} catch {
    Write-Error-Custom "Download failed: $_"
    exit 1
}

# Clear previous installation
if (Test-Path $Config.InstallPath) {
    Write-Step "Removing previous installation..."
    try {
        Remove-Item $Config.InstallPath -Recurse -Force -ErrorAction Stop
        Write-Success "Previous installation removed."
    } catch {
        Write-Error-Custom "Failed to remove previous installation: $_"
        exit 1
    }
}

# Extract files
Write-Step "Extracting files..."
try {
    if (Test-Path $extractPath) { Remove-Item $extractPath -Recurse -Force }
    Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force
    Write-Success "Files extracted."
} catch {
    Write-Error-Custom "Extraction failed: $_"
    exit 1
}

# Locate and copy Primora.exe
Write-Step "Locating application executable..."
$exeFile = Get-ChildItem -Path $extractPath -Filter "Primora.exe" -Recurse | Select-Object -First 1

if (-not $exeFile) {
    Write-Error-Custom "Primora.exe not found in archive."
    exit 1
}

$sourceDir = $exeFile.DirectoryName
try {
    $null = New-Item -ItemType Directory -Path $Config.InstallPath -Force
    Copy-Item "$sourceDir\*" $Config.InstallPath -Recurse -Force
    Write-Success "Application installed to: $($Config.InstallPath)"
} catch {
    Write-Error-Custom "Installation failed: $_"
    exit 1
}

# Create shortcuts
Write-Step "Creating shortcuts..."
try {
    $shell = New-Object -ComObject WScript.Shell
    $exePath = "$($Config.InstallPath)\Primora.exe"

    # Desktop shortcut
    $desktopPath = "$env:USERPROFILE\Desktop\Primora.lnk"
    $shortcut = $shell.CreateShortcut($desktopPath)
    $shortcut.TargetPath = $exePath
    $shortcut.WorkingDirectory = $Config.InstallPath
    $shortcut.Description = "Primora - Controller Mapping Tool"
    $shortcut.IconLocation = "$exePath,0"
    $shortcut.Save()

    # Start Menu shortcut
    $startMenuDir = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Primora"
    $null = New-Item -ItemType Directory -Path $startMenuDir -Force
    $shortcut2 = $shell.CreateShortcut("$startMenuDir\Primora.lnk")
    $shortcut2.TargetPath = $exePath
    $shortcut2.WorkingDirectory = $Config.InstallPath
    $shortcut2.Description = "Primora - Controller Mapping Tool"
    $shortcut2.IconLocation = "$exePath,0"
    $shortcut2.Save()

    Write-Success "Shortcuts created (Desktop & Start Menu)."
} catch {
    Write-Error-Custom "Failed to create shortcuts: $_"
}

# Create uninstaller
Write-Step "Setting up uninstaller..."
$uninstallerPath = "$($Config.InstallPath)\Uninstall-Primora.ps1"
$uninstallerContent = @"
# Primora Uninstaller - Primers Corporation
`$Config = @{
    AppName       = "$($Config.AppName)"
    InstallPath   = "$($Config.InstallPath)"
    DesktopPath   = "`$env:USERPROFILE\Desktop\Primora.lnk"
    StartMenuPath = "`$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Primora"
    RegPath       = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\Primora"
}

Write-Host ""
Write-Host "  Uninstalling `$(`$Config.AppName)..." -ForegroundColor Yellow

try {
    if (Test-Path `$Config.DesktopPath) { Remove-Item `$Config.DesktopPath -Force }
    if (Test-Path `$Config.StartMenuPath) { Remove-Item `$Config.StartMenuPath -Recurse -Force }
    if (Test-Path `$Config.RegPath) { Remove-Item `$Config.RegPath -Recurse -Force }
    if (Test-Path `$Config.InstallPath) { Remove-Item `$Config.InstallPath -Recurse -Force }
    Write-Host "  [+] `$(`$Config.AppName) has been removed." -ForegroundColor Green
} catch {
    Write-Host "  [!] Uninstall failed: `$_" -ForegroundColor Red
}
Write-Host ""
"@

try {
    $uninstallerContent | Out-File $uninstallerPath -Encoding utf8 -Force
    Write-Success "Uninstaller created."
} catch {
    Write-Error-Custom "Failed to create uninstaller: $_"
}

# Register in Windows
Write-Step "Registering in Windows..."
try {
    $regPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\Primora"
    $null = New-Item -Path $regPath -Force

    Set-ItemProperty $regPath "DisplayName" $Config.AppName
    Set-ItemProperty $regPath "DisplayVersion" $resolvedVersion
    Set-ItemProperty $regPath "Publisher" $Config.Publisher
    Set-ItemProperty $regPath "InstallLocation" $Config.InstallPath
    Set-ItemProperty $regPath "DisplayIcon" "$($Config.InstallPath)\Primora.exe"
    Set-ItemProperty $regPath "UninstallString" "powershell.exe -ExecutionPolicy Bypass -File `"$uninstallerPath`""

    Write-Success "Registered in Add/Remove Programs."
} catch {
    Write-Error-Custom "Failed to register: $_"
}

# Cleanup temporary files
Write-Step "Cleaning up temporary files..."
try {
    Remove-Item $zipPath -Force -ErrorAction SilentlyContinue
    Remove-Item $extractPath -Recurse -Force -ErrorAction SilentlyContinue
    Write-Success "Cleanup complete."
} catch {
    Write-Error-Custom "Cleanup failed (non-critical): $_"
}

# Installation complete
Write-Host ""
Write-Host ("  " + ("=" * 55)) -ForegroundColor Green
Write-Host "   [+] Primora v$resolvedVersion installed successfully!" -ForegroundColor Green
Write-Host "       Shortcuts: Desktop & Start Menu" -ForegroundColor DarkGray
Write-Host ("  " + ("=" * 55)) -ForegroundColor Green
Write-Host ""

# Offer to launch
$launchChoice = Read-Host "  Launch Primora now? (y/n)"
if ($launchChoice -ieq "y") {
    try {
        Start-Process "$($Config.InstallPath)\Primora.exe"
        Write-Host "  [+] Primora is starting..." -ForegroundColor Green
    } catch {
        Write-Error-Custom "Failed to launch: $_"
    }
}

Write-Host ""
