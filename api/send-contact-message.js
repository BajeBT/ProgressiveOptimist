import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { getContactEmail, requireDatabase } from '../lib/db.js';

const SENDER = '"Progressive Optimist Club Website" <noreply@progressiveoptimist.org>';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }
  if (!requireDatabase(res)) return;

  if (!process.env.SES_ACCESS_KEY_ID || process.env.SES_ACCESS_KEY_ID.startsWith('REPLACE_ME')) {
    return res.status(500).json({ success: false, message: 'Contact form is not configured yet.' });
  }

  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message) {
    return res.status(400).json({ success: false, message: 'Name, a valid email, and a message are required.' });
  }

  const ses = new SESClient({
    region: process.env.SES_REGION,
    credentials: {
      accessKeyId: process.env.SES_ACCESS_KEY_ID,
      secretAccessKey: process.env.SES_SECRET_ACCESS_KEY
    }
  });

  const safeSubject = (subject || 'General Inquiry').slice(0, 100);
  const emailSubject = `[Contact Form] ${safeSubject} - ${name}`;
  const textBody = `New message from the club website contact form.\n\nName: ${name}\nEmail: ${email}\nSubject: ${safeSubject}\n\nMessage:\n${message}`;

  try {
    const recipient = await getContactEmail();
    await ses.send(new SendEmailCommand({
      Source: SENDER,
      Destination: { ToAddresses: [recipient] },
      ReplyToAddresses: [email],
      Message: {
        Subject: { Data: emailSubject, Charset: 'UTF-8' },
        Body: { Text: { Data: textBody, Charset: 'UTF-8' } }
      }
    }));

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('send-contact-message error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
  }
}
