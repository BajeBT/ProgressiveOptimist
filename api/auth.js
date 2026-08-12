import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import {
  sql,
  requireDatabase,
  normalizeEmail,
  isValidEmail,
  resolveEffectiveAccess
} from '../lib/db.js';
import { sendEmail } from '../lib/email.js';
import { createSession, getSession } from '../lib/session.js';
import { getDefaultAvatarForRole } from '../lib/roles.js';

const BCRYPT_ROUNDS = 10;
const TOKEN_TTL_MINUTES = 60;

// Returned to the client instead of the raw member row - never includes the
// password hash or the reset token.
function toSessionUser(member, effectiveAccess) {
  return {
    email: normalizeEmail(member.email),
    name: member.name,
    role: member.role,
    memberId: member.id,
    avatar: member.avatar || '/avatars/active_member_icon.jpg',
    access: effectiveAccess,
    storedAccess: member.access || 'member',
    isTreasurer: Boolean(member.is_treasurer),
    duesStatus: member.dues_status || 'Active Member (2025/2026)'
  };
}

async function findMember(email) {
  const rows = await sql`
    SELECT
      m.id, m.name, m.email, m.role, m.avatar, m.access, m.password,
      m.is_treasurer, m.is_president, m.is_secretary,
      m.approval_status, m.admin_granted_at,
      m.reset_token, m.reset_token_expires,
      d.dues_status
    FROM members m
    LEFT JOIN dues_ledger d ON m.id = d.member_id
    WHERE LOWER(TRIM(m.email)) = ${email}
    LIMIT 1;
  `;
  return rows[0] || null;
}

// Emails a single-use link. The same flow serves both a new applicant verifying
// their address and an existing member who has never set a password.
async function issuePasswordSetupToken(member, origin) {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = await bcrypt.hash(token, BCRYPT_ROUNDS);
  const expires = new Date(Date.now() + TOKEN_TTL_MINUTES * 60 * 1000);

  await sql`
    UPDATE members
    SET reset_token = ${tokenHash}, reset_token_expires = ${expires.toISOString()}
    WHERE id = ${member.id};
  `;

  const link = `${origin}/membership?action=set-password&email=${encodeURIComponent(member.email)}&token=${token}`;
  await sendEmail({
    to: member.email,
    subject: 'Set your Progressive Optimist portal password',
    body: `Dear ${member.name},\n\nUse the link below to set your member portal password. It expires in ${TOKEN_TTL_MINUTES} minutes and can only be used once.\n\n${link}\n\nIf you did not request this, you can ignore this email - your account is unchanged.\n\nProgressive Optimist Club of Barbados`
  });
}

async function handleLogin(req, res) {
  const email = normalizeEmail(req.body?.email);
  const password = req.body?.password || '';

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
  }

  const member = await findMember(email);

  // The membership database is the only source of portal accounts. An address
  // that is not on it cannot log in, and no account is created for it.
  if (!member) {
    return res.status(401).json({
      success: false,
      message: 'This email address is not on the club membership records. Please contact the Club Treasurer or Secretary to be added.'
    });
  }

  if (member.access === 'pending_verification') {
    return res.status(403).json({
      success: false,
      message: 'Please check your email and verify your address to set your password before logging in.'
    });
  }

  if (member.access === 'pending' || member.approval_status === 'pending_approval') {
    return res.status(403).json({
      success: false,
      message: 'Your membership record is awaiting approval by the President, Treasurer, or Secretary.'
    });
  }

  // Members carried over from before passwords were enforced have none stored.
  // They are sent through the emailed set-password flow rather than being let
  // in on any password, which is what the previous code did.
  if (!member.password) {
    const origin = req.headers.origin || `https://${req.headers.host}`;
    await issuePasswordSetupToken(member, origin);
    return res.status(403).json({
      success: false,
      needsPasswordSetup: true,
      message: 'Your account does not have a password yet. We have emailed you a link to set one.'
    });
  }

  const matches = await bcrypt.compare(password, member.password);
  if (!matches) {
    return res.status(401).json({ success: false, message: 'Invalid password. Please check your credentials.' });
  }

  const { access, expired } = resolveEffectiveAccess(member);

  // An expired grant is written back so the downgrade is permanent rather than
  // recomputed on every login.
  if (expired && member.access !== 'member') {
    await sql`
      UPDATE members
      SET access = 'member', admin_granted_at = NULL
      WHERE id = ${member.id};
    `;
  }

  const user = toSessionUser(member, access);
  const token = createSession({ memberId: member.id, email: user.email, access });

  return res.status(200).json({ success: true, user, token });
}

async function handleRequestPasswordSetup(req, res) {
  const email = normalizeEmail(req.body?.email);
  if (!isValidEmail(email)) {
    return res.status(400).json({ success: false, message: 'A valid email address is required.' });
  }

  const member = await findMember(email);
  if (member) {
    const origin = req.headers.origin || `https://${req.headers.host}`;
    await issuePasswordSetupToken(member, origin);
  }

  // Deliberately identical whether or not the address exists, so this cannot be
  // used to discover which emails are club members.
  return res.status(200).json({
    success: true,
    message: 'If that address is on our membership records, a password setup link has been emailed to it.'
  });
}

