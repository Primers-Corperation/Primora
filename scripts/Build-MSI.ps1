<#
.SYNOPSIS
    Builds the Primora MSI installer and Setup bootstrapper EXE.

.DESCRIPTION
    Full pipeline:
      1. Installs WiX Toolset 5 via dotnet tool (if not present)
      2. Generates installer bitmap assets (Banner.bmp + Dialog.bmp) via .NET GDI+
      3. Converts primora.ico → primora.ico in Assets/ (copies)
      4. Builds PrimoraInstaller.msi  (WiX Package)
      5. Builds Primora-2.0.0-Setup.exe  (WiX Bundle / bootstrapper)
      6. Outputs both artefacts to .\dist\

.PARAMETER Configuration
    Debug or Release (default: Release)

.PARAMETER Platform
    x64 or x86 (default: x64)

.PARAMETER SkipBootstrapper
    Build MSI only; skip the EXE bootstrapper.

.EXAMPLE
    .\Build-MSI.ps1
    .\Build-MSI.ps1 -Configuration Debug -Platform x64
    .\Build-MSI.ps1 -SkipBootstrapper
#>

param(
    [ValidateSet("Debug","Release")]
    [string]$Configuration = "Release",

    [ValidateSet("x64","x86")]
    [string]$Platform = "x64",

    [switch]$SkipBootstrapper
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot   # repo root (scripts\ lives inside it)

# ─────────────────────────────────────────────────────────────────────────────
function Write-Step   { param([string]$m) Write-Host "  [*] $m" -ForegroundColor Cyan }
function Write-OK     { param([string]$m) Write-Host "  [+] $m" -ForegroundColor Green }
function Write-Warn   { param([string]$m) Write-Host "  [!] $m" -ForegroundColor Yellow }
function Write-Fail   { param([string]$m) Write-Host "  [X] $m" -ForegroundColor Red }
# ─────────────────────────────────────────────────────────────────────────────

Write-Host ""
Write-Host ("  " + ("=" * 62)) -ForegroundColor White
Write-Host "   Primora v2.0.0 — MSI Build Pipeline" -ForegroundColor Cyan
Write-Host "   Configuration: $Configuration | Platform: $Platform" -ForegroundColor DarkGray
Write-Host ("  " + ("=" * 62)) -ForegroundColor White
Write-Host ""

# ─── Step 0: Prerequisites ───────────────────────────────────────────────────
Write-Step "Checking prerequisites..."

# .NET SDK
$dotnetVer = dotnet --version 2>$null
if (-not $dotnetVer) { Write-Fail ".NET SDK not found. Install .NET 8 SDK from https://dot.net"; exit 1 }
Write-OK ".NET SDK $dotnetVer"

# WiX Toolset 5 (dotnet global tool)
$wixCheck = dotnet tool list -g 2>$null | Select-String "wix"
if (-not $wixCheck) {
    Write-Step "Installing WiX Toolset 5 (dotnet global tool)..."
    dotnet tool install --global wix --version 5.* 2>&1 | Out-Null
    $wixCheck = dotnet tool list -g 2>$null | Select-String "wix"
    if (-not $wixCheck) { Write-Fail "WiX install failed."; exit 1 }
    Write-OK "WiX Toolset installed."
} else {
    Write-OK "WiX Toolset found: $($wixCheck.ToString().Trim())"
}

# WiX UI extension (needed for WixUI_InstallDir)
$wixExt = dotnet tool run wix extension list 2>$null | Select-String "WixToolset.UI.wixext"
if (-not $wixExt) {
    Write-Step "Adding WixToolset.UI.wixext..."
    dotnet tool run wix extension add WixToolset.UI.wixext 2>&1 | Out-Null
    Write-OK "UI extension added."
}

# WiX Bal extension (needed for Bundle / bootstrapper)
$wixBal = dotnet tool run wix extension list 2>$null | Select-String "WixToolset.Bal.wixext"
if (-not $wixBal) {
    Write-Step "Adding WixToolset.Bal.wixext..."
    dotnet tool run wix extension add WixToolset.Bal.wixext 2>&1 | Out-Null
    Write-OK "Bal (bootstrapper) extension added."
}

# ─── Step 1: Verify source binaries exist ────────────────────────────────────
Write-Step "Verifying application binaries..."

$releaseDir = Join-Path $Root "Release_v2.0.0_LiquidGlass"
$exePath    = Join-Path $releaseDir "Primora.exe"

if (-not (Test-Path $exePath)) {
    Write-Warn "Primora.exe not found in Release_v2.0.0_LiquidGlass\"
    Write-Warn "Build the application first: .\Build-Primora.ps1 -Configuration Release"
    Write-Fail "Cannot build MSI without application binaries."
    exit 1
}

$exeSize = [math]::Round((Get-Item $exePath).Length / 1MB, 1)
Write-OK "Primora.exe found ($exeSize MB)"

# ─── Step 2: Generate branding bitmap assets ─────────────────────────────────
Write-Step "Generating installer branding assets..."

$assetsDir = Join-Path $Root "PrimoraInstaller\Assets"
New-Item -ItemType Directory -Path $assetsDir -Force | Out-Null

# Copy application icon
$sourceIco = Join-Path $Root "PrimoraApp\Primora.ico"
$destIco   = Join-Path $assetsDir "primora.ico"
if (Test-Path $sourceIco) {
    Copy-Item $sourceIco $destIco -Force
    Write-OK "primora.ico copied."
} else {
    Write-Warn "PrimoraApp\Primora.ico not found — MSI will use default icon."
}

# Generate Banner.bmp (493 x 58 px — top banner strip on all installer dialogs)
$bannerPath = Join-Path $assetsDir "Banner.bmp"
if (-not (Test-Path $bannerPath)) {
    Add-Type -AssemblyName System.Drawing
    $bmp = New-Object System.Drawing.Bitmap(493, 58)
    $gfx = [System.Drawing.Graphics]::FromImage($bmp)

    # Navy-blue gradient (matches Primora brand palette)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        [System.Drawing.Point]::new(0,0),
        [System.Drawing.Point]::new(493,0),
        [System.Drawing.Color]::FromArgb(255, 13, 26, 42),    # #0D1A2A dark navy
        [System.Drawing.Color]::FromArgb(255, 42, 74, 106)    # #2A4A6A mid navy
    )
    $gfx.FillRectangle($brush, 0, 0, 493, 58)

    # App name
    $font  = New-Object System.Drawing.Font("Segoe UI", 18, [System.Drawing.FontStyle]::Bold)
    $fontS = New-Object System.Drawing.Font("Segoe UI", 9)
    $white = [System.Drawing.Brushes]::White
    $grayB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 150, 180, 210))

    $gfx.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
    $gfx.DrawString("Primora",          $font,  $white, 16, 10)
    $gfx.DrawString("Controller Mapping Tool — v2.0.0", $fontS, $grayB, 18, 38)

    # Accent line
    $accentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 78, 133, 191))  # #4E85BF
    $gfx.FillRectangle($accentBrush, 0, 54, 493, 4)

    $bmp.Save($bannerPath, [System.Drawing.Imaging.ImageFormat]::Bmp)
    $gfx.Dispose(); $bmp.Dispose()
    Write-OK "Banner.bmp generated (493x58)."
} else {
    Write-OK "Banner.bmp already exists."
}

