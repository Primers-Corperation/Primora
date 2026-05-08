# =========================================
#  Primora Installer
#  (C) 2026 Primers Corporation
# =========================================

param (
    [string]$Version = "",
    [string]$Arch    = "x64"
)

$ErrorActionPreference = "Stop"

$AppName     = "Primora"
$Publisher   = "Primers Corporation"
$InstallPath = "$env:LOCALAPPDATA\Primora"
$RepoApi     = "https://api.github.com/repos/Primers-Corperation/Primora/releases"
$Headers     = @{ "User-Agent" = "PrimoraInstaller" }

function Write-Step([string]$msg)    { Write-Host "  [*] $msg" -ForegroundColor Cyan }
function Write-Success([string]$msg) { Write-Host "  [+] $msg" -ForegroundColor Green }
function Write-Fail([string]$msg)    { Write-Host "  [!] $msg" -ForegroundColor Red }

Write-Host ""
Write-Host "  =========================================" -ForegroundColor White
Write-Host "   $AppName - Controller Mapping Tool"      -ForegroundColor White
Write-Host "   Installer by $Publisher"                 -ForegroundColor DarkGray
Write-Host "  =========================================" -ForegroundColor White
Write-Host ""

# 1. Resolve version
Write-Step "Resolving version..."
try {
    if ($Version -ne "") {
        $tag     = if ($Version -notmatch "^v") { "v$Version" } else { $Version }
        $release = Invoke-RestMethod "$RepoApi/tags/$tag" -Headers $Headers
    } else {
        $release = Invoke-RestMethod "$RepoApi/latest" -Headers $Headers
    }
} catch {
    Write-Fail "Could not reach GitHub. Check your internet connection."
    Write-Fail "Download manually from: https://primora-website.vercel.app/"
    exit 1
}

$resolvedVersion = $release.tag_name -replace "^v", ""
$tag             = $release.tag_name
Write-Success "Version resolved: $resolvedVersion"

# 2. Find download asset
Write-Step "Locating release asset..."
$asset = $release.assets | Where-Object { $_.name -like "*$Arch*.zip" } | Select-Object -First 1

if (-not $asset) {
    Write-Fail "No matching release asset found for arch: $Arch"
    Write-Fail "Check releases at: https://github.com/Primers-Corperation/Primora/releases"
    exit 1
}

$downloadUrl = $asset.browser_download_url
$zipPath     = "$env:TEMP\Primora_$resolvedVersion`_$Arch.zip"
$extractPath = "$env:TEMP\Primora_Extract_$resolvedVersion"
Write-Success "Found: $($asset.name)"

# 3. Download
Write-Step "Downloading $($asset.name)..."
Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath -UseBasicParsing
Write-Success "Download complete."

# 4. Clear previous install
if (Test-Path $InstallPath) {
    Write-Step "Removing previous installation..."
    Remove-Item $InstallPath -Recurse -Force
}

# 5. Extract
Write-Step "Extracting files..."
if (Test-Path $extractPath) { Remove-Item $extractPath -Recurse -Force }
Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force

$exeSearch = Get-ChildItem -Path $extractPath -Filter "Primora.exe" -Recurse | Select-Object -First 1
if (-not $exeSearch) {
    Write-Fail "Could not locate Primora.exe in the downloaded archive."
    exit 1
}

$sourceDir = $exeSearch.DirectoryName
New-Item -ItemType Directory -Path $InstallPath -Force | Out-Null
Copy-Item "$sourceDir\*" $InstallPath -Recurse -Force
Write-Success "Files installed to: $InstallPath"

# 6. Shortcuts
Write-Step "Creating shortcuts..."
$shell = New-Object -ComObject WScript.Shell

$desktopLnk = "$env:USERPROFILE\Desktop\Primora.lnk"
$sc = $shell.CreateShortcut($desktopLnk)
$sc.TargetPath = "$InstallPath\Primora.exe"; $sc.WorkingDirectory = $InstallPath
$sc.Description = "Primora - Controller Mapping Tool"
$sc.IconLocation = "$InstallPath\Primora.exe,0"; $sc.Save()

$startMenuDir = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Primora"
New-Item -ItemType Directory -Path $startMenuDir -Force | Out-Null
$sc2 = $shell.CreateShortcut("$startMenuDir\Primora.lnk")
$sc2.TargetPath = "$InstallPath\Primora.exe"; $sc2.WorkingDirectory = $InstallPath
$sc2.Description = "Primora - Controller Mapping Tool"
$sc2.IconLocation = "$InstallPath\Primora.exe,0"; $sc2.Save()

Write-Success "Shortcuts created (Desktop + Start Menu)."

# 7. Register in Add/Remove Programs
Write-Step "Registering with Windows..."
$regPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\Primora"
if (-not (Test-Path $regPath)) { New-Item -Path $regPath -Force | Out-Null }

$uninstallScript = "$InstallPath\Uninstall-Primora.ps1"
Set-ItemProperty $regPath "DisplayName"     "$AppName"
Set-ItemProperty $regPath "DisplayVersion"  "$resolvedVersion"
Set-ItemProperty $regPath "Publisher"       "$Publisher"
Set-ItemProperty $regPath "InstallLocation" "$InstallPath"
Set-ItemProperty $regPath "DisplayIcon"     "$InstallPath\Primora.exe"
Set-ItemProperty $regPath "UninstallString" "powershell.exe -ExecutionPolicy Bypass -File `"$uninstallScript`""
Write-Success "Registered in Add/Remove Programs."

# 8. Write uninstaller
@"
# Primora Uninstaller — Primers Corporation
`$installPath  = "`$env:LOCALAPPDATA\Primora"
`$desktopLnk   = "`$env:USERPROFILE\Desktop\Primora.lnk"
`$startMenuDir = "`$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Primora"
`$regPath      = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\Primora"
Write-Host "Uninstalling Primora..." -ForegroundColor Yellow
if (Test-Path `$desktopLnk)   { Remove-Item `$desktopLnk -Force }
if (Test-Path `$startMenuDir) { Remove-Item `$startMenuDir -Recurse -Force }
if (Test-Path `$regPath)      { Remove-Item `$regPath -Recurse -Force }
if (Test-Path `$installPath)  { Remove-Item `$installPath -Recurse -Force }
Write-Host "Primora has been removed." -ForegroundColor Green
"@ | Out-File $uninstallScript -Encoding utf8

# 9. Cleanup
Remove-Item $zipPath     -Force -ErrorAction SilentlyContinue
Remove-Item $extractPath -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "  =========================================" -ForegroundColor White
Write-Host "   [+] Primora v$resolvedVersion installed!" -ForegroundColor Green
Write-Host "       Shortcut on Desktop and Start Menu." -ForegroundColor DarkGray
Write-Host "  =========================================" -ForegroundColor White
Write-Host ""

$launch = Read-Host "  Launch Primora now? (y/n)"
if ($launch -ieq "y") { Start-Process "$InstallPath\Primora.exe" }
