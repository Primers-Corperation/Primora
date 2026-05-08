# Primora Scripts & Deployment Tools

Production-grade PowerShell scripts for building, testing, and deploying Primora.

## Quick Start

```powershell
# Setup development environment
.\Setup-Environment.ps1

# Build the application
.\Build-Primora.ps1 -Configuration Release

# Install for users
.\Install-Primora.ps1
```

## Scripts Overview

### 🏗️ Build & Development

#### `Setup-Environment.ps1`
Validates development environment prerequisites.
- Checks .NET SDK 8.0
- Checks Node.js (for website)
- Checks Git
- Verifies project structure

**Usage:**
```powershell
.\Setup-Environment.ps1
```

---

#### `Build-Primora.ps1`
Builds the WPF application and website.

**Parameters:**
- `-Configuration`: Debug or Release (default: Release)
- `-Platform`: Any CPU, x86, or x64 (default: Any CPU)

**Usage:**
```powershell
.\Build-Primora.ps1
.\Build-Primora.ps1 -Configuration Debug -Platform x64
```

---

### 📦 Installation & Deployment

#### `Install-Primora.ps1`
User-friendly installer. Downloads and installs to %LOCALAPPDATA%\Primora.

**Parameters:**
- `-Version`: Specific version (default: latest)
- `-Architecture`: x64 or x86 (default: x64)

**Usage:**
```powershell
.\Install-Primora.ps1
.\Install-Primora.ps1 -Version "2.0.0"
```

**Features:**
- Downloads from GitHub releases
- Creates Desktop and Start Menu shortcuts
- Registers in Add/Remove Programs
- Creates uninstaller
- Allows immediate launch

---

#### `deploy.ps1`
Deployment automation for releases.

**Usage:**
```powershell
.\deploy.ps1 -Version "2.0.0"
```

---

## Development Workflow

### First-Time Setup
```powershell
.\Setup-Environment.ps1
# Open Primora.sln in Visual Studio
.\Build-Primora.ps1 -Configuration Debug
```

### Release Process
```powershell
.\Build-Primora.ps1 -Configuration Release
.\deploy.ps1 -Version "2.0.0"
```

---

## All Scripts (PowerShell Only)

- `Install-Primora.ps1` - User installation
- `Build-Primora.ps1` - Build application & website
- `Setup-Environment.ps1` - Environment validation
- `deploy.ps1` - Release deployment
- `test_xaml.ps1` - XAML validation

**No Python or Bash scripts - all PowerShell for consistency.**
