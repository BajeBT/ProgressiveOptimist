import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { getDefaultAvatarForRole } from '../lib/roles.js';

const sql = neon(process.env.NEON_DATABASE_URL);

// scripts/seed_officer_accounts.js predates the role-based avatar system
// (lib/roles.js) and gave every officer account the generic member icon with
// role text like "Club Treasurer" that doesn't match the canonical "Treasurer"
// dropdown value, so they never picked up their proper pictures. This
// normalizes both fields. admin@progressiveoptimist.org is left untouched -
// it's a generic super admin account, not tied to a specific pictured office.
const FIXES = [
  { email: 'treasurer@progressiveoptimist.org', role: 'Treasurer' },
  { email: 'secretary@progressiveoptimist.org', role: 'Secretary' },
  { email: 'president@progressiveoptimist.org', role: 'President' },
  { email: 'pro@progressiveoptimist.org', role: 'Public Relations Officer (PRO)' }
];

async function run() {
  if (!process.env.NEON_DATABASE_URL) {
    throw new Error('NEON_DATABASE_URL is not set. Add it to .env before running this script.');
  }

  for (const fix of FIXES) {
    const avatar = getDefaultAvatarForRole(fix.role);
    const rows = await sql`
      UPDATE members
      SET role = ${fix.role}, avatar = ${avatar}
      WHERE email = ${fix.email}
      RETURNING name, email, role, avatar;
    `;
    if (rows.length === 0) {
      console.log(`SKIPPED  ${fix.email} - no matching member found.`);
    } else {
      console.log(`FIXED    ${fix.email} -> role="${rows[0].role}" avatar="${rows[0].avatar}"`);
    }
  }
}

run().catch(err => {
  console.error('Fix failed:', err);
  process.exit(1);
});
