import bcrypt from 'bcryptjs';
import {
  sql,
  requireDatabase,
  normalizeEmail,
  isValidEmail,
  isOfficialEmail,
  ELEVATED_ACCESS,
  canApproveMembers,
  getAnnualDuesRate
} from '../lib/db.js';
import { getSession, requireAccess } from '../lib/session.js';
import { generateRandomPassword } from '../lib/password.js';
import { getDefaultAvatarForRole } from '../lib/roles.js';

const BCRYPT_ROUNDS = 10;

// Tiers permitted to add member records at all.
const CAN_ADD = ['super admin', 'finance', 'admin'];

const FISCAL_YEAR = '2025/2026 (Oct 1 - Sep 30)';

function nextMemberId() {
  return '78008-' + Math.floor(1000 + Math.random() * 9000);
}

async function actorRecord(session) {
  const rows = await sql`
    SELECT id, name, email, is_treasurer, is_president, is_secretary
    FROM members WHERE id = ${session.memberId} LIMIT 1;
  `;
  return rows[0] || null;
}

// Signed-out callers get only what the public directory needs. Emails, phone
// numbers, addresses and dues figures stay behind a session.
async function handleList(req, res) {
  const session = getSession(req);

  if (!session) {
    const rows = await sql`
      SELECT id, name, role, avatar
      FROM members
      WHERE access NOT IN ('pending', 'pending_verification')
      ORDER BY name ASC;
    `;
    return res.status(200).json({ success: true, members: rows, partial: true });
  }

  const rows = await sql`
    SELECT
      m.id, m.name, m.email, m.role, m.phone, m.address, m.avatar, m.access,
      m.is_treasurer, m.is_president, m.is_secretary,
      m.approval_status, m.admin_granted_at, m.added_by,
      d.fiscal_year, d.dues_rate, d.amount_paid, d.balance_due,
      d.payment_method, d.dues_status, d.last_payment_date, d.notes, d.email_last_sent
    FROM members m
    LEFT JOIN dues_ledger d ON m.id = d.member_id
    ORDER BY m.name ASC;
  `;
  return res.status(200).json({ success: true, members: rows, partial: false });
}

// Shared by both the single and bulk paths so they cannot drift apart.
async function insertOneMember(entry, actor, approvalStatus, currentDuesRate) {
  const email = normalizeEmail(entry.email);
  const name = String(entry.name || '').trim();

  if (!name) return { email, status: 'skipped', reason: 'Name is required.' };
  if (!isValidEmail(email)) return { email, status: 'skipped', reason: 'Invalid email address.' };

  const access = ELEVATED_ACCESS.includes(entry.access) ? entry.access : 'member';
  // Elevated access on a personal address is time limited; the timestamp is
  // what the October 1st expiry is measured from.
  const adminGrantedAt = access !== 'member' && !isOfficialEmail(email)
    ? new Date().toISOString()
    : null;

  const role = entry.role || 'Active Member';
  const avatar = getDefaultAvatarForRole(role);

  const existing = await sql`
    SELECT id, access FROM members WHERE LOWER(TRIM(email)) = ${email} LIMIT 1;
  `;

  if (existing.length > 0) {
    const found = existing[0];
    // Someone who applied through the public form is promoted in place rather
    // than duplicated.
    if (found.access === 'pending_verification' || found.access === 'pending') {
      await sql`
        UPDATE members
        SET name = ${name},
            phone = ${entry.phone || ''},
            address = ${entry.address || ''},
            role = ${role},
            avatar = ${avatar},
            access = ${access},
            approval_status = ${approvalStatus},
            admin_granted_at = ${adminGrantedAt},
            added_by = ${actor.id}
        WHERE id = ${found.id};
      `;
      return { email, status: 'promoted', memberId: found.id, name };
    }
    return { email, status: 'skipped', reason: 'A member with this email already exists.' };
  }

  const memberId = nextMemberId();
  await sql`
    INSERT INTO members (
      id, name, email, phone, address, role, avatar, access,
      approval_status, admin_granted_at, added_by
    )
    VALUES (
      ${memberId}, ${name}, ${email}, ${entry.phone || ''}, ${entry.address || ''},
      ${role}, ${avatar}, ${access},
      ${approvalStatus}, ${adminGrantedAt}, ${actor.id}
    );
  `;
  await sql`
    INSERT INTO dues_ledger (
      member_id, fiscal_year, dues_rate, amount_paid, balance_due,
      payment_method, dues_status, notes
    )
    VALUES (
      ${memberId}, ${FISCAL_YEAR}, ${entry.duesRate || currentDuesRate},
      ${entry.amountPaid || '$0.00'}, ${entry.balanceDue || currentDuesRate},
      ${entry.paymentMethod || 'Pending'}, ${entry.duesStatus || 'Unpaid (Dues Owed)'},
      ${entry.notes || ''}
    );
  `;
  return { email, status: 'added', memberId, name };
}

