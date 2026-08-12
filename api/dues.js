import { sql, requireDatabase } from '../lib/db.js';
import { getSession, requireAccess } from '../lib/session.js';

const CAN_MANAGE_DUES = ['super admin', 'finance', 'admin'];

// A member's own payment history. Anyone signed in may read their own; the
// dues managers may read anyone's.
async function handleHistory(req, res) {
  const session = getSession(req);
  if (!session) {
    return res.status(401).json({ success: false, message: 'You must be signed in to view payment history.' });
  }

  const memberId = req.query?.memberId || session.memberId;
  if (memberId !== session.memberId && !CAN_MANAGE_DUES.includes(session.access)) {
    return res.status(403).json({ success: false, message: 'You may only view your own payment history.' });
  }

  const rows = await sql`
    SELECT id, fiscal_year, amount_bbd, payment_method, paid_at, stripe_session_id
    FROM dues_payments
    WHERE member_id = ${memberId}
    ORDER BY paid_at DESC;
  `;
  return res.status(200).json({ success: true, payments: rows });
}

// Replaces a member's manually-entered payments for one fiscal year (up to 4
// date/amount/method rows from the Edit Record form) and recomputes the
// dues_ledger aggregate from the full payment history. Real Stripe payments
// (stripe_session_id set) are never touched here - only rows the Treasurer
// entered by hand are replaced, so editing the manual list can never
// overwrite an actual processor transaction.
async function handleUpdatePayments(req, res) {
  const { memberId, fiscalYear, duesRate, payments } = req.body || {};
  if (!memberId || !fiscalYear) {
    return res.status(400).json({ success: false, message: 'A member id and fiscal year are required.' });
  }

  const entries = (Array.isArray(payments) ? payments : [])
    .filter(p => p && p.date && Number(p.amount) > 0)
    .slice(0, 4);

  await sql`
    DELETE FROM dues_payments
    WHERE member_id = ${memberId} AND fiscal_year = ${fiscalYear} AND stripe_session_id IS NULL;
  `;

  for (const p of entries) {
    await sql`
      INSERT INTO dues_payments (member_id, fiscal_year, amount_bbd, payment_method, paid_at)
      VALUES (${memberId}, ${fiscalYear}, ${Number(p.amount)}, ${p.method || 'Bank Transfer'}, ${p.date});
    `;
  }

  const totals = await sql`
    SELECT COALESCE(SUM(amount_bbd), 0)::numeric AS total, MAX(paid_at)::date AS last_date
    FROM dues_payments
    WHERE member_id = ${memberId} AND fiscal_year = ${fiscalYear};
  `;
  const totalPaid = Number(totals[0].total);
  const rate = Number(String(duesRate || '0').replace(/[^0-9.]/g, '')) || 0;
  const balanceDue = rate - totalPaid;
  const balanceDueStr = balanceDue < 0 ? `-$${Math.abs(balanceDue).toFixed(2)}` : `$${balanceDue.toFixed(2)}`;
  const lastPaymentDate = totals[0].last_date
    ? new Date(totals[0].last_date).toISOString().split('T')[0]
    : null;

  await sql`
    UPDATE dues_ledger
    SET amount_paid = ${'$' + totalPaid.toFixed(2)},
        balance_due = ${balanceDueStr},
        last_payment_date = COALESCE(${lastPaymentDate}, last_payment_date),
        updated_at = CURRENT_TIMESTAMP
    WHERE member_id = ${memberId};
  `;

  return res.status(200).json({
    success: true,
    amountPaid: '$' + totalPaid.toFixed(2),
    balanceDue: balanceDueStr,
    lastPaymentDate
  });
}

async function handleUpdateStatus(req, res) {
  const { memberId, status, amountPaid, balanceDue, paymentMethod } = req.body || {};
  if (!memberId || !status) {
    return res.status(400).json({ success: false, message: 'A member id and status are required.' });
  }

  const today = new Date().toISOString().split('T')[0];
  await sql`
    UPDATE dues_ledger
    SET dues_status = ${status},
        last_payment_date = ${today},
        amount_paid = ${amountPaid},
        balance_due = ${balanceDue},
        payment_method = ${paymentMethod || 'Bank Transfer'},
        updated_at = CURRENT_TIMESTAMP
    WHERE member_id = ${memberId};
  `;
  return res.status(200).json({ success: true, lastPaymentDate: today });
}

async function handleUpdateNotes(req, res) {
  const { memberId, notes } = req.body || {};
  if (!memberId) {
    return res.status(400).json({ success: false, message: 'A member id is required.' });
  }

  await sql`
    UPDATE dues_ledger
    SET notes = ${notes || ''}, updated_at = CURRENT_TIMESTAMP
    WHERE member_id = ${memberId};
  `;
  return res.status(200).json({ success: true });
}

async function handleStatementSent(req, res) {
  const memberIds = Array.isArray(req.body?.memberIds) ? req.body.memberIds : [];
  if (memberIds.length === 0) {
    return res.status(400).json({ success: false, message: 'No members were selected.' });
  }

  const today = new Date().toISOString().split('T')[0];
  await sql`
    UPDATE dues_ledger
    SET email_last_sent = ${today}, updated_at = CURRENT_TIMESTAMP
    WHERE member_id = ANY(${memberIds});
  `;
  return res.status(200).json({ success: true, emailLastSent: today, count: memberIds.length });
}

export default async function handler(req, res) {
  if (!requireDatabase(res)) return;

  try {
    if (req.method === 'GET') {
      return await handleHistory(req, res);
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method not allowed.' });
    }

    const action = req.body?.action;
    const session = requireAccess(req, res, CAN_MANAGE_DUES);
    if (!session) return;

    switch (action) {
      case 'update-status':
        return await handleUpdateStatus(req, res);
      case 'update-payments':
        return await handleUpdatePayments(req, res);
      case 'update-notes':
        return await handleUpdateNotes(req, res);
      case 'statement-sent':
        return await handleStatementSent(req, res);
      default:
        return res.status(400).json({ success: false, message: 'Unknown action.' });
    }
  } catch (err) {
    console.error(`dues (${req.method} ${req.body?.action || 'history'}) error:`, err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
}