async function handleSetPassword(req, res) {
  const email = normalizeEmail(req.body?.email);
  const token = req.body?.token || '';
  const password = req.body?.password || '';

  if (!email || !token) {
    return res.status(400).json({ success: false, message: 'This password link is invalid or incomplete.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
  }

  const member = await findMember(email);
  if (!member || !member.reset_token || !member.reset_token_expires) {
    return res.status(400).json({ success: false, message: 'This password link is invalid or has already been used.' });
  }

  if (new Date(member.reset_token_expires) < new Date()) {
    return res.status(400).json({ success: false, message: 'This password link has expired. Please request a new one.' });
  }

  const tokenValid = await bcrypt.compare(token, member.reset_token);
  if (!tokenValid) {
    return res.status(400).json({ success: false, message: 'This password link is invalid or has already been used.' });
  }

  const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  // A verified applicant moves from pending_verification to pending, where the
  // officers' approval gate picks them up.
  const nextAccess = member.access === 'pending_verification' ? 'pending' : member.access;

  await sql`
    UPDATE members
    SET password = ${hash},
        access = ${nextAccess},
        reset_token = NULL,
        reset_token_expires = NULL
    WHERE id = ${member.id};
  `;

  if (member.access === 'pending_verification') {
    await sql`
      UPDATE dues_ledger
      SET dues_status = 'Pending Approval'
      WHERE member_id = ${member.id};
    `;
  }

  return res.status(200).json({
    success: true,
    message: nextAccess === 'pending'
      ? 'Password set. Your application is now awaiting approval by the President, Treasurer, or Secretary.'
      : 'Password set successfully. You can now log in.'
  });
}

// Self-service: a signed-in member changing their own password. Distinct from
// api/members.js's reset-password, which is a super admin acting on someone
// else's account and doesn't need the current password.
async function handleChangePassword(req, res) {
  const session = getSession(req);
  if (!session) {
    return res.status(401).json({ success: false, message: 'You must be signed in to change your password.' });
  }

  const currentPassword = req.body?.currentPassword || '';
  const newPassword = req.body?.newPassword || '';
  if (newPassword.length < 8) {
    return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
  }

  const member = await findMember(session.email);
  if (!member) {
    return res.status(404).json({ success: false, message: 'Account not found.' });
  }
  if (!member.password) {
    return res.status(400).json({
      success: false,
      message: 'Your account has no password set yet. Use the link emailed to you to set one first.'
    });
  }

  const matches = await bcrypt.compare(currentPassword, member.password);
  if (!matches) {
    return res.status(401).json({ success: false, message: 'Your current password is incorrect.' });
  }

  const hash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  await sql`UPDATE members SET password = ${hash} WHERE id = ${member.id};`;

  return res.status(200).json({ success: true, message: 'Password changed successfully.' });
}

async function handleRegister(req, res) {
  const form = req.body?.form || {};
  const email = normalizeEmail(form.email);

  if (!form.firstName || !form.lastName || !isValidEmail(email)) {
    return res.status(400).json({ success: false, message: 'First name, last name, and a valid email are required.' });
  }
  if (!form.hearAboutUs) {
    return res.status(400).json({ success: false, message: 'Please tell us how you heard about us.' });
  }

  const existing = await findMember(email);
  if (existing) {
    return res.status(409).json({
      success: false,
      message: 'An application or membership record already exists for this email address.'
    });
  }

  const memberId = '78008-' + Math.floor(1000 + Math.random() * 9000);
  const name = `${form.firstName} ${form.lastName}`.trim();
  const addressString = [form.addressLine1, form.addressLine2, form.village, form.parish, form.country || 'Barbados']
    .filter(Boolean)
    .join(', ');
  const notesString = `DOB: ${form.dob || 'N/A'} | Gender: ${form.gender || 'N/A'} | Occupation: ${form.occupation || 'N/A'} | Employer: ${form.employer || 'N/A'} | Hear About Us: ${form.hearAboutUs || 'N/A'}${form.referrerName ? ` (Referrer: ${form.referrerName})` : ''} | Comments: ${form.comments || 'None'}`;

  await sql`
    INSERT INTO members (id, name, email, phone, role, avatar, address, access, approval_status)
    VALUES (
      ${memberId}, ${name}, ${email}, ${form.phone || ''}, 'Pending',
      ${getDefaultAvatarForRole('Pending')}, ${addressString}, 'pending_verification', 'pending_approval'
    );
  `;
  await sql`
    INSERT INTO dues_ledger (member_id, fiscal_year, dues_rate, amount_paid, balance_due, payment_method, dues_status, notes)
    VALUES (${memberId}, '2025/2026 (Oct 1 - Sep 30)', '$250.00', '$0.00', '$250.00', 'Pending', 'Pending Verification', ${notesString});
  `;

  const origin = req.headers.origin || `https://${req.headers.host}`;
  await issuePasswordSetupToken({ id: memberId, name, email }, origin);

  return res.status(200).json({
    success: true,
    message: 'Application received. Check your email for a link to verify your address and set a password.'
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }
  if (!requireDatabase(res)) return;

  const action = req.body?.action;

  try {
    switch (action) {
      case 'login':
        return await handleLogin(req, res);
      case 'request-password-setup':
        return await handleRequestPasswordSetup(req, res);
      case 'set-password':
        return await handleSetPassword(req, res);
      case 'change-password':
        return await handleChangePassword(req, res);
      case 'register':
        return await handleRegister(req, res);
      default:
        return res.status(400).json({ success: false, message: 'Unknown action.' });
    }
  } catch (err) {
    console.error(`auth (${action}) error:`, err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
}
