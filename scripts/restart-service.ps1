# scripts/restart-service.ps1
$scriptsDir = $PSScriptRoot

Write-Host "Restarting Birthday App..."
& "$scriptsDir\stop-service.ps1"
Start-Sleep -Seconds 2
& "$scriptsDir\start-service.ps1"
