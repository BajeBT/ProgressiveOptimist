import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const SENDER = '"Progressive Optimist Club of Barbados" <noreply@progressiveoptimist.org>';

// Outside production every message goes to the admin test address instead of
// the real member, so test cycles never reach club members.
const DEV_EMAIL_TARGET = 'dev@bajanthings.biz';

export function isEmailConfigured() {
  return Boolean(process.env.SES_ACCESS_KEY_ID) &&
    !process.env.SES_ACCESS_KEY_ID.startsWith('REPLACE_ME');
}

export async function sendEmail({ to, subject, body }) {
  if (!isEmailConfigured()) {
    console.warn('[email] SES not configured; would have sent to', to, '-', subject);
    return { success: false, message: 'Email is not configured.' };
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const recipient = isProduction ? to : DEV_EMAIL_TARGET;
  const finalBody = isProduction
    ? body
    : `[NON-PRODUCTION - original recipient: ${to}]\n\n${body}`;

  const ses = new SESClient({
    region: process.env.SES_REGION,
    credentials: {
      accessKeyId: process.env.SES_ACCESS_KEY_ID,
      secretAccessKey: process.env.SES_SECRET_ACCESS_KEY
    }
  });

  try {
    await ses.send(new SendEmailCommand({
      Source: SENDER,
      Destination: { ToAddresses: [recipient] },
      Message: {
        Subject: { Data: subject, Charset: 'UTF-8' },
        Body: { Text: { Data: finalBody, Charset: 'UTF-8' } }
      }
    }));
    return { success: true };
  } catch (err) {
    console.error('sendEmail error:', err);
    return { success: false, message: 'Failed to send email.' };
  }
}
