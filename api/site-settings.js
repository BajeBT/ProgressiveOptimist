import { sql, requireDatabase } from '../lib/db.js';
import { requireAccess } from '../lib/session.js';

const CAN_EDIT = ['super admin', 'finance', 'admin'];

const DEFAULTS = {
  meetingSchedule: '1st Monday of every month at 5:30 PM',
  meetingVenue: 'Ross University, Lloyd Erskine Sandiford Centre (LESC), Two Mile Hill, St. Michael, Barbados',
  supportEmail: 'info@progressiveoptimist.org',
  contactPhone: '+1 (246) 836-6185',
  annualDuesRate: '$200.00',
  themeTitle: 'C.A.R.E – Championing Authentic & Reinvigorating Engagement'
};

function toClientShape(row) {
  if (!row) return DEFAULTS;
  return {
    meetingSchedule: row.meeting_schedule || DEFAULTS.meetingSchedule,
    meetingVenue: row.meeting_venue || DEFAULTS.meetingVenue,
    supportEmail: row.support_email || DEFAULTS.supportEmail,
    contactPhone: row.contact_phone || DEFAULTS.contactPhone,
    annualDuesRate: row.annual_dues_rate || DEFAULTS.annualDuesRate,
    themeTitle: row.theme_title || DEFAULTS.themeTitle
  };
}

export default async function handler(req, res) {
  if (!requireDatabase(res)) return;

  try {
    // Public: the Donate/Membership pages and the Stripe checkout route all
    // need the current dues rate without requiring a signed-in session.
    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM site_settings WHERE id = 1;`;
      return res.status(200).json({ success: true, settings: toClientShape(rows[0]) });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method not allowed.' });
    }

    const session = requireAccess(req, res, CAN_EDIT);
    if (!session) return;

    const s = req.body?.settings || {};
    await sql`
      INSERT INTO site_settings (id, meeting_schedule, meeting_venue, support_email, contact_phone, annual_dues_rate, theme_title)
      VALUES (
        1, ${s.meetingSchedule || DEFAULTS.meetingSchedule}, ${s.meetingVenue || DEFAULTS.meetingVenue},
        ${s.supportEmail || DEFAULTS.supportEmail}, ${s.contactPhone || DEFAULTS.contactPhone},
        ${s.annualDuesRate || DEFAULTS.annualDuesRate}, ${s.themeTitle || DEFAULTS.themeTitle}
      )
      ON CONFLICT (id) DO UPDATE SET
        meeting_schedule = EXCLUDED.meeting_schedule,
        meeting_venue = EXCLUDED.meeting_venue,
        support_email = EXCLUDED.support_email,
        contact_phone = EXCLUDED.contact_phone,
        annual_dues_rate = EXCLUDED.annual_dues_rate,
        theme_title = EXCLUDED.theme_title,
        updated_at = CURRENT_TIMESTAMP;
    `;

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(`site-settings (${req.method}) error:`, err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
}
