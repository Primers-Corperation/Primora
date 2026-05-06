# Primora Manual Deploy Hook
# Run this script to trigger a fresh Vercel deployment without a git push

$hookUrl = $env:VERCEL_DEPLOY_HOOK

if (-not $hookUrl) {
    Write-Host "[Primora] ERROR: VERCEL_DEPLOY_HOOK environment variable not set." -ForegroundColor Red
    exit 1
}

Write-Host "[Primora] Triggering Vercel deployment..." -ForegroundColor Cyan
Invoke-RestMethod -Uri $hookUrl -Method POST
Write-Host "[Primora] Deployment triggered successfully." -ForegroundColor Green
