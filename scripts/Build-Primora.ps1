<#
.SYNOPSIS
    Build script for Primora

.DESCRIPTION
    Compiles the Primora application and website

.PARAMETER Configuration
    Build configuration: Debug or Release

.PARAMETER Platform
    Target platform: Any CPU, x86, or x64

.EXAMPLE
    .\Build-Primora.ps1 -Configuration Release -Platform x64
#>

param (
    [ValidateSet("Debug", "Release")]
    [string]$Configuration = "Release",

    [ValidateSet("Any CPU", "x86", "x64")]
    [string]$Platform = "Any CPU"
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "  Primora Build System" -ForegroundColor Cyan
Write-Host "  Configuration: $Configuration | Platform: $Platform" -ForegroundColor Gray
Write-Host ""

# Check for dotnet
Write-Host "  [*] Checking prerequisites..." -ForegroundColor Cyan
$dotnetCheck = dotnet --version 2>$null
if (-not $dotnetCheck) {
    Write-Host "  [!] .NET SDK not found. Please install .NET 8.0 SDK." -ForegroundColor Red
    exit 1
}
Write-Host "  [+] .NET SDK: $dotnetCheck" -ForegroundColor Green

# Build App
Write-Host ""
Write-Host "  [*] Building Primora Application..." -ForegroundColor Cyan
try {
    dotnet build Primora.sln -c $Configuration -p:Platform="$Platform" --nologo
    Write-Host "  [+] App build successful." -ForegroundColor Green
} catch {
    Write-Host "  [!] App build failed: $_" -ForegroundColor Red
    exit 1
}

# Build Website (optional)
if (Test-Path "PrimoraWebsite") {
    Write-Host ""
    Write-Host "  [*] Building Primora Website..." -ForegroundColor Cyan

    # Check for npm
    $npmCheck = npm --version 2>$null
    if (-not $npmCheck) {
        Write-Host "  [!] npm not found. Skipping website build." -ForegroundColor Yellow
    } else {
        try {
            Push-Location PrimoraWebsite
            npm install
            npm run build
            Pop-Location
            Write-Host "  [+] Website build successful." -ForegroundColor Green
        } catch {
            Write-Host "  [!] Website build failed: $_" -ForegroundColor Yellow
            Pop-Location
        }
    }
}

# Build output summary
Write-Host ""
Write-Host "  =============================================" -ForegroundColor Green
Write-Host "   Build completed successfully!" -ForegroundColor Green
Write-Host "  =============================================" -ForegroundColor Green
Write-Host ""
