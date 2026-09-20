# scripts/stop-service.ps1
$projectDir = (Resolve-Path "$PSScriptRoot\..").Path
$logsDir = Join-Path $projectDir "logs"
$pidFile = Join-Path $projectDir ".app.pid"

function Write-Log($msg) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $formatted = "[$timestamp] [STOP-SERVICE] $msg"
    Write-Host $formatted
    if (Test-Path $logsDir) {
        Add-Content -Path (Join-Path $logsDir "auto-update.log") -Value $formatted
    }
}

Write-Log "Stopping Birthday App..."

# 1. Stop by recorded PID if present
if (Test-Path $pidFile) {
    $recordedPid = Get-Content $pidFile -ErrorAction SilentlyContinue
    if ($recordedPid) {
        try {
            $p = Get-Process -Id $recordedPid -ErrorAction SilentlyContinue
            if ($p) {
                # Stop process and its children
                Stop-Process -Id $recordedPid -Force -ErrorAction SilentlyContinue
                Write-Log "Killed process with PID $recordedPid from .app.pid."
            }
        } catch {
            Write-Log ("Could not kill PID " + $recordedPid + ": " + $_)
        }
    }
    Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
}

# 2. Check and stop any process still listening on port 3000
$ports = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if ($ports) {
    foreach ($conn in $ports) {
        $portPid = $conn.OwningProcess
        if ($portPid -and $portPid -ne 0) {
            try {
                Stop-Process -Id $portPid -Force -ErrorAction SilentlyContinue
                Write-Log "Terminated process on port 3000 (PID $portPid)."
            } catch {
                Write-Log ("Failed to terminate PID " + $portPid + ": " + $_)
            }
        }
    }
} else {
    Write-Log "Port 3000 is now free."
}

Write-Log "Birthday App stopped."
