# Primora v2.0.0 — Liquid Glass Edition Installer
# (C) 2026 Primers Corperation

$appName = "Primora"
$appVersion = "2.0.0"
$installPath = "$env:LOCALAPPDATA\Primora"
$releaseFolder = "Release_v2.0.0_LiquidGlass"

Write-Host "----------------------------------------" -ForegroundColor Cyan
Write-Host "   Primora v2.0.0 - Liquid Glass   " -ForegroundColor White
Write-Host "      Installer & Setup Utility      " -ForegroundColor Green
Write-Host "----------------------------------------" -ForegroundColor Cyan

# 1. Ensure Installation Directory
if (!(Test-Path $installPath)) {
    Write-Host "[*] Creating installation directory: $installPath"
    New-Item -ItemType Directory -Path $installPath -Force | Out-Null
} else {
    Write-Host "[*] Found existing installation. Updating..."
}

# 2. Copy Release Assets
Write-Host "[*] Deploying Liquid Glass binary assets..."
$filesToCopy = Get-ChildItem -Path $releaseFolder -Recurse
foreach ($file in $filesToCopy) {
    $dest = Join-Path $installPath $file.FullName.Replace((Get-Item $releaseFolder).FullName, "")
    if ($file.PSIsContainer) {
        if (!(Test-Path $dest)) { New-Item -ItemType Directory -Path $dest -Force | Out-Null }
    } else {
        Copy-Item $file.FullName $dest -Force
    }
}

# 3. Create Uninstaller
Write-Host "[*] Generating uninstaller..."
$uninstallerScript = @"
`# Primora v2.0.0 Uninstaller
`# (C) 2026 Primers Corperation

`$installPath = "`$env:LOCALAPPDATA\Primora"
`$shortcutDesktop = "[Environment]::GetFolderPath('Desktop')\Primora.lnk"
`$shortcutStart = "[Environment]::GetFolderPath('StartMenu')\Programs\Primora.lnk"

Write-Host "[!] Uninstalling Primora..." -ForegroundColor Red

# Remove Registry Entry
Remove-Item -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\Primora" -Force -ErrorAction SilentlyContinue

# Remove Shortcuts
if (Test-Path `$shortcutDesktop) { Remove-Item `$shortcutDesktop -Force }
# Note: Start menu path handle manually if needed

# Remove installation folder
if (Test-Path `$installPath) { 
    Remove-Item `$installPath -Recurse -Force 
}

Write-Host "[+] Primora has been successfully removed." -ForegroundColor Green
"@
$uninstallerScript | Out-File (Join-Path $installPath "Uninstall_Primora.ps1") -Encoding utf8

# 4. Create Shortcuts (COM Object)
Write-Host "[*] Creating Desktop and Start Menu shortcuts..."
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$HOME\Desktop\Primora.lnk")
$Shortcut.TargetPath = (Join-Path $installPath "Primora.exe")
$Shortcut.WorkingDirectory = $installPath
$Shortcut.Description = "Primora - High Fidelity Controller Mapping"
$Shortcut.IconLocation = (Join-Path $installPath "Primora.exe,0")
$Shortcut.Save()

# 5. Add to Registry (Add/Remove Programs)
Write-Host "[*] Registering $appName in system..."
$registryPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\$appName"
if (!(Test-Path $registryPath)) { New-Item -Path $registryPath -Force | Out-Null }
Set-ItemProperty -Path $registryPath -Name "DisplayName" -Value "$appName (Liquid Glass Edition)"
Set-ItemProperty -Path $registryPath -Name "DisplayVersion" -Value $appVersion
Set-ItemProperty -Name "Publisher" -Value "Primers Corperation" -Path $registryPath
Set-ItemProperty -Name "InstallLocation" -Value $installPath -Path $registryPath
Set-ItemProperty -Name "UninstallString" -Value "powershell.exe -ExecutionPolicy Bypass -File `"$installPath\Uninstall_Primora.ps1`"" -Path $registryPath
Set-ItemProperty -Name "DisplayIcon" -Value (Join-Path $installPath "Primora.exe") -Path $registryPath

Write-Host "----------------------------------------" -ForegroundColor Cyan
Write-Host "[+] Installation Complete!" -ForegroundColor Green
Write-Host "[+] You can now launch Primora from your desktop."
Write-Host "----------------------------------------" -ForegroundColor Cyan