async function handleAdd(req, res, session, entries) {
  const actor = await actorRecord(session);
  if (!actor) {
    return res.status(403).json({ success: false, message: 'Your member record could not be found.' });
  }

  // The Treasurer's own additions are trusted immediately; everyone else's wait
  // for an officer to approve them.
  const approvalStatus = actor.is_treasurer ? 'approved' : 'pending_approval';
  const currentDuesRate = await getAnnualDuesRate();

  const results = [];
  for (const entry of entries) {
    results.push(await insertOneMember(entry, actor, approvalStatus, currentDuesRate));
  }

  const added = results.filter(r => r.status === 'added').length;
  const promoted = results.filter(r => r.status === 'promoted').length;
  const skipped = results.filter(r => r.status === 'skipped');

  return res.status(200).json({
    success: added + promoted > 0,
    approvalStatus,
    added,
    promoted,
    skipped,
    results,
    message: approvalStatus === 'approved'
      ? `${added + promoted} member record(s) saved and active.`
      : `${added + promoted} member record(s) saved, pending approval by the President, Treasurer, or Secretary.`
  });
}

async function handleApprove(req, res, session) {
  const actor = await actorRecord(session);
  if (!canApproveMembers(actor)) {
    return res.status(403).json({
      success: false,
      message: 'Only the President, Treasurer, or Secretary can approve member records.'
    });
  }

  const memberId = req.body?.memberId;
  if (!memberId) {
    return res.status(400).json({ success: false, message: 'A member id is required.' });
  }

  const rows = await sql`
    UPDATE members
    SET approval_status = 'approved',
        access = CASE WHEN access = 'pending' THEN 'member' ELSE access END,
        role = CASE WHEN role = 'Pending' THEN 'Active Member' ELSE role END,
        avatar = CASE WHEN role = 'Pending' THEN ${getDefaultAvatarForRole('Active Member')} ELSE avatar END
    WHERE id = ${memberId}
    RETURNING id, name;
  `;
  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Member not found.' });
  }

  return res.status(200).json({ success: true, message: `${rows[0].name} approved.` });
}

// Generates a fresh password for a member and returns it once, in plaintext,
// to the super admin who requested it. Only they see it - it's never stored or
// logged anywhere except as the bcrypt hash written to the member's row.
async function handleResetPassword(req, res) {
  const memberId = req.body?.memberId;
  const customPassword = req.body?.newPassword;
  if (!memberId) {
    return res.status(400).json({ success: false, message: 'A member id is required.' });
  }
  if (customPassword !== undefined && customPassword.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
  }

  const newPassword = customPassword || generateRandomPassword();
  const hash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

  const rows = await sql`
    UPDATE members
    SET password = ${hash}, reset_token = NULL, reset_token_expires = NULL
    WHERE id = ${memberId}
    RETURNING id, name, email;
  `;
  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Member not found.' });
  }

  return res.status(200).json({
    success: true,
    password: newPassword,
    member: { name: rows[0].name, email: rows[0].email }
  });
}

