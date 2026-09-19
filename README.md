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

Or after deploying, use the same path on your server.


Birthday App pass - aghkrhuhytndyrxa