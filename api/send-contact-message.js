import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { getContactEmail, requireDatabase } from '../lib/db.js';

const SENDER = '"Progressive Optimist Club Website" <noreply@progressiveoptimist.org>';
const ALLOWED_HOSTS = /(^|\.)progressiveoptimist\.org$|\.vercel\.app$|^localhost(:\d+)?$/;
const MIN_FILL_MS = 3000;

// Bots get a success response so they cannot learn which rule caught them.
const silentlyDrop = (res, reason) => {
  console.warn('contact form submission rejected:', reason);
  return res.status(200).json({ success: true });
};

const sameOrigin = (req) => {
  const source = req.headers.origin || req.headers.referer;
  if (!source) return false;
  try {
    return ALLOWED_HOSTS.test(new URL(source).host);
  } catch {
    return false;
  }
};

const verifyTurnstile = async (token, ip) => {
  const body = new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY, response: token || '' });
  if (ip) body.set('remoteip', ip);
  const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const data = await result.json();
  return data.success === true;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }
  if (!requireDatabase(res)) return;

  if (!process.env.SES_ACCESS_KEY_ID || process.env.SES_ACCESS_KEY_ID.startsWith('REPLACE_ME')) {
    return res.status(500).json({ success: false, message: 'Contact form is not configured yet.' });
  }

  if (!sameOrigin(req)) return silentlyDrop(res, 'origin not allowed');

  const { name, email, subject, message, website, elapsedMs, turnstileToken } = req.body || {};

  if (website) return silentlyDrop(res, 'honeypot filled');
  if (!(typeof elapsedMs === 'number' && elapsedMs >= MIN_FILL_MS)) {
    return silentlyDrop(res, 'form submitted too quickly');
  }

  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message) {
    return res.status(400).json({ success: false, message: 'Name, a valid email, and a message are required.' });
  }
  if (name.length > 80 || email.length > 254 || message.length > 5000) {
    return res.status(400).json({ success: false, message: 'One of your fields is too long. Please shorten it and try again.' });
  }
  if ((message.match(/https?:\/\/|www\./gi) || []).length >= 3) {
    return silentlyDrop(res, 'too many links in message');
  }

  if (process.env.TURNSTILE_SECRET_KEY) {
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
    let passed = false;
    try {
      passed = await verifyTurnstile(turnstileToken, ip);
    } catch (err) {
      console.error('turnstile verification error:', err);
      return res.status(503).json({ success: false, message: 'Could not verify your submission. Please try again.' });
    }
    if (!passed) {
      return res.status(400).json({ success: false, message: 'Verification failed. Please reload the page and try again.' });
    }
  }

  const ses = new SESClient({
    region: process.env.SES_REGION,
    credentials: {
      accessKeyId: process.env.SES_ACCESS_KEY_ID,
      secretAccessKey: process.env.SES_SECRET_ACCESS_KEY
    }
  });

  const safeSubject = (subject || 'General Inquiry').slice(0, 100);
  const safeName = name.replace(/[\r\n]+/g, ' ').slice(0, 80);
  const emailSubject = `[Contact Form] ${safeSubject} - ${safeName}`;
  const textBody = `New message from the club website contact form.\n\nName: ${safeName}\nEmail: ${email}\nSubject: ${safeSubject}\n\nMessage:\n${message}`;

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