async function handleUpdateRecord(req, res) {
  const { memberId, fields } = req.body || {};
  if (!memberId || !fields) {
    return res.status(400).json({ success: false, message: 'A member id and fields are required.' });
  }

  const email = normalizeEmail(fields.email);
  if (!isValidEmail(email)) {
    return res.status(400).json({ success: false, message: 'A valid email address is required.' });
  }

  const current = await sql`SELECT access, admin_granted_at FROM members WHERE id = ${memberId} LIMIT 1;`;
  if (current.length === 0) {
    return res.status(404).json({ success: false, message: 'Member not found.' });
  }

  const access = fields.access || current[0].access || 'member';
  // Starting an elevated grant on a personal address stamps the clock; keeping
  // an existing one leaves the original date, so editing a record does not
  // silently extend someone's admin rights for another year.
  let adminGrantedAt = current[0].admin_granted_at;
  if (ELEVATED_ACCESS.includes(access) && !isOfficialEmail(email)) {
    if (!adminGrantedAt) adminGrantedAt = new Date().toISOString();
  } else {
    adminGrantedAt = null;
  }

  const role = fields.role || 'Active Member';
  await sql`
    UPDATE members
    SET name = ${fields.name},
        email = ${email},
        phone = ${fields.phone || ''},
        address = ${fields.address || ''},
        role = ${role},
        avatar = ${getDefaultAvatarForRole(role)},
        access = ${access},
        admin_granted_at = ${adminGrantedAt}
    WHERE id = ${memberId};
  `;
  // amount_paid, balance_due, payment_method, and last_payment_date are
  // deliberately not written here - they're owned exclusively by the
  // update-payments action, computed from the itemized dues_payments rows,
  // so this can't overwrite them with stale form values.
  await sql`
    UPDATE dues_ledger
    SET dues_rate = ${fields.duesRate},
        dues_status = ${fields.duesStatus},
        updated_at = CURRENT_TIMESTAMP
    WHERE member_id = ${memberId};
  `;

  return res.status(200).json({ success: true });
}

async function handleUpdatePermission(req, res) {
  const { memberId, key, value } = req.body || {};
  if (!memberId || !key) {
    return res.status(400).json({ success: false, message: 'A member id and permission key are required.' });
  }

  switch (key) {
    case 'access': {
      const member = await sql`SELECT email FROM members WHERE id = ${memberId} LIMIT 1;`;
      if (member.length === 0) {
        return res.status(404).json({ success: false, message: 'Member not found.' });
      }
      const grantedAt = ELEVATED_ACCESS.includes(value) && !isOfficialEmail(member[0].email)
        ? new Date().toISOString()
        : null;
      await sql`UPDATE members SET access = ${value}, admin_granted_at = ${grantedAt} WHERE id = ${memberId};`;
      break;
    }
    case 'role':
      await sql`UPDATE members SET role = ${value} WHERE id = ${memberId};`;
      break;
    case 'hasTreasurerConsoleAccess':
      await sql`UPDATE members SET is_treasurer = ${Boolean(value)} WHERE id = ${memberId};`;
      break;
    case 'hasInitiativeAccess':
      await sql`UPDATE members SET is_president = ${Boolean(value)} WHERE id = ${memberId};`;
      break;
    default:
      return res.status(400).json({ success: false, message: 'Unknown permission key.' });
  }

  return res.status(200).json({ success: true });
}

export default async function handler(req, res) {
  if (!requireDatabase(res)) return;

  try {
    if (req.method === 'GET') {
      return await handleList(req, res);
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method not allowed.' });
    }

    const action = req.body?.action;

    switch (action) {
      case 'add': {
        const session = requireAccess(req, res, CAN_ADD);
        if (!session) return;
        return await handleAdd(req, res, session, [req.body?.member || {}]);
      }
      case 'bulk-add': {
        const session = requireAccess(req, res, CAN_ADD);
        if (!session) return;
        const entries = Array.isArray(req.body?.members) ? req.body.members : [];
        if (entries.length === 0) {
          return res.status(400).json({ success: false, message: 'No members were provided.' });
        }
        return await handleAdd(req, res, session, entries);
      }
      case 'approve': {
        const session = requireAccess(req, res, CAN_ADD);
        if (!session) return;
        return await handleApprove(req, res, session);
      }
      case 'update-record': {
        const session = requireAccess(req, res, CAN_ADD);
        if (!session) return;
        return await handleUpdateRecord(req, res);
      }
      case 'reset-password': {
        const session = requireAccess(req, res, ['super admin']);
        if (!session) return;
        return await handleResetPassword(req, res);
      }
      case 'update-permission': {
        const session = requireAccess(req, res, ['super admin', 'finance']);
        if (!session) return;
        return await handleUpdatePermission(req, res);
      }
      default:
        return res.status(400).json({ success: false, message: 'Unknown action.' });
    }
  } catch (err) {
    console.error(`members (${req.method} ${req.body?.action || 'list'}) error:`, err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
}
