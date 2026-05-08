<#
.SYNOPSIS
    Development environment setup for Primora

.DESCRIPTION
    Validates and configures the development environment

.EXAMPLE
    .\Setup-Environment.ps1
#>

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "  Primora Development Environment Setup" -ForegroundColor Cyan
Write-Host ""

# Track status
$checks = @{}

# Check .NET SDK
Write-Host "  [*] Checking .NET SDK..." -ForegroundColor Cyan
$dotnetVersion = dotnet --version 2>$null
if ($dotnetVersion -and $dotnetVersion -like "8.0*") {
    Write-Host "  [+] .NET SDK 8.0 detected: $dotnetVersion" -ForegroundColor Green
    $checks["DotNet"] = $true
} else {
    Write-Host "  [!] .NET SDK 8.0 required. Please install from: https://dotnet.microsoft.com/download" -ForegroundColor Red
    $checks["DotNet"] = $false
}

# Check Node.js (for website)
Write-Host ""
Write-Host "  [*] Checking Node.js..." -ForegroundColor Cyan
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "  [+] Node.js detected: $nodeVersion" -ForegroundColor Green
    $checks["Node"] = $true
} else {
    Write-Host "  [!] Node.js not found (required for website development)" -ForegroundColor Yellow
    $checks["Node"] = $false
}

# Check Git
Write-Host ""
Write-Host "  [*] Checking Git..." -ForegroundColor Cyan
$gitVersion = git --version 2>$null
if ($gitVersion) {
    Write-Host "  [+] Git detected: $gitVersion" -ForegroundColor Green
    $checks["Git"] = $true
} else {
    Write-Host "  [!] Git not found (required for version control)" -ForegroundColor Yellow
    $checks["Git"] = $false
}

# Check Visual Studio or Build Tools
Write-Host ""
Write-Host "  [*] Checking Visual Studio..." -ForegroundColor Cyan
$vsPath = Get-ChildItem -Path "C:\Program Files*" -Filter "*Visual Studio*" -Directory 2>$null | Select-Object -First 1
if ($vsPath) {
    Write-Host "  [+] Visual Studio detected: $($vsPath.Name)" -ForegroundColor Green
    $checks["VS"] = $true
} else {
    Write-Host "  [!] Visual Studio not found (highly recommended)" -ForegroundColor Yellow
    $checks["VS"] = $false
}

# Verify project structure
Write-Host ""
Write-Host "  [*] Checking project structure..." -ForegroundColor Cyan
$requiredFolders = @("PrimoraApp", "PrimoraTests", "PrimoraWebsite", "scripts", "docs")
$structureValid = $true
foreach ($folder in $requiredFolders) {
    if (Test-Path $folder) {
        Write-Host "    [+] $folder/" -ForegroundColor Green
    } else {
        Write-Host "    [!] $folder/ (missing)" -ForegroundColor Red
        $structureValid = $false
    }
}
$checks["Structure"] = $structureValid

# Summary
Write-Host ""
Write-Host "  =============================================" -ForegroundColor Cyan
Write-Host "   Environment Check Summary" -ForegroundColor Cyan
Write-Host "  =============================================" -ForegroundColor Cyan

$passed = ($checks.Values | Where-Object { $_ -eq $true }).Count
$total = $checks.Count

Write-Host ""
Write-Host "   Status: $passed/$total checks passed" -ForegroundColor $(if ($passed -eq $total) { "Green" } else { "Yellow" })
Write-Host ""

if ($checks["DotNet"] -and $checks["Git"] -and $checks["Structure"]) {
    Write-Host "   ✓ Ready to build Primora!" -ForegroundColor Green
    Write-Host ""
    Write-Host "   Next steps:" -ForegroundColor Cyan
    Write-Host "     1. Open Primora.sln in Visual Studio" -ForegroundColor Gray
    Write-Host "     2. Build solution (Ctrl+Shift+B)" -ForegroundColor Gray
    Write-Host "     3. Run tests: .\Build-Primora.ps1 -Configuration Debug" -ForegroundColor Gray
} else {
    Write-Host "   [!] Missing critical dependencies. Please install them first." -ForegroundColor Red
}

Write-Host ""
