# scripts/start-service.ps1
$ErrorActionPreference = "Stop"
$projectDir = (Resolve-Path "$PSScriptRoot\..").Path
$logsDir = Join-Path $projectDir "logs"
$pidFile = Join-Path $projectDir ".app.pid"
$logFile = Join-Path $logsDir "app.log"
$updateLog = Join-Path $logsDir "auto-update.log"

if (-not (Test-Path $logsDir)) {
    New-Item -ItemType Directory -Path $logsDir -Force | Out-Null
}

function Write-Log($msg) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $formatted = "[$timestamp] [START-SERVICE] $msg"
    Write-Host $formatted
    Add-Content -Path $updateLog -Value $formatted
}

Write-Log "Checking if Birthday App is already running on port 3000..."

# Check if port 3000 is already in use
$existingPort = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($existingPort) {
    $procId = $existingPort.OwningProcess
    Write-Log "Birthday App is already active and listening on port 3000 (PID: $procId)."
    Set-Content -Path $pidFile -Value $procId
    exit 0
}

# Ensure production build exists before starting
$nextDir = Join-Path $projectDir ".next"
$buildIdFile = Join-Path $nextDir "BUILD_ID"
if (-not (Test-Path $buildIdFile)) {
    Write-Log "No production build found (.next/BUILD_ID missing). Running 'npm run build'..."
    Push-Location $projectDir
    try {
        & npm.cmd run build
    } finally {
        Pop-Location
    }
}

Write-Log "Launching Next.js server in background..."
$nextBin = Join-Path $projectDir "node_modules\next\dist\bin\next"

# Use cmd.exe with UseShellExecute = true to decouple standard I/O pipes from parent
$cmdArgs = "/c node `"$nextBin`" start -p 3000 >> `"$logFile`" 2>&1"
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = "cmd.exe"
$psi.Arguments = $cmdArgs
$psi.WorkingDirectory = $projectDir
$psi.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Hidden
$psi.CreateNoWindow = $true
$psi.UseShellExecute = $true

$null = [System.Diagnostics.Process]::Start($psi)

# Wait up to 15 seconds to verify port 3000 is listening
$timeout = 15
$started = $false
for ($i = 0; $i -lt $timeout; $i++) {
    Start-Sleep -Seconds 1
    $check = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($check) {
        $started = $true
        Set-Content -Path $pidFile -Value $check.OwningProcess
        Write-Log "Birthday App is confirmed up and running on http://localhost:3000 (PID: $($check.OwningProcess))."
        break
    }
}

if (-not $started) {
    Write-Log "WARNING: Birthday App process started, but port 3000 is not yet listening. Check $logFile for details."
}
