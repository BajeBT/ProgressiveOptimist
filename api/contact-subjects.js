import { sql, requireDatabase } from '../lib/db.js';
import { requireAccess } from '../lib/session.js';

const CAN_EDIT = ['super admin', 'finance', 'admin'];

export default async function handler(req, res) {
  if (!requireDatabase(res)) return;

  try {
    // The Contact page needs this list before anyone signs in.
    if (req.method === 'GET') {
      const rows = await sql`SELECT id, label, sort_order FROM contact_subjects ORDER BY sort_order ASC;`;
      return res.status(200).json({ success: true, subjects: rows });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method not allowed.' });
    }

    const session = requireAccess(req, res, CAN_EDIT);
    if (!session) return;

    const { action, label, id, updates } = req.body || {};

    switch (action) {
      case 'add': {
        const trimmed = String(label || '').trim();
        if (!trimmed) {
          return res.status(400).json({ success: false, message: 'A label is required.' });
        }
        const rows = await sql`
          INSERT INTO contact_subjects (label, sort_order)
          VALUES (
            ${trimmed},
            COALESCE((SELECT MAX(sort_order) + 1 FROM contact_subjects), 0)
          )
          RETURNING id, label, sort_order;
        `;
        return res.status(200).json({ success: true, subject: rows[0] });
      }

      case 'remove': {
        if (!id) {
          return res.status(400).json({ success: false, message: 'A subject id is required.' });
        }
        await sql`DELETE FROM contact_subjects WHERE id = ${id};`;
        return res.status(200).json({ success: true });
      }

      case 'reorder': {
        // Two rows swap sort_order; both writes are sent together so the list
        // cannot be left half-reordered.
        if (!Array.isArray(updates) || updates.length !== 2) {
          return res.status(400).json({ success: false, message: 'Two subjects are required to reorder.' });
        }
        for (const u of updates) {
          await sql`UPDATE contact_subjects SET sort_order = ${u.sortOrder} WHERE id = ${u.id};`;
        }
        return res.status(200).json({ success: true });
      }

      default:
        return res.status(400).json({ success: false, message: 'Unknown action.' });
    }
  } catch (err) {
    console.error(`contact-subjects (${req.method} ${req.body?.action || 'list'}) error:`, err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
}
