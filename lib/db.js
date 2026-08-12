import { neon } from '@neondatabase/serverless';

// Shared helpers for the serverless routes. Deliberately outside /api - Vercel
// treats every file under /api as its own serverless function.

// Single Neon client wrapper for every route. The connection string lives in the
// environment, never in code: it used to be hardcoded in src/db/neon.js, which
// shipped it to every visitor's browser.
export const sql = (...args) => {
  const dbUrl = process.env.NEON_DATABASE_URL;
  if (!dbUrl) {
    throw new Error('NEON_DATABASE_URL environment variable is missing.');
  }
  return neon(dbUrl)(...args);
};

export const OFFICIAL_DOMAIN = '@progressiveoptimist.org';
export const SUPER_ADMIN_EMAIL = 'admin@progressiveoptimist.org';

// Access tiers that unlock any part of the admin console.
export const ELEVATED_ACCESS = ['super admin', 'finance', 'admin', 'moderator'];

// Officers permitted to approve a member added by someone other than the
// Treasurer: President, Treasurer, Secretary, plus the super admin account.
export function canApproveMembers(member) {
  if (!member) return false;
  return Boolean(member.is_president) ||
    Boolean(member.is_treasurer) ||
    Boolean(member.is_secretary) ||
    normalizeEmail(member.email) === SUPER_ADMIN_EMAIL;
}

export function normalizeEmail(email) {
  return String(email || '').toLowerCase().trim();
}

export function isOfficialEmail(email) {
  return normalizeEmail(email).endsWith(OFFICIAL_DOMAIN);
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
}

// Barbados is UTC-4 year round (no daylight saving), so "October 1st, 12:01am"
// local time is 04:01 UTC on the same date.
const BARBADOS_UTC_OFFSET_HOURS = 4;

// Elevated access granted to someone without an @progressiveoptimist.org
// address expires at the first October 1st 12:01am that falls after the grant,
// lining up with the club's Oct 1 - Sep 30 fiscal year. Evaluated on each login
// rather than by a scheduled job, so it needs no cron infrastructure.
export function adminGrantExpired(grantedAt, now = new Date()) {
  if (!grantedAt) return false;
  const granted = new Date(grantedAt);
  if (Number.isNaN(granted.getTime())) return false;

  const expiryFor = (year) => new Date(Date.UTC(year, 9, 1, BARBADOS_UTC_OFFSET_HOURS, 1, 0));

  let expiry = expiryFor(granted.getUTCFullYear());
  if (expiry <= granted) {
    expiry = expiryFor(granted.getUTCFullYear() + 1);
  }
  return now >= expiry;
}

// The access level a member actually gets for a given login, as opposed to the
// tier stored on their record. Admin rights require signing in with the club
// domain; a personal address is treated as a standard member unless elevated
// access was granted explicitly (admin_granted_at), and that grant expires.
export function resolveEffectiveAccess(member, now = new Date()) {
  const storedAccess = member.access || 'member';
  if (!ELEVATED_ACCESS.includes(storedAccess)) {
    return { access: storedAccess, expired: false };
  }
  if (isOfficialEmail(member.email)) {
    return { access: storedAccess, expired: false };
  }
  if (member.admin_granted_at && !adminGrantExpired(member.admin_granted_at, now)) {
    return { access: storedAccess, expired: false };
  }
  return { access: 'member', expired: Boolean(member.admin_granted_at) };
}

const DEFAULT_ANNUAL_DUES_RATE = '$200.00';

// Current club-wide dues rate, set by the Treasurer/admin via Site Variables.
// Used wherever a new member's dues record is created, so it never drifts
// from what's shown on the Donate/Membership pages.
export async function getAnnualDuesRate() {
  const rows = await sql`SELECT annual_dues_rate FROM site_settings WHERE id = 1;`;
  return rows[0]?.annual_dues_rate || DEFAULT_ANNUAL_DUES_RATE;
}

const DEFAULT_CONTACT_EMAIL = 'info@progressiveoptimist.org';

// Where the Contact form actually delivers to, set by the admin via Site
// Variables - so changing it there really does redirect contact messages.
export async function getContactEmail() {
  const rows = await sql`SELECT contact_email FROM site_settings WHERE id = 1;`;
  return rows[0]?.contact_email || DEFAULT_CONTACT_EMAIL;
}

// Guard every route: without a configured connection string the Neon client
// throws an opaque error, so fail loudly and early instead.
export function requireDatabase(res) {
  if (!process.env.NEON_DATABASE_URL) {
    res.status(500).json({ success: false, message: 'Database is not configured.' });
    return false;
  }
  return true;
}
