import bcrypt from 'bcryptjs';
import {
  sql,
  requireDatabase,
  normalizeEmail,
  isValidEmail,
  isOfficialEmail,
  ELEVATED_ACCESS,
  canApproveMembers,
  getAnnualDuesRate,
  ensureApplicantTables
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
        AND member_status != 'inactive'
      ORDER BY name ASC;
    `;
    return res.status(200).json({ success: true, members: rows, partial: true });
  }

  const rows = await sql`
    SELECT
      m.id, m.name, m.email, m.role, m.phone, m.hide_phone, m.address, m.avatar, m.access,
      m.is_treasurer, m.is_president, m.is_secretary, m.member_status,
      m.approval_status, m.approved_by, m.approved_at, m.admin_granted_at, m.added_by,
      d.fiscal_year, d.dues_rate, d.amount_paid, d.balance_due,
      d.payment_method, d.dues_status, d.last_payment_date, d.notes, d.email_last_sent,
      n.requested_name AS pending_name_change
    FROM members m
    LEFT JOIN dues_ledger d ON m.id = d.member_id
    LEFT JOIN name_change_requests n
      ON n.member_id = m.id AND n.status = 'pending'
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

  const approverName = actor?.name || session.email || 'Admin';

  const rows = await sql`
    UPDATE members
    SET approval_status = 'approved',
        approved_by = ${approverName},
        approved_at = CURRENT_TIMESTAMP,
        access = CASE WHEN access IN ('pending_verification', 'pending') THEN 'pending' ELSE access END,
        role = CASE WHEN role = 'Pending' THEN 'Active Member' ELSE role END,
        avatar = CASE WHEN role = 'Pending' THEN ${getDefaultAvatarForRole('Active Member')} ELSE avatar END
    WHERE id = ${memberId}
    RETURNING id, name;
  `;
  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Member not found.' });
  }

  // Update dues_ledger status to reflect approval in Treasurer Dues Console
  await sql`
    UPDATE dues_ledger
    SET dues_status = 'Pending Dues Payment'
    WHERE member_id = ${memberId};
  `;

  return res.status(200).json({ success: true, message: `${rows[0].name} approved.` });
}

async function handleArchive(req, res, session) {
  const memberId = req.body?.memberId;
  if (!memberId) {
    return res.status(400).json({ success: false, message: 'A member id is required.' });
  }
  const actor = await actorRecord(session);
  const archiverName = actor?.name || session.email || 'Admin';

  const memberRows = await sql`SELECT * FROM members WHERE id = ${memberId} LIMIT 1;`;
  if (memberRows.length === 0) {
    return res.status(404).json({ success: false, message: 'Applicant not found.' });
  }
  const m = memberRows[0];
  const ledgerRows = await sql`SELECT notes FROM dues_ledger WHERE member_id = ${memberId} LIMIT 1;`;
  const notes = ledgerRows[0]?.notes || '';

  await sql`
    INSERT INTO applicant_archive (member_id, name, email, phone, address, notes, archived_by, archived_at)
    VALUES (${m.id}, ${m.name}, ${m.email}, ${m.phone || ''}, ${m.address || ''}, ${notes}, ${archiverName}, CURRENT_TIMESTAMP);
  `;

  await sql`DELETE FROM dues_ledger WHERE member_id = ${memberId};`;
  await sql`DELETE FROM members WHERE id = ${memberId};`;

  return res.status(200).json({ success: true, message: `${m.name} archived successfully.` });
}

async function handleDelete(req, res) {
  const memberId = req.body?.memberId;
  if (!memberId) {
    return res.status(400).json({ success: false, message: 'A member id is required.' });
  }

  await sql`DELETE FROM dues_ledger WHERE member_id = ${memberId};`;
  const rows = await sql`DELETE FROM members WHERE id = ${memberId} RETURNING name;`;

  const name = rows[0]?.name || 'Applicant';
  return res.status(200).json({ success: true, message: `${name} deleted permanently.` });
}

async function handleListArchived(req, res) {
  const rows = await sql`
    SELECT id, member_id, name, email, phone, address, notes, archived_by, archived_at
    FROM applicant_archive
    ORDER BY archived_at DESC;
  `;
  return res.status(200).json({ success: true, archived: rows });
}

