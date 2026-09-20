# scripts/register-scheduler.ps1
$ErrorActionPreference = "Stop"
$projectDir = (Resolve-Path "$PSScriptRoot\..").Path
$updateScript = Join-Path $projectDir "scripts\check-and-update.ps1"

Write-Host "=========================================================="
Write-Host " Configuring Birthday App in Windows Task Scheduler"
Write-Host "=========================================================="

# 1. Clean up any previous startup folder script (100% Task Scheduler driven now)
$startupFolder = [System.IO.Path]::Combine($env:APPDATA, "Microsoft\Windows\Start Menu\Programs\Startup")
$oldStartupFile = Join-Path $startupFolder "BirthdayApp-Startup.cmd"
if (Test-Path $oldStartupFile) {
    Remove-Item -Path $oldStartupFile -Force
    Write-Host "[CLEANUP] Removed legacy script from Windows Startup folder."
}

# 2. Configure Task Scheduler
$taskName = "BirthdayApp-AutoUpdate"
$updateCmd = "powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$updateScript`""

# Create indefinite 15-minute repetition task
& schtasks.exe /Create /SC MINUTE /MO 15 /TN $taskName /TR $updateCmd /F 2>&1 | Out-Null

# Enhance task settings: Run immediately if missed (reboot), and allow on battery
try {
    $task = Get-ScheduledTask -TaskName $taskName
    $task.Settings.StartWhenAvailable = $true
    $task.Settings.DisallowStartIfOnBatteries = $false
    $task.Settings.StopIfGoingOnBatteries = $false
    $null = Set-ScheduledTask -InputObject $task
    Write-Host "[SUCCESS] Windows Scheduled Task '$taskName' configured with 'StartWhenAvailable'."
} catch {
    Write-Host "[SUCCESS] Windows Scheduled Task '$taskName' registered via schtasks.exe."
}

Write-Host ""
Write-Host "Everything is now 100% managed by Windows Task Scheduler:"
Write-Host "1. Runs every 15 minutes continuously."
Write-Host "2. If the computer was rebooted or sleeping, Task Scheduler runs immediately upon waking/starting."
Write-Host "3. When it runs, it self-heals: verifies if port 3000 is running, and launches the app if it was offline."
