<#
.SYNOPSIS
    Builds Primora MSI and Setup EXE using WiX 4.

.PARAMETER SkipBootstrapper
    Build MSI only.

.EXAMPLE
    .\Build-MSI.ps1
    .\Build-MSI.ps1 -SkipBootstrapper
#>

param([switch]$SkipBootstrapper)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot

function Write-Step { param([string]$m) Write-Host "  [*] $m" -ForegroundColor Cyan }
function Write-OK   { param([string]$m) Write-Host "  [+] $m" -ForegroundColor Green }
function Write-Warn { param([string]$m) Write-Host "  [!] $m" -ForegroundColor Yellow }

Write-Host ""
Write-Host "  ============================================================" -ForegroundColor White
Write-Host "   Primora v2.0.0 - MSI Build Pipeline" -ForegroundColor Cyan
Write-Host "  ============================================================" -ForegroundColor White
Write-Host ""

# ---- Prerequisites ----------------------------------------------------------
Write-Step "Checking prerequisites..."

if (-not (dotnet --version 2>$null)) { throw ".NET SDK not found." }
Write-OK ".NET SDK $(dotnet --version)"

$wixVer = wix --version 2>$null
if (-not $wixVer -or $wixVer -like "7.*") {
    Write-Step "Installing WiX 4 (free/open-source)..."
    if ($wixVer -like "7.*") { dotnet tool uninstall --global wix 2>$null }
    dotnet tool install --global wix --version "4.*" 2>&1 | Out-Null
}
Write-OK "WiX $(wix --version 2>$null)"

foreach ($ext in @("WixToolset.UI.wixext/4.0.6","WixToolset.Bal.wixext/4.0.6")) {
    $name = ($ext -split "/")[0]
    if (-not (wix extension list 2>$null | Select-String $name)) {
        wix extension add $ext 2>&1 | Out-Null
        Write-OK "$name added."
    }
}

# ---- Verify binaries --------------------------------------------------------
Write-Step "Verifying application binaries..."

$releaseDir = Join-Path $Root "Release_v2.0.0_LiquidGlass"
$exePath    = Join-Path $releaseDir "Primora.exe"
if (-not (Test-Path $exePath)) {
    throw "Primora.exe not found in Release_v2.0.0_LiquidGlass\. Build the app first."
}
Write-OK "Primora.exe found ($([math]::Round((Get-Item $exePath).Length/1MB,1)) MB)"

# ---- Generate branding assets -----------------------------------------------
Write-Step "Generating installer branding assets..."

$assetsDir = Join-Path $Root "PrimoraInstaller\Assets"
New-Item -ItemType Directory -Path $assetsDir -Force | Out-Null

# Copy icon
$srcIco = Join-Path $Root "PrimoraApp\Primora.ico"
if (Test-Path $srcIco) {
    Copy-Item $srcIco (Join-Path $assetsDir "primora.ico") -Force
    Write-OK "primora.ico copied."
}

Add-Type -AssemblyName System.Drawing

# --- Banner.bmp (493 x 58) top strip on every installer dialog ---
$bmp = New-Object System.Drawing.Bitmap(493, 58)
$g   = [System.Drawing.Graphics]::FromImage($bmp)
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias

$grad = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    [System.Drawing.Point]::new(0,0), [System.Drawing.Point]::new(493,0),
    [System.Drawing.Color]::FromArgb(255,10,20,35),
    [System.Drawing.Color]::FromArgb(255,30,60,95))
$g.FillRectangle($grad, 0, 0, 493, 58)
$g.FillRectangle(
    (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255,78,133,191))),
    0, 54, 493, 4)

$fBig = New-Object System.Drawing.Font("Segoe UI", 18, [System.Drawing.FontStyle]::Bold)
$fSub = New-Object System.Drawing.Font("Segoe UI", 9)
$g.DrawString("Primora", $fBig, [System.Drawing.Brushes]::White, [float]16, [float]8)
$g.DrawString("Controller Mapping Tool  v2.0.0", $fSub,
    (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(190,150,190,220))),
    [float]18, [float]37)

