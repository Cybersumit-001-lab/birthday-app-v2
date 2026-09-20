# scripts/unregister-scheduler.ps1
Write-Host "Removing Birthday App from Windows Task Scheduler..."

# 1. Delete scheduled task
try {
    Unregister-ScheduledTask -TaskName "BirthdayApp-AutoUpdate" -Confirm:$false -ErrorAction SilentlyContinue
} catch {}
& schtasks.exe /Delete /TN "BirthdayApp-AutoUpdate" /F 2>&1 | Out-Null
Write-Host "[SUCCESS] Removed Windows Scheduled Task 'BirthdayApp-AutoUpdate'."

# 2. Ensure startup folder is clean
$startupFolder = [System.IO.Path]::Combine($env:APPDATA, "Microsoft\Windows\Start Menu\Programs\Startup")
$startupCmdFile = Join-Path $startupFolder "BirthdayApp-Startup.cmd"
if (Test-Path $startupCmdFile) {
    Remove-Item -Path $startupCmdFile -Force
    Write-Host "[SUCCESS] Removed legacy script from Windows Startup folder."
}

Write-Host ""
Write-Host "All background tasks removed."
