import { sql, requireDatabase } from '../lib/db.js';
import { requireAccess } from '../lib/session.js';

const CAN_EDIT = ['super admin', 'finance', 'admin'];

function toClientShape(row) {
  return {
    id: row.id,
    name: row.name,
    motto: row.motto,
    charterYear: row.charter_year,
    isHost: row.is_host,
    location: row.location,
    meetingSchedule: row.meeting_schedule,
    email: row.email,
    phone: row.phone,
    website: row.website,
    description: row.description,
    initiatives: row.initiatives || []
  };
}

async function handleList(req, res) {
  const rows = await sql`SELECT * FROM barbados_clubs ORDER BY sort_order ASC, created_at ASC;`;
  return res.status(200).json({ success: true, clubs: rows.map(toClientShape) });
}

async function handleAdd(req, res) {
  const c = req.body?.club || {};
  if (!c.name) {
    return res.status(400).json({ success: false, message: 'A club name is required.' });
  }

  const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), -1) AS max FROM barbados_clubs;`;
  const rows = await sql`
    INSERT INTO barbados_clubs (
      name, motto, charter_year, is_host, location, meeting_schedule,
      email, phone, website, description, initiatives, sort_order
    )
    VALUES (
      ${c.name}, ${c.motto || ''}, ${c.charterYear || ''}, ${Boolean(c.isHost)},
      ${c.location || ''}, ${c.meetingSchedule || ''}, ${c.email || ''}, ${c.phone || ''},
      ${c.website || ''}, ${c.description || ''}, ${Array.isArray(c.initiatives) ? c.initiatives : []},
      ${maxOrder[0].max + 1}
    )
    RETURNING *;
  `;
  return res.status(200).json({ success: true, club: toClientShape(rows[0]) });
}

async function handleUpdate(req, res) {
  const id = req.body?.id;
  const c = req.body?.club || {};
  if (!id || !c.name) {
    return res.status(400).json({ success: false, message: 'A club id and name are required.' });
  }

  const rows = await sql`
    UPDATE barbados_clubs
    SET name = ${c.name},
        motto = ${c.motto || ''},
        charter_year = ${c.charterYear || ''},
        is_host = ${Boolean(c.isHost)},
        location = ${c.location || ''},
        meeting_schedule = ${c.meetingSchedule || ''},
        email = ${c.email || ''},
        phone = ${c.phone || ''},
        website = ${c.website || ''},
        description = ${c.description || ''},
        initiatives = ${Array.isArray(c.initiatives) ? c.initiatives : []},
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *;
  `;
  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Club not found.' });
  }
  return res.status(200).json({ success: true, club: toClientShape(rows[0]) });
}

async function handleDelete(req, res) {
  const id = req.body?.id;
  if (!id) {
    return res.status(400).json({ success: false, message: 'A club id is required.' });
  }
  await sql`DELETE FROM barbados_clubs WHERE id = ${id};`;
  return res.status(200).json({ success: true });
}

export default async function handler(req, res) {
  if (!requireDatabase(res)) return;

  try {
    // The public directory page needs this list without requiring a session.
    if (req.method === 'GET') {
      return await handleList(req, res);
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method not allowed.' });
    }

    const session = requireAccess(req, res, CAN_EDIT);
    if (!session) return;

    const { action } = req.body || {};

    switch (action) {
      case 'add':
        return await handleAdd(req, res);
      case 'update':
        return await handleUpdate(req, res);
      case 'delete':
        return await handleDelete(req, res);
      default:
        return res.status(400).json({ success: false, message: 'Unknown action.' });
    }
  } catch (err) {
    console.error(`barbados-clubs (${req.method} ${req.body?.action || 'list'}) error:`, err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
}
