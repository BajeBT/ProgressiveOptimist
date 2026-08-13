import { sql, requireDatabase } from '../lib/db.js';
import { requireAccess } from '../lib/session.js';

const CAN_EDIT = ['super admin', 'finance', 'admin'];

const DEFAULTS = {
  meetingSchedule: '1st Monday of every month at 5:30 PM (6:00 PM for Guests)',
  meetingVenue: 'Ross University, Lloyd Erskine Sandiford Centre (LESC), Two Mile Hill, St. Michael, Barbados',
  contactEmail: 'info@progressiveoptimist.org',
  annualDuesRate: '$200.00',
  themeTitle: 'C.A.R.E – Championing Authentic & Reinvigorating Engagement',
  homepageAnnouncement: '',
  bankName: 'Scotiabank',
  bankAccountName: 'Progressive Optimist',
  bankAccountNumber: '000451801',
  bankBranch: 'Haggatt Hall',
  bankRoutingNumber: '66555'
};

function toClientShape(row) {
  if (!row) return DEFAULTS;
  return {
    meetingSchedule: row.meeting_schedule || DEFAULTS.meetingSchedule,
    meetingVenue: row.meeting_venue || DEFAULTS.meetingVenue,
    contactEmail: row.contact_email || DEFAULTS.contactEmail,
    annualDuesRate: row.annual_dues_rate || DEFAULTS.annualDuesRate,
    themeTitle: row.theme_title || DEFAULTS.themeTitle,
    homepageAnnouncement: row.homepage_announcement !== undefined && row.homepage_announcement !== null ? row.homepage_announcement : DEFAULTS.homepageAnnouncement,
    bankName: row.bank_name || DEFAULTS.bankName,
    bankAccountName: row.bank_account_name || DEFAULTS.bankAccountName,
    bankAccountNumber: row.bank_account_number || DEFAULTS.bankAccountNumber,
    bankBranch: row.bank_branch || DEFAULTS.bankBranch,
    bankRoutingNumber: row.bank_routing_number || DEFAULTS.bankRoutingNumber
  };
}

export default async function handler(req, res) {
  if (!requireDatabase(res)) return;

  try {
    try {
      await sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS homepage_announcement TEXT DEFAULT '';`;
    } catch (_) {}

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
      INSERT INTO site_settings (
        id, meeting_schedule, meeting_venue, contact_email, annual_dues_rate, theme_title, homepage_announcement,
        bank_name, bank_account_name, bank_account_number, bank_branch, bank_routing_number
      )
      VALUES (
        1, ${s.meetingSchedule || DEFAULTS.meetingSchedule}, ${s.meetingVenue || DEFAULTS.meetingVenue},
        ${s.contactEmail || DEFAULTS.contactEmail},
        ${s.annualDuesRate || DEFAULTS.annualDuesRate}, ${s.themeTitle || DEFAULTS.themeTitle},
        ${s.homepageAnnouncement !== undefined ? s.homepageAnnouncement : DEFAULTS.homepageAnnouncement},
        ${s.bankName || DEFAULTS.bankName}, ${s.bankAccountName || DEFAULTS.bankAccountName},
        ${s.bankAccountNumber || DEFAULTS.bankAccountNumber}, ${s.bankBranch || DEFAULTS.bankBranch},
        ${s.bankRoutingNumber || DEFAULTS.bankRoutingNumber}
      )
      ON CONFLICT (id) DO UPDATE SET
        meeting_schedule = EXCLUDED.meeting_schedule,
        meeting_venue = EXCLUDED.meeting_venue,
        contact_email = EXCLUDED.contact_email,
        annual_dues_rate = EXCLUDED.annual_dues_rate,
        theme_title = EXCLUDED.theme_title,
        homepage_announcement = EXCLUDED.homepage_announcement,
        bank_name = EXCLUDED.bank_name,
        bank_account_name = EXCLUDED.bank_account_name,
        bank_account_number = EXCLUDED.bank_account_number,
        bank_branch = EXCLUDED.bank_branch,
        bank_routing_number = EXCLUDED.bank_routing_number,
        updated_at = CURRENT_TIMESTAMP;
    `;

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(`site-settings (${req.method}) error:`, err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
}
