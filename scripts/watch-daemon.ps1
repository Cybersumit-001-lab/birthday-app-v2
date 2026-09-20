# scripts/watch-daemon.ps1
# Runs a continuous loop checking for updates every 15 minutes (900 seconds)
$scriptsDir = $PSScriptRoot

Write-Host "=========================================================="
Write-Host " Birthday App - 15 Minute Auto-Update & Process Monitor"
Write-Host "=========================================================="
Write-Host "Press Ctrl+C at any time to stop this monitor."
Write-Host ""

# Ensure service is started initially
& "$scriptsDir\start-service.ps1"

while ($true) {
    Write-Host "`n[$(Get-Date -Format 'HH:mm:ss')] Checking for updates..."
    & "$scriptsDir\check-and-update.ps1"

    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Sleeping for 15 minutes (900s)..."
    Start-Sleep -Seconds 900
}