async function handleRestoreArchived(req, res) {
  const rawId = req.body?.id || req.body?.memberId;
  if (!rawId) {
    return res.status(400).json({ success: false, message: 'An archive record id is required.' });
  }

  const searchStr = String(rawId);
  const numId = Number.parseInt(searchStr, 10);
  const isNumeric = !Number.isNaN(numId) && String(numId) === searchStr;

  const rows = isNumeric
    ? await sql`
        SELECT id, member_id, name, email, phone, address, notes FROM applicant_archive
        WHERE id = ${numId} OR member_id = ${searchStr}
        LIMIT 1;
      `
    : await sql`
        SELECT id, member_id, name, email, phone, address, notes FROM applicant_archive
        WHERE member_id = ${searchStr} OR LOWER(email) = LOWER(${searchStr})
        LIMIT 1;
      `;

  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Archived record not found.' });
  }
  const arch = rows[0];
  const memberId = arch.member_id || ('78008-' + Math.floor(1000 + Math.random() * 9000));
  const currentDuesRate = await getAnnualDuesRate();

  // 1. Insert/update in members table
  await sql`
    INSERT INTO members (id, name, email, phone, role, avatar, address, access, approval_status)
    VALUES (${memberId}, ${arch.name}, ${arch.email}, ${arch.phone || ''}, 'Pending', ${getDefaultAvatarForRole('Pending')}, ${arch.address || ''}, 'pending', 'pending_approval')
    ON CONFLICT (id) DO UPDATE
    SET access = 'pending', approval_status = 'pending_approval', role = 'Pending';
  `;

  // 2. Insert into dues_ledger (Treasurer Dues Console) - archiving already
  // deletes any prior ledger row for this member_id, so no conflict is
  // expected here; dues_ledger.member_id has no unique constraint to target.
  await sql`
    INSERT INTO dues_ledger (member_id, fiscal_year, dues_rate, amount_paid, balance_due, payment_method, dues_status, notes)
    VALUES (${memberId}, '2025/2026 (Oct 1 - Sep 30)', ${currentDuesRate}, '$0.00', ${currentDuesRate}, 'Pending', 'Pending Approval', ${arch.notes || ''});
  `;

  // 3. Confirm arrival in Treasurer Dues Console (dues_ledger table) before deleting from archive
  const ledgerConfirm = await sql`
    SELECT member_id FROM dues_ledger WHERE member_id = ${memberId} LIMIT 1;
  `;
  if (ledgerConfirm.length === 0) {
    return res.status(500).json({ success: false, message: 'Failed to confirm arrival in Treasurer Dues Console.' });
  }

  // 4. Delete from archive using integer primary key arch.id
  await sql`DELETE FROM applicant_archive WHERE id = ${arch.id};`;

  return res.status(200).json({ success: true, message: `${arch.name} restored to Membership Intake awaiting approval.` });
}