# Generate Dialog.bmp (493 x 312 px — background of Welcome / Finish dialogs)
$dialogPath = Join-Path $assetsDir "Dialog.bmp"
if (-not (Test-Path $dialogPath)) {
    Add-Type -AssemblyName System.Drawing
    $bmp = New-Object System.Drawing.Bitmap(493, 312)
    $gfx = [System.Drawing.Graphics]::FromImage($bmp)

    # Left panel: deep navy
    $leftBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        [System.Drawing.Point]::new(0,0),
        [System.Drawing.Point]::new(160,312),
        [System.Drawing.Color]::FromArgb(255, 10, 20, 35),
        [System.Drawing.Color]::FromArgb(255, 20, 45, 75)
    )
    $gfx.FillRectangle($leftBrush, 0, 0, 160, 312)

    # Right panel: very light off-white (standard installer look)
    $rightBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 248, 250, 252))
    $gfx.FillRectangle($rightBrush, 160, 0, 333, 312)

    # Accent vertical stripe
    $stripeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 78, 133, 191))
    $gfx.FillRectangle($stripeBrush, 156, 0, 4, 312)

    # "P" monogram on left panel
    $pFont  = New-Object System.Drawing.Font("Segoe UI", 64, [System.Drawing.FontStyle]::Bold)
    $pBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(60, 78, 133, 191))
    $gfx.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
    $gfx.DrawString("P", $pFont, $pBrush, 18, 90)

    # App name & version on left panel (white)
    $nameFont = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
    $verFont  = New-Object System.Drawing.Font("Segoe UI", 7)
    $wh       = [System.Drawing.Brushes]::White
    $grayT    = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 150, 180, 210))
    $gfx.DrawString("Primora",  $nameFont, $wh,    12, 220)
    $gfx.DrawString("v2.0.0",   $verFont,  $grayT, 14, 242)
    $gfx.DrawString("Primers Corporation", $verFont, $grayT, 8, 258)

    $bmp.Save($dialogPath, [System.Drawing.Imaging.ImageFormat]::Bmp)
    $gfx.Dispose(); $bmp.Dispose()
    Write-OK "Dialog.bmp generated (493x312)."
} else {
    Write-OK "Dialog.bmp already exists."
}