$bmp.Save((Join-Path $assetsDir "Banner.bmp"), [System.Drawing.Imaging.ImageFormat]::Bmp)
$g.Dispose(); $bmp.Dispose()
Write-OK "Banner.bmp generated (493x58)"

# --- Dialog.bmp (493 x 312) background of Welcome/Finish dialogs ---
$bmp = New-Object System.Drawing.Bitmap(493, 312)
$g   = [System.Drawing.Graphics]::FromImage($bmp)
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias

$lbg = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    [System.Drawing.Point]::new(0,0), [System.Drawing.Point]::new(0,312),
    [System.Drawing.Color]::FromArgb(255,8,16,28),
    [System.Drawing.Color]::FromArgb(255,20,45,75))
$g.FillRectangle($lbg, 0,0,160,312)
$g.FillRectangle(
    (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255,247,249,252))),
    160,0,333,312)
$g.FillRectangle(
    (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255,78,133,191))),
    157,0,3,312)

$pFont = New-Object System.Drawing.Font("Segoe UI", 72, [System.Drawing.FontStyle]::Bold)
$g.DrawString("P", $pFont,
    (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(45,78,133,191))),
    [float]10, [float]85)

$nf = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
$vf = New-Object System.Drawing.Font("Segoe UI", 7)
$gr = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(170,140,175,210))
$g.DrawString("Primora",             $nf, [System.Drawing.Brushes]::White, [float]10, [float]222)
$g.DrawString("v2.0.0",             $vf, $gr, [float]12, [float]244)
$g.DrawString("Primers Corporation", $vf, $gr, [float]8,  [float]258)

$bmp.Save((Join-Path $assetsDir "Dialog.bmp"), [System.Drawing.Imaging.ImageFormat]::Bmp)
$g.Dispose(); $bmp.Dispose()
Write-OK "Dialog.bmp generated (493x312)"

# ---- Build MSI --------------------------------------------------------------
Write-Step "Building MSI..."

$installerDir = Join-Path $Root "PrimoraInstaller"
$distDir      = Join-Path $Root "dist"
New-Item -ItemType Directory -Path $distDir -Force | Out-Null
$msiOut = Join-Path $distDir "Primora-2.0.0-x64.msi"

$wxsList = @(
    (Join-Path $installerDir "Package.wxs"),
    (Join-Path $installerDir "Files.wxs"),
    (Join-Path $installerDir "Shortcuts.wxs"),
    (Join-Path $installerDir "RegistryEntries.wxs")
)

& wix build @wxsList -ext WixToolset.UI.wixext -o $msiOut -d ProductVersion=2.0.0
if ($LASTEXITCODE -ne 0) { throw "MSI build failed." }

Write-OK "MSI built: dist\Primora-2.0.0-x64.msi ($([math]::Round((Get-Item $msiOut).Length/1MB,1)) MB)"

# ---- Build Bootstrapper EXE -------------------------------------------------
if (-not $SkipBootstrapper) {
    Write-Step "Building Setup bootstrapper EXE..."

    $bundleDir = Join-Path $Root "PrimoraBootstrapper"
    $exeOut    = Join-Path $distDir "Primora-2.0.0-Setup.exe"

    & wix build (Join-Path $bundleDir "Bundle.wxs") `
        -ext WixToolset.UI.wixext `
        -ext WixToolset.Bal.wixext `
        -o $exeOut `
        -d ProductVersion=2.0.0 `
        -d MsiPath=$msiOut

    if ($LASTEXITCODE -ne 0) {
        Write-Warn "Bootstrapper build failed. MSI-only release."
    } else {
        Write-OK "Setup EXE: dist\Primora-2.0.0-Setup.exe ($([math]::Round((Get-Item $exeOut).Length/1MB,1)) MB)"
    }
}

# ---- Summary ----------------------------------------------------------------
Write-Host ""
Write-Host "  ============================================================" -ForegroundColor Green
Write-Host "   Build Complete!" -ForegroundColor Green
Get-ChildItem $distDir -Filter "Primora*" | ForEach-Object {
    Write-Host "   + $($_.Name)  ($([math]::Round($_.Length/1MB,1)) MB)" -ForegroundColor White
}
Write-Host "  ============================================================" -ForegroundColor Green
Write-Host ""
