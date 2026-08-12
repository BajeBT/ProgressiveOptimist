import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEON_DATABASE_URL);

// The five office accounts (scripts/seed_officer_accounts.js,
// migrate_add_member_governance.js) were created with generic office-title
// names ("Club Treasurer Office") rather than the name of whoever actually
// holds each office. This sets them to match the current office-holder found
// in the member directory. pro@ is left alone - no member record currently
// holds the PRO title, so there's nothing to match it to.
const FIXES = [
  { email: 'treasurer@progressiveoptimist.org', name: 'Sharon Mohammed' },
  { email: 'secretary@progressiveoptimist.org', name: 'Charmaine London' },
  { email: 'president@progressiveoptimist.org', name: 'Richelle Lucas' },
  { email: 'admin@progressiveoptimist.org', name: 'Edwin Workman' }
];

async function run() {
  if (!process.env.NEON_DATABASE_URL) {
    throw new Error('NEON_DATABASE_URL is not set. Add it to .env before running this script.');
  }

  for (const fix of FIXES) {
    const rows = await sql`
      UPDATE members SET name = ${fix.name}
      WHERE email = ${fix.email}
      RETURNING name, email;
    `;
    if (rows.length === 0) {
      console.log(`SKIPPED  ${fix.email} - no matching member found.`);
    } else {
      console.log(`FIXED    ${fix.email} -> name="${rows[0].name}"`);
    }
  }
}

run().catch(err => {
  console.error('Fix failed:', err);
  process.exit(1);
});
