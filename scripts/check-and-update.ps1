# scripts/check-and-update.ps1
$projectDir = (Resolve-Path "$PSScriptRoot\..").Path
$logsDir = Join-Path $projectDir "logs"
$updateLog = Join-Path $logsDir "auto-update.log"

if (-not (Test-Path $logsDir)) {
    New-Item -ItemType Directory -Path $logsDir -Force | Out-Null
}

function Write-Log($msg) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $formatted = "[$timestamp] [AUTO-UPDATE] $msg"
    Write-Host $formatted
    Add-Content -Path $updateLog -Value $formatted
}

Push-Location $projectDir
try {
    Write-Log "Checking for updates on origin/main..."

    # Fetch updates from origin quietly
    $fetchOutput = & git fetch origin main 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Log "Git fetch failed: $fetchOutput"
        exit 1
    }

    $localCommit = (& git rev-parse HEAD).Trim()
    $remoteCommit = (& git rev-parse origin/main).Trim()

    if ($localCommit -eq $remoteCommit) {
        Write-Log "No updates found. App is already up-to-date at commit $localCommit."

        # Self-healing: Ensure app is running
        $isListening = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
        if (-not $isListening) {
            Write-Log "Birthday App is not active on port 3000. Launching service..."
            $hasPm2 = Get-Command "pm2" -ErrorAction SilentlyContinue
            if ($hasPm2) {
                & pm2.cmd start "$projectDir\ecosystem.config.js"
            }
            # Fallback if PM2 did not bring port 3000 up
            $stillNotListening = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
            if (-not $stillNotListening) {
                & "$PSScriptRoot\start-service.ps1"
            }
        }
        exit 0
    }

    Write-Log "New update detected! Current commit: $localCommit -> Remote commit: $remoteCommit."

    # Pull changes
    $pullOutput = & git pull origin main 2>&1
    Write-Log "Git pull output: $pullOutput"
    if ($LASTEXITCODE -ne 0) {
        Write-Log "ERROR: Git pull failed. Aborting update."
        exit 1
    }

    # Check if dependencies changed
    $changedFiles = & git diff --name-only $localCommit $remoteCommit 2>&1
    if ($changedFiles -match "package.json" -or $changedFiles -match "package-lock.json") {
        Write-Log "Dependency changes detected in package.json/package-lock.json. Running npm install..."
        $installOutput = & npm.cmd install 2>&1
        Write-Log "npm install finished."
    }

    # Build production assets
    Write-Log "Building Next.js application..."
    $buildOutput = & npm.cmd run build 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Log "ERROR: Build failed! Output: $buildOutput"
        exit 1
    }
    Write-Log "Build completed successfully."

    # Restart the application
    Write-Log "Restarting Birthday App service..."
    $hasPm2 = Get-Command "pm2" -ErrorAction SilentlyContinue
    $pm2App = if ($hasPm2) { (& pm2.cmd describe birthday-app 2>&1) } else { $null }
    if ($hasPm2 -and ($LASTEXITCODE -eq 0) -and ($pm2App -match "online|launching")) {
        Write-Log "Active PM2 instance detected. Restarting via PM2..."
        & pm2.cmd restart birthday-app
    } else {
        & "$PSScriptRoot\restart-service.ps1"
    }

    Write-Log "Successfully updated and restarted Birthday App to commit $remoteCommit."
} catch {
    Write-Log "Unexpected exception occurred: $_"
} finally {
    Pop-Location
}