# Placeholder Logo.png for bootstrapper UI (128x128 simple coloured square if missing)
$logoPath = Join-Path $assetsDir "Logo.png"
if (-not (Test-Path $logoPath)) {
    Add-Type -AssemblyName System.Drawing
    $bmp = New-Object System.Drawing.Bitmap(128, 128)
    $gfx = [System.Drawing.Graphics]::FromImage($bmp)
    $bg  = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 13, 26, 42))
    $acc = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 78, 133, 191))
    $gfx.FillRectangle($bg, 0,0,128,128)
    $pF = New-Object System.Drawing.Font("Segoe UI", 72, [System.Drawing.FontStyle]::Bold)
    $gfx.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
    $gfx.DrawString("P", $pF, $acc, 16, 10)
    $bmp.Save($logoPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $gfx.Dispose(); $bmp.Dispose()
    Write-OK "Logo.png placeholder generated."
}

# ─── Step 3: Build MSI ───────────────────────────────────────────────────────
Write-Step "Building Primora MSI package..."

$installerDir = Join-Path $Root "PrimoraInstaller"
$distDir      = Join-Path $Root "dist"
New-Item -ItemType Directory -Path $distDir -Force | Out-Null

Push-Location $installerDir
try {
    dotnet build PrimoraInstaller.wixproj `
        -c $Configuration `
        -p:Platform=$Platform `
        --nologo
    if ($LASTEXITCODE -ne 0) { throw "MSI build failed (exit $LASTEXITCODE)" }
} finally { Pop-Location }

$msiSource = Join-Path $installerDir "bin\$Configuration\$Platform\en-US\PrimoraInstaller.msi"
$msiDest   = Join-Path $distDir "Primora-2.0.0-$Platform.msi"

if (Test-Path $msiSource) {
    Copy-Item $msiSource $msiDest -Force
    $msiSize = [math]::Round((Get-Item $msiDest).Length / 1MB, 1)
    Write-OK "MSI built: dist\Primora-2.0.0-$Platform.msi ($msiSize MB)"
} else {
    Write-Fail "MSI output not found at: $msiSource"
    exit 1
}

# ─── Step 4: Build Bootstrapper EXE ─────────────────────────────────────────
if (-not $SkipBootstrapper) {
    Write-Step "Building Primora Setup bootstrapper EXE..."

    $bundleDir = Join-Path $Root "PrimoraBootstrapper"
    Push-Location $bundleDir
    try {
        dotnet build PrimoraBootstrapper.wixproj `
            -c $Configuration `
            -p:Platform=$Platform `
            --nologo
        if ($LASTEXITCODE -ne 0) { throw "Bundle build failed (exit $LASTEXITCODE)" }
    } finally { Pop-Location }

    $exeSource = Join-Path $bundleDir "bin\$Configuration\$Platform\PrimoraBootstrapper.exe"
    $exeDest   = Join-Path $distDir "Primora-2.0.0-Setup.exe"

    if (Test-Path $exeSource) {
        Copy-Item $exeSource $exeDest -Force
        $exeSize = [math]::Round((Get-Item $exeDest).Length / 1MB, 1)
        Write-OK "Setup EXE built: dist\Primora-2.0.0-Setup.exe ($exeSize MB)"
    } else {
        Write-Warn "Bootstrapper EXE not found (Bundle build may require code-signing setup)."
    }
}

# ─── Summary ─────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host ("  " + ("=" * 62)) -ForegroundColor Green
Write-Host "   Build Complete!" -ForegroundColor Green
Write-Host ""

Get-ChildItem $distDir -Filter "Primora*" | ForEach-Object {
    $sz = [math]::Round($_.Length / 1MB, 1)
    Write-Host "   ✓  $($_.Name)  ($sz MB)" -ForegroundColor White
}
Write-Host ""
Write-Host "   Distribute: dist\Primora-2.0.0-Setup.exe" -ForegroundColor Cyan
Write-Host "   (Users run the Setup EXE — it handles all prerequisites)" -ForegroundColor DarkGray
Write-Host ("  " + ("=" * 62)) -ForegroundColor Green
Write-Host ""
