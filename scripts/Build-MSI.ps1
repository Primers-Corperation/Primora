<#
.SYNOPSIS
    Builds the Primora MSI and Setup EXE using WiX 5.

.DESCRIPTION
    Publishes the app, generates the installer branding assets, then builds
    dist\Primora-<version>-x64.msi and dist\Primora-<version>-Setup.exe.

    The installer payload is harvested from the publish output by
    PrimoraInstaller\Files.wxs, so nothing here needs updating when the app
    gains or drops a dependency.

.PARAMETER Version
    Product version stamped into the MSI, the bundle and the output filenames.

.PARAMETER PublishDir
    Pre-built publish output to package. When omitted the script publishes the
    app itself into build\publish.

.PARAMETER SkipBootstrapper
    Build the MSI only, skipping the Setup EXE.

.EXAMPLE
    .\Build-MSI.ps1
    .\Build-MSI.ps1 -Version 2.1.0
    .\Build-MSI.ps1 -PublishDir C:\out\publish -SkipBootstrapper
#>

param(
    [string]$Version = "2.0.0",
    [string]$PublishDir,
    [switch]$SkipBootstrapper
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot

$WixVersion = "5.0.2"
$WixExtensions = @(
    "WixToolset.UI.wixext",
    "WixToolset.Bal.wixext",
    "WixToolset.Util.wixext"
)

function Write-Step { param([string]$m) Write-Host "  [*] $m" -ForegroundColor Cyan }
function Write-OK   { param([string]$m) Write-Host "  [+] $m" -ForegroundColor Green }

Write-Host ""
Write-Host "  ============================================================" -ForegroundColor White
Write-Host "   Primora $Version - MSI Build Pipeline" -ForegroundColor Cyan
Write-Host "  ============================================================" -ForegroundColor White
Write-Host ""

# ---- Prerequisites ----------------------------------------------------------
Write-Step "Checking prerequisites..."

if (-not (Get-Command dotnet -ErrorAction SilentlyContinue)) { throw ".NET SDK not found." }
Write-OK ".NET SDK $(dotnet --version)"

$installedWix = (wix --version 2>$null)
if (-not $installedWix -or -not $installedWix.StartsWith("5.")) {
    Write-Step "Installing WiX $WixVersion..."
    dotnet tool uninstall --global wix 2>&1 | Out-Null
    dotnet tool install --global wix --version $WixVersion 2>&1 | Out-Null
}
Write-OK "WiX $(wix --version 2>$null)"

$extensionList = wix extension list 2>$null
foreach ($ext in $WixExtensions) {
    if (-not ($extensionList | Select-String -SimpleMatch $ext)) {
        wix extension add "$ext/$WixVersion" 2>&1 | Out-Null
        Write-OK "$ext added."
    }
}

# ---- Publish the application ------------------------------------------------
if ([string]::IsNullOrWhiteSpace($PublishDir)) {
    $PublishDir = Join-Path $Root "build\publish"
    Write-Step "Publishing Primora to build\publish..."

    if (Test-Path $PublishDir) { Remove-Item $PublishDir -Recurse -Force }

    # Framework-dependent on purpose: the bundle installs the .NET 8 Desktop
    # Runtime as a prerequisite, so shipping a second copy inside the MSI would
    # only make the download larger.
    & dotnet publish (Join-Path $Root "PrimoraApp\Primora.csproj") `
        -c Release `
        -p:Platform=x64 `
        -p:AssemblyVersion=$Version `
        -p:FileVersion=$Version `
        -p:Version=$Version `
        -o $PublishDir
    if ($LASTEXITCODE -ne 0) { throw "dotnet publish failed." }
}

$exePath = Join-Path $PublishDir "Primora.exe"
if (-not (Test-Path $exePath)) { throw "Primora.exe not found in '$PublishDir'." }
Write-OK "Payload ready ($((Get-ChildItem $PublishDir -Recurse -File).Count) files)"

# ---- Generate branding assets -----------------------------------------------
Write-Step "Generating installer branding assets..."

$assetsDir = Join-Path $Root "PrimoraInstaller\Assets"
New-Item -ItemType Directory -Path $assetsDir -Force | Out-Null

Copy-Item (Join-Path $Root "PrimoraApp\Primora.ico") (Join-Path $assetsDir "primora.ico") -Force
Write-OK "primora.ico copied."

# Bundle.wxs references Logo.png; it is copied from the app resources rather
# than drawn, so the bootstrapper build no longer depends on a file that only
# ever existed on one developer machine.
Copy-Item (Join-Path $Root "PrimoraApp\Resources\PrimoraLogo.png") (Join-Path $assetsDir "Logo.png") -Force
Write-OK "Logo.png copied."

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
$g.DrawString("Controller Mapping Tool  v$Version", $fSub,
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
$g.DrawString("v$Version",           $vf, $gr, [float]12, [float]244)
$g.DrawString("Primers Corporation", $vf, $gr, [float]8,  [float]258)

$bmp.Save((Join-Path $assetsDir "Dialog.bmp"), [System.Drawing.Imaging.ImageFormat]::Bmp)
$g.Dispose(); $bmp.Dispose()
Write-OK "Dialog.bmp generated (493x312)"

# ---- Build MSI --------------------------------------------------------------
Write-Step "Building MSI..."

$installerDir = Join-Path $Root "PrimoraInstaller"
$distDir      = Join-Path $Root "dist"
New-Item -ItemType Directory -Path $distDir -Force | Out-Null
$msiOut = Join-Path $distDir "Primora-$Version-x64.msi"

$wxsList = @(
    (Join-Path $installerDir "Package.wxs"),
    (Join-Path $installerDir "Files.wxs"),
    (Join-Path $installerDir "Shortcuts.wxs"),
    (Join-Path $installerDir "RegistryEntries.wxs")
)

& wix build @wxsList `
    -ext WixToolset.UI.wixext `
    -o $msiOut `
    -d ProductVersion=$Version `
    -d PublishDir=$PublishDir
if ($LASTEXITCODE -ne 0) { throw "MSI build failed." }

Write-OK "MSI built: dist\Primora-$Version-x64.msi ($([math]::Round((Get-Item $msiOut).Length/1MB,1)) MB)"

# ---- Build Bootstrapper EXE -------------------------------------------------
if (-not $SkipBootstrapper) {
    Write-Step "Building Setup bootstrapper EXE..."

    $bundleDir = Join-Path $Root "PrimoraBootstrapper"
    $exeOut    = Join-Path $distDir "Primora-$Version-Setup.exe"

    & wix build (Join-Path $bundleDir "Bundle.wxs") `
        -ext WixToolset.UI.wixext `
        -ext WixToolset.Bal.wixext `
        -ext WixToolset.Util.wixext `
        -b $bundleDir `
        -o $exeOut `
        -d ProductVersion=$Version `
        -d MsiPath=$msiOut

    # A silent fallback here is what let broken bootstrapper builds ship before,
    # so this is fatal now.
    if ($LASTEXITCODE -ne 0) { throw "Bootstrapper build failed." }

    Write-OK "Setup EXE: dist\Primora-$Version-Setup.exe ($([math]::Round((Get-Item $exeOut).Length/1MB,1)) MB)"
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
