# Itorizin Birthday Hub (v2)

Local database + Email birthday card system.

## Features
- Add / update birthdays on the website
- Local JSON database (no Supabase)
- Beautiful HTML birthday card email
- Birthday person in **To**, everyone else in **CC**
- Email sent from `r.sumit@itorizin.in`

## Setup

1. Install dependencies
```bash
npm install
```

2. Create `.env.local` from the example
```bash
copy .env.example .env.local
```

3. Fill SMTP details in `.env.local` (see below)

4. Run
```bash
npm run dev
```

Open http://localhost:3000

## SMTP Configuration

You need the SMTP settings of your email provider for `r.sumit@itorizin.in`.

SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=r.sumit@itorizin.in
SMTP_PASS=your-yahoo-app-password
EMAIL_FROM=r.sumit@itorizin.in
CRON_SECRET=mybirthdaysecret2026

## Daily Birthday Job 

Call this URL every day (using Windows Task Scheduler, cron, or a free service):

```
GET http://localhost:3000/api/cron
Authorization: Bearer mybirthdaysecret2026
```

## Background Service & 15-Minute Auto-Updater

The app includes an automated system that keeps the service running independently of Antigravity/terminals and automatically fetches/applies updates from GitHub every 15 minutes.

### Register Auto-Update via Windows Task Scheduler (Run once)
```bash
npm run app:scheduler
```
* **100% Task Scheduler Driven**: No startup folder scripts required.
* **Auto-Update**: Runs every 15 minutes via Windows Task Scheduler (`BirthdayApp-AutoUpdate`). Checks `origin/main`, pulls new commits, rebuilds, and restarts the app.
* **On Reboot / Startup**: Configured with `StartWhenAvailable`, so Windows Task Scheduler automatically runs it as soon as the computer starts up/wakes up.
* **Self-Healing**: If the app is ever stopped, the scheduled task automatically detects that port 3000 is inactive and restarts it.

### Service Commands
- **Start App in background**: `npm run app:start`
- **Stop App**: `npm run app:stop`
- **Restart App**: `npm run app:restart`
- **Manual update check**: `npm run app:update`
- **Unregister background services**: `powershell -ExecutionPolicy Bypass -File ./scripts/unregister-scheduler.ps1`

### Logs
- Auto-update activity: `logs/auto-update.log`
- Application output: `logs/app.log`