async function handleDeleteArchived(req, res) {
  const rawId = req.body?.id || req.body?.memberId;
  if (!rawId) {
    return res.status(400).json({ success: false, message: 'An archive record id is required.' });
  }

  const searchStr = String(rawId);
  const numId = Number.parseInt(searchStr, 10);
  const isNumeric = !Number.isNaN(numId) && String(numId) === searchStr;

  const rows = isNumeric
    ? await sql`
        DELETE FROM applicant_archive
        WHERE id = ${numId} OR member_id = ${searchStr}
        RETURNING name;
      `
    : await sql`
        DELETE FROM applicant_archive
        WHERE member_id = ${searchStr} OR LOWER(email) = LOWER(${searchStr})
        RETURNING name;
      `;

  const name = rows[0]?.name || 'Archived record';
  return res.status(200).json({ success: true, message: `${name} deleted permanently from archive.` });
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
  // A member who uploaded their own photo keeps it - only a record still on a
  // role placeholder follows the role's default image.
  await sql`
    UPDATE members
    SET name = ${fields.name},
        email = ${email},
        phone = ${fields.phone || ''},
        address = ${fields.address || ''},
        role = ${role},
        avatar = CASE
          WHEN avatar LIKE 'data:image/%' THEN avatar
          ELSE ${getDefaultAvatarForRole(role)}
        END,
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

// Self-service: a member correcting their own contact details. Only phone and
// address are written - name, email, role, access, dues and approval status are
// deliberately not reachable from here, whatever the request body contains.
async function handleUpdateMyProfile(req, res, session) {
  const phone = String(req.body?.phone ?? '').trim();
  const address = String(req.body?.address ?? '').trim();

  const rows = await sql`
    UPDATE members SET phone = ${phone}, address = ${address}
    WHERE id = ${session.memberId} RETURNING id;
  `;
  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Member not found.' });
  }
  return res.status(200).json({ success: true, message: 'Your contact details have been updated.' });
}

// Self-service: the member's own profile photo, stored as a data URI in the
// avatar column the roster already reads. The browser downscales it first;
// this is the backstop against an oversized or non-image payload.
const MAX_AVATAR_CHARS = 400_000;

async function handleUpdateMyAvatar(req, res, session) {
  const avatar = String(req.body?.avatar || '');

  if (!/^data:image\/(png|jpeg|webp);base64,/.test(avatar)) {
    return res.status(400).json({ success: false, message: 'Photo must be a PNG, JPEG or WEBP image.' });
  }
  if (avatar.length > MAX_AVATAR_CHARS) {
    return res.status(400).json({ success: false, message: 'That photo is too large. Please choose a smaller image.' });
  }

  const rows = await sql`
    UPDATE members SET avatar = ${avatar} WHERE id = ${session.memberId} RETURNING id;
  `;
  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Member not found.' });
  }
  return res.status(200).json({ success: true, avatar, message: 'Your profile photo has been updated.' });
}

// A member asks for their name to be changed; an exec decides. One open
// request at a time, so the queue cannot be flooded.
async function handleRequestNameChange(req, res, session) {
  const requestedName = String(req.body?.requestedName || '').trim();
  if (requestedName.length < 2) {
    return res.status(400).json({ success: false, message: 'Please enter the full name you would like on record.' });
  }

  const member = await sql`SELECT name FROM members WHERE id = ${session.memberId} LIMIT 1;`;
  if (member.length === 0) {
    return res.status(404).json({ success: false, message: 'Member not found.' });
  }
  if (member[0].name === requestedName) {
    return res.status(400).json({ success: false, message: 'That is already the name on your record.' });
  }

  const open = await sql`
    SELECT id FROM name_change_requests
    WHERE member_id = ${session.memberId} AND status = 'pending' LIMIT 1;
  `;
  if (open.length > 0) {
    return res.status(409).json({
      success: false,
      message: "You already have a name change awaiting an officer's review."
    });
  }

  await sql`
    INSERT INTO name_change_requests (member_id, current_name, requested_name)
    VALUES (${session.memberId}, ${member[0].name}, ${requestedName});
  `;
  return res.status(200).json({
    success: true,
    message: 'Your name change has been sent to the club officers for approval.'
  });
}

async function handleListNameChanges(req, res) {
  const rows = await sql`
    SELECT r.id, r.member_id, r.current_name, r.requested_name, r.status,
           r.requested_at, r.reviewed_by, r.reviewed_at, r.decision_note,
           m.email
    FROM name_change_requests r
    LEFT JOIN members m ON m.id = r.member_id
    ORDER BY (r.status = 'pending') DESC, r.requested_at DESC;
  `;
  return res.status(200).json({ success: true, requests: rows });
}

// An exec approving or declining a name change. Nobody signs off their own -
// an officer who wants their name changed needs another officer to agree.
async function handleReviewNameChange(req, res, session) {
  const { requestId, decision, note } = req.body || {};
  if (!requestId || (decision !== 'approved' && decision !== 'declined')) {
    return res.status(400).json({ success: false, message: 'A request id and a decision are required.' });
  }

  const rows = await sql`
    SELECT id, member_id, requested_name, status FROM name_change_requests
    WHERE id = ${requestId} LIMIT 1;
  `;
  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: 'That name change request no longer exists.' });
  }
  const request = rows[0];

  if (request.status !== 'pending') {
    return res.status(409).json({ success: false, message: 'That request has already been reviewed.' });
  }
  if (request.member_id === session.memberId) {
    return res.status(403).json({
      success: false,
      message: 'You cannot approve your own name change. Another officer must review it.'
    });
  }

  await sql`
    UPDATE name_change_requests
    SET status = ${decision},
        reviewed_by = ${session.memberId},
        reviewed_at = CURRENT_TIMESTAMP,
        decision_note = ${String(note || '').trim() || null}
    WHERE id = ${requestId};
  `;

  if (decision === 'approved') {
    await sql`UPDATE members SET name = ${request.requested_name} WHERE id = ${request.member_id};`;
  }

  return res.status(200).json({
    success: true,
    message: decision === 'approved'
      ? `The roster now shows ${request.requested_name}.`
      : 'The name change was declined.'
  });
}

// Self-service: a signed-in member choosing whether their phone number shows
// in the members directory. The id comes from the session, never the request
// body, so nobody can change someone else's setting.
async function handleSetPhoneVisibility(req, res, session) {
  const hide = Boolean(req.body?.hidePhone);
  const rows = await sql`
    UPDATE members SET hide_phone = ${hide} WHERE id = ${session.memberId} RETURNING id;
  `;
  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Member not found.' });
  }
  return res.status(200).json({
    success: true,
    hidePhone: hide,
    message: hide
      ? 'Your phone number is now hidden from the members directory.'
      : 'Your phone number is now shown in the members directory.'
  });
}

async function handleDeactivateMember(req, res) {
  const memberId = req.body?.memberId;
  if (!memberId) {
    return res.status(400).json({ success: false, message: 'A member id is required.' });
  }
  const rows = await sql`
    UPDATE members SET member_status = 'inactive' WHERE id = ${memberId} RETURNING name;
  `;
  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Member not found.' });
  }
  return res.status(200).json({ success: true, message: `${rows[0].name} moved to Inactive Members.` });
}

async function handleReactivateMember(req, res) {
  const memberId = req.body?.memberId;
  if (!memberId) {
    return res.status(400).json({ success: false, message: 'A member id is required.' });
  }
  const rows = await sql`
    UPDATE members SET member_status = 'active' WHERE id = ${memberId} RETURNING name;
  `;
  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Member not found.' });
  }
  return res.status(200).json({ success: true, message: `${rows[0].name} restored to the active member roster.` });
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
  await ensureApplicantTables();

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
      case 'archive': {
        const session = requireAccess(req, res, CAN_ADD);
        if (!session) return;
        return await handleArchive(req, res, session);
      }
      case 'list-archived': {
        const session = requireAccess(req, res, CAN_ADD);
        if (!session) return;
        return await handleListArchived(req, res);
      }
      case 'restore-archived': {
        const session = requireAccess(req, res, CAN_ADD);
        if (!session) return;
        return await handleRestoreArchived(req, res);
      }
      case 'delete-archived': {
        const session = requireAccess(req, res, CAN_ADD);
        if (!session) return;
        return await handleDeleteArchived(req, res);
      }
      case 'delete': {
        const session = requireAccess(req, res, CAN_ADD);
        if (!session) return;
        return await handleDelete(req, res);
      }
      case 'update-record': {
        const session = requireAccess(req, res, CAN_ADD);
        if (!session) return;
        return await handleUpdateRecord(req, res);
      }
      case 'set-phone-visibility': {
        const session = getSession(req);
        if (!session) {
          return res.status(401).json({ success: false, message: 'Please sign in first.' });
        }
        return await handleSetPhoneVisibility(req, res, session);
      }
      case 'update-my-profile': {
        const session = getSession(req);
        if (!session) {
          return res.status(401).json({ success: false, message: 'Please sign in first.' });
        }
        return await handleUpdateMyProfile(req, res, session);
      }
      case 'update-my-avatar': {
        const session = getSession(req);
        if (!session) {
          return res.status(401).json({ success: false, message: 'Please sign in first.' });
        }
        return await handleUpdateMyAvatar(req, res, session);
      }
      case 'request-name-change': {
        const session = getSession(req);
        if (!session) {
          return res.status(401).json({ success: false, message: 'Please sign in first.' });
        }
        return await handleRequestNameChange(req, res, session);
      }
      case 'list-name-changes': {
        const session = requireAccess(req, res, CAN_ADD);
        if (!session) return;
        const actor = await actorRecord(session);
        if (!canApproveMembers(actor)) {
          return res.status(403).json({ success: false, message: 'Only club officers can review name changes.' });
        }
        return await handleListNameChanges(req, res);
      }
      case 'review-name-change': {
        const session = requireAccess(req, res, CAN_ADD);
        if (!session) return;
        const actor = await actorRecord(session);
        if (!canApproveMembers(actor)) {
          return res.status(403).json({ success: false, message: 'Only club officers can review name changes.' });
        }
        return await handleReviewNameChange(req, res, session);
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
      case 'deactivate-member': {
        const session = requireAccess(req, res, CAN_ADD);
        if (!session) return;
        return await handleDeactivateMember(req, res);
      }
      case 'reactivate-member': {
        const session = requireAccess(req, res, CAN_ADD);
        if (!session) return;
        return await handleReactivateMember(req, res);
      }
      default:
        return res.status(400).json({ success: false, message: 'Unknown action.' });
    }
  } catch (err) {
    console.error(`members (${req.method} ${req.body?.action || 'list'}) error:`, err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
}
