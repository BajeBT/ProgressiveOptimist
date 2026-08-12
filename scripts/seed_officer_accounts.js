import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { generateRandomPassword } from '../lib/password.js';

const sql = neon(process.env.NEON_DATABASE_URL);

// Standalone @progressiveoptimist.org accounts for the club's officers, in the
// same pattern as admin@progressiveoptimist.org: separate from each officer's
// personal member record (Sharon/Richelle/Charmaine keep their own), used only
// to log into the admin console under the official domain, which is what
// grants permanent elevated access under the domain rule in lib/db.js.
const OFFICER_ACCOUNTS = [
  {
    id: '78008-0002',
    email: 'treasurer@progressiveoptimist.org',
    name: 'Club Treasurer Office',
    role: 'Club Treasurer',
    access: 'finance',
    isTreasurer: true
  },
  {
    id: '78008-0003',
    email: 'secretary@progressiveoptimist.org',
    name: 'Club Secretary Office',
    role: 'Club Secretary',
    access: 'admin',
    isSecretary: true
  },
  {
    id: '78008-0004',
    email: 'president@progressiveoptimist.org',
    name: 'Club President Office',
    role: 'Club President',
    access: 'super admin',
    isPresident: true
  },
  {
    id: '78008-0005',
    email: 'pro@progressiveoptimist.org',
    name: 'Club Public Relations Officer',
    role: 'Public Relations Officer (PRO)',
    access: 'admin'
  }
];

async function seed() {
  if (!process.env.NEON_DATABASE_URL) {
    throw new Error('NEON_DATABASE_URL is not set. Add it to .env before running this script.');
  }

  console.log('Seeding official club officer accounts...\n');
  const results = [];

  for (const acct of OFFICER_ACCOUNTS) {
    const existing = await sql`SELECT id FROM members WHERE LOWER(TRIM(email)) = ${acct.email};`;
    if (existing.length > 0) {
      console.log(`SKIPPED  ${acct.email} - a member with this email already exists (id ${existing[0].id}).`);
      continue;
    }

    const password = generateRandomPassword();
    const hash = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO members (
        id, name, email, role, access, avatar,
        is_treasurer, is_president, is_secretary,
        approval_status, password
      )
      VALUES (
        ${acct.id}, ${acct.name}, ${acct.email}, ${acct.role}, ${acct.access},
        '/avatars/active_member_icon.jpg',
        ${Boolean(acct.isTreasurer)}, ${Boolean(acct.isPresident)}, ${Boolean(acct.isSecretary)},
        'approved', ${hash}
      )
      ON CONFLICT (id) DO NOTHING;
    `;
    await sql`
      INSERT INTO dues_ledger (member_id, fiscal_year, dues_rate, amount_paid, balance_due, payment_method, dues_status)
      VALUES (${acct.id}, '2025/2026 (Oct 1 - Sep 30)', '$0.00', '$0.00', '$0.00', 'Exempt', 'Exempt / Honorary')
      ON CONFLICT DO NOTHING;
    `;

    results.push({ email: acct.email, password });
    console.log(`CREATED  ${acct.email}`);
  }

  if (results.length > 0) {
    console.log('\n--- Credentials (shown once - copy these now) ---');
    for (const r of results) {
      console.log(`  ${r.email.padEnd(38)} ${r.password}`);
    }
    console.log('\nEach password can be regenerated any time via Reset Password in the admin console (super admin only).');
  } else {
    console.log('\nNothing to do - all four accounts already exist.');
  }
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
