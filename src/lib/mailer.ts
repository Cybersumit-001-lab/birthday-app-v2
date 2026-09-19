import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import type { Employee } from "./db";

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true", // true for 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Template 1: Direct birthday card sent ONLY to the birthday person (Zero CC)
 */
export function birthdayHonoreeCardHtml(name: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Happy Birthday, ${name}!</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    body {
      margin: 0;
      padding: 0;
      background-color: #04060a;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #f8fafc;
      -webkit-font-smoothing: antialiased;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #04060a; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #04060a; background-image: radial-gradient(circle at top center, #1e1124 0%, #04060a 70%); padding: 30px 15px;">
    <tr>
      <td align="center">
        
        <!-- Main Card Container -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #0d121f; border-radius: 28px; overflow: hidden; box-shadow: 0 25px 60px -15px rgba(225, 29, 72, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1); border-collapse: separate;">
          
          <!-- Top Accent Glow Line -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #e11d48, #fb7185, #f59e0b, #e11d48); font-size: 1px; line-height: 1px;">&nbsp;</td>
          </tr>

          <!-- Brand Header -->
          <tr>
            <td style="padding: 24px 32px 16px 32px; text-align: center; background-color: #0a0e17;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; padding: 6px 16px; border-radius: 9999px; background: rgba(225, 29, 72, 0.12); border: 1px solid rgba(225, 29, 72, 0.3);">
                      <span style="font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #fb7185;">
                        ✦ ITORIGIN CELEBRATIONS ✦
                      </span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Artwork Card -->
          <tr>
            <td align="center" style="padding: 0 24px;">
              <div style="border-radius: 20px; overflow: hidden; box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5); border: 1px solid rgba(255, 255, 255, 0.08); background-color: #111726;">
                <img 
                  src="cid:birthdayCardArt" 
                  alt="Happy Birthday ${name}" 
                  width="512" 
                  style="width: 100%; max-width: 512px; height: auto; display: block; border: 0;"
                />
              </div>
            </td>
          </tr>

          <!-- Greeting Body Section -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; text-align: center;">
              
              <!-- Main Headline -->
              <h1 style="margin: 0 0 12px 0; font-size: 32px; font-weight: 800; line-height: 1.2; letter-spacing: -0.5px; color: #ffffff;">
                Happy Birthday, <span style="background: linear-gradient(135deg, #ffffff 0%, #fb7185 100%); -webkit-background-clip: text; color: #fb7185;">${name}</span>! 🎉
              </h1>

              <!-- Subtitle Message -->
              <p style="margin: 0 0 20px 0; font-size: 17px; font-weight: 600; line-height: 1.5; color: #fecdd3; font-style: italic;">
                &ldquo;Wishing you a wonderful birthday filled with happiness, success, and memorable moments.&rdquo;
              </p>

              <!-- Divider -->
              <table width="80" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 20px auto;">
                <tr>
                  <td height="2" style="background: linear-gradient(90deg, transparent, #e11d48, transparent); font-size: 1px; line-height: 1px;">&nbsp;</td>
                </tr>
              </table>

              <!-- Body Note -->
              <p style="margin: 0 0 24px 0; font-size: 14px; font-weight: 400; line-height: 1.7; color: #94a3b8; max-width: 440px; margin-left: auto; margin-right: auto;">
                May this special milestone bring you boundless joy, renewed inspiration, and remarkable achievements in everything you do. We are proud and grateful to have you as part of our team!
              </p>

              <!-- Milestone Pill Highlights -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 24px auto;">
                <tr>
                  <td style="padding: 0 4px;">
                    <div style="padding: 6px 14px; border-radius: 12px; background-color: rgba(225, 29, 72, 0.15); border: 1px solid rgba(225, 29, 72, 0.3); font-size: 12px; font-weight: 700; color: #fda4af;">
                      🎂 Today&apos;s Milestone
                    </div>
                  </td>
                  <td style="padding: 0 4px;">
                    <div style="padding: 6px 14px; border-radius: 12px; background-color: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); font-size: 12px; font-weight: 700; color: #fcd34d;">
                      🌟 Honored Colleague
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Team Signature Box -->
              <div style="padding: 16px 20px; border-radius: 16px; background-color: #121827; border: 1px solid rgba(255, 255, 255, 0.06); display: inline-block;">
                <p style="margin: 0; font-size: 13px; color: #cbd5e1; font-weight: 500;">
                  With warmest wishes &amp; appreciation,<br/>
                  <strong style="color: #ffffff; font-size: 14px; letter-spacing: 0.5px;">Your Team at ITOrigin</strong> <span style="color: #e11d48;">❤️</span>
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer Bar -->
          <tr>
            <td style="background-color: #080c14; padding: 20px 32px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.06);">
              <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 600; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase;">
                ITOrigin Birthday Hub • Employee Milestone Recognition
              </p>
              <p style="margin: 0; font-size: 11px; color: #475569;">
                Delivering personalized celebrations across our global team.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
}

/**
 * Template 2: Announcement card sent to ALL COLLEAGUES celebrating their team member's birthday
 */
export function colleagueBirthdayAnnouncementHtml(honoreeName: string, honoreeEmail: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Today is ${honoreeName}'s Birthday!</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    body {
      margin: 0;
      padding: 0;
      background-color: #04060a;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #f8fafc;
      -webkit-font-smoothing: antialiased;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #04060a; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #04060a; background-image: radial-gradient(circle at top center, #1e1124 0%, #04060a 70%); padding: 30px 15px;">
    <tr>
      <td align="center">
        
        <!-- Main Card Container -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #0d121f; border-radius: 28px; overflow: hidden; box-shadow: 0 25px 60px -15px rgba(225, 29, 72, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1); border-collapse: separate;">
          
          <!-- Top Accent Glow Line -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #e11d48, #fb7185, #f59e0b, #e11d48); font-size: 1px; line-height: 1px;">&nbsp;</td>
          </tr>

          <!-- Brand Header -->
          <tr>
            <td style="padding: 24px 32px 16px 32px; text-align: center; background-color: #0a0e17;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; padding: 6px 16px; border-radius: 9999px; background: rgba(225, 29, 72, 0.12); border: 1px solid rgba(225, 29, 72, 0.3);">
                      <span style="font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #fb7185;">
                        ✦ TEAM BIRTHDAY ANNOUNCEMENT ✦
                      </span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Artwork Card -->
          <tr>
            <td align="center" style="padding: 0 24px;">
              <div style="border-radius: 20px; overflow: hidden; box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5); border: 1px solid rgba(255, 255, 255, 0.08); background-color: #111726;">
                <img 
                  src="cid:birthdayCardArt" 
                  alt="Today is ${honoreeName}'s Birthday!" 
                  width="512" 
                  style="width: 100%; max-width: 512px; height: auto; display: block; border: 0;"
                />
              </div>
            </td>
          </tr>

          <!-- Announcement Body Section -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; text-align: center;">
              
              <!-- Main Headline -->
              <h1 style="margin: 0 0 12px 0; font-size: 30px; font-weight: 800; line-height: 1.2; letter-spacing: -0.5px; color: #ffffff;">
                Today is <span style="background: linear-gradient(135deg, #ffffff 0%, #fb7185 100%); -webkit-background-clip: text; color: #fb7185;">${honoreeName}&apos;s</span> Birthday! 🎂
              </h1>

              <!-- Subtitle Message for Colleagues -->
              <p style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; line-height: 1.5; color: #fecdd3; font-style: italic;">
                &ldquo;Join us in wishing our wonderful colleague ${honoreeName} a very Happy Birthday filled with happiness, success, and memorable moments!&rdquo;
              </p>

              <!-- Divider -->
              <table width="80" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 20px auto;">
                <tr>
                  <td height="2" style="background: linear-gradient(90deg, transparent, #e11d48, transparent); font-size: 1px; line-height: 1px;">&nbsp;</td>
                </tr>
              </table>

              <!-- Body Note -->
              <p style="margin: 0 0 24px 0; font-size: 14px; font-weight: 400; line-height: 1.7; color: #94a3b8; max-width: 440px; margin-left: auto; margin-right: auto;">
                Let&apos;s make today extra special for <strong>${honoreeName}</strong>! Please take a moment to send your warm wishes, congratulations, and celebratory cheer.
              </p>

              <!-- Call-to-action Send Wishes Button -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 24px auto;">
                <tr>
                  <td align="center">
                    <a 
                      href="mailto:${honoreeEmail}?subject=Happy%20Birthday%2C%20${encodeURIComponent(honoreeName)}!%20🎉"
                      style="display: inline-block; padding: 14px 28px; border-radius: 14px; background: linear-gradient(135deg, #e11d48, #f43f5e); color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; box-shadow: 0 10px 25px -5px rgba(225, 29, 72, 0.4); letter-spacing: 0.3px;"
                    >
                      ✉️ Send Birthday Wishes to ${honoreeName}
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Honoree Details Box -->
              <div style="padding: 14px 20px; border-radius: 16px; background-color: #121827; border: 1px solid rgba(255, 255, 255, 0.06); display: inline-block;">
                <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                  Honoree Email: <a href="mailto:${honoreeEmail}" style="color: #fb7185; text-decoration: none; font-weight: 600;">${honoreeEmail}</a>
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer Bar -->
          <tr>
            <td style="background-color: #080c14; padding: 20px 32px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.06);">
              <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 600; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase;">
                ITOrigin Birthday Hub • Team Celebration Engine
              </p>
              <p style="margin: 0; font-size: 11px; color: #475569;">
                Delivering personalized milestone celebrations across our global team.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
}

/**
 * Sends both the personalized birthday card to the honoree (with NO CC)
 * and the celebration announcement to all other colleagues.
 */
export async function sendBirthdayEmail(
  birthdayPerson: Employee,
  allEmployees: Employee[]
) {
  const transporter = createTransport();
  const fromAddress = process.env.EMAIL_FROM || "connect@itorigin.com";

  // List of other colleagues
  const colleagueEmails = allEmployees
    .filter((e) => e.email.toLowerCase() !== birthdayPerson.email.toLowerCase())
    .map((e) => e.email);

  // Attach the 4:5 birthday artwork as an inline CID image
  const cardArtPath = path.join(process.cwd(), "public", "birthday-card-art.jpg");
  const attachments = [];

  if (fs.existsSync(cardArtPath)) {
    attachments.push({
      filename: "birthday-card-art.jpg",
      path: cardArtPath,
      cid: "birthdayCardArt",
    });
  }

  // ── 1. Send TO Birthday Person ONLY (Zero CC) ─────────────────────────────
  const honoreeMailInfo = await transporter.sendMail({
    from: `"ITOrigin Celebrations" <${fromAddress}>`,
    to: birthdayPerson.email,
    cc: undefined, // NO CC
    subject: `🎉 Happy Birthday, ${birthdayPerson.name}! — With Warm Wishes from ITOrigin`,
    html: birthdayHonoreeCardHtml(birthdayPerson.name),
    attachments,
  });

  console.log(`[Mailer] 🎂 Sent direct card to ${birthdayPerson.name} (${birthdayPerson.email}) with ZERO CC.`);

  // ── 2. Send Birthday Announcement TO Colleagues ────────────────────────────
  let colleagueMailInfo = null;
  if (colleagueEmails.length > 0) {
    try {
      colleagueMailInfo = await transporter.sendMail({
        from: `"ITOrigin Celebrations" <${fromAddress}>`,
        to: `"ITOrigin Team" <${fromAddress}>`,
        bcc: colleagueEmails, // BCC ensures privacy so everyone gets it cleanly
        subject: `🎂 Today is ${birthdayPerson.name}'s Birthday! — Let's Celebrate Together 🎉`,
        html: colleagueBirthdayAnnouncementHtml(birthdayPerson.name, birthdayPerson.email),
        attachments,
      });

      console.log(`[Mailer] 👥 Sent birthday announcement to ${colleagueEmails.length} colleague(s) via BCC.`);
    } catch (err: any) {
      console.error("[Mailer] ⚠️ Failed sending announcement to colleagues:", err?.message);
    }
  }

  return {
    messageId: honoreeMailInfo.messageId,
    to: birthdayPerson.email,
    colleagueCount: colleagueEmails.length,
    ccCount: colleagueEmails.length,
    colleagueMessageId: colleagueMailInfo?.messageId,
  };
}
