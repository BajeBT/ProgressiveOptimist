import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.NEON_DATABASE_URL);

// Adds the columns behind admin-entered members, the officer approval gate, and
// the October 1st expiry on elevated access held against a personal email.
// Also seeds the super admin account and hashes any plaintext passwords left
// over from before logins were verified server-side.
const SUPER_ADMIN_EMAIL = 'admin@progressiveoptimist.org';
const SUPER_ADMIN_INITIAL_PASSWORD = 'Temp@1234';

async function migrate() {
  if (!process.env.NEON_DATABASE_URL) {
    throw new Error('NEON_DATABASE_URL is not set. Add it to .env before running this migration.');
  }

  console.log('Adding member governance columns...');
  await sql`ALTER TABLE members ADD COLUMN IF NOT EXISTS is_secretary BOOLEAN DEFAULT FALSE;`;
  await sql`ALTER TABLE members ADD COLUMN IF NOT EXISTS approval_status VARCHAR(50) DEFAULT 'approved';`;
  await sql`ALTER TABLE members ADD COLUMN IF NOT EXISTS added_by VARCHAR(50);`;
  await sql`ALTER TABLE members ADD COLUMN IF NOT EXISTS admin_granted_at TIMESTAMP WITH TIME ZONE;`;
  await sql`ALTER TABLE members ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255);`;
  await sql`ALTER TABLE members ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP WITH TIME ZONE;`;

  // Existing rows predate the approval gate and are treated as already approved.
  await sql`UPDATE members SET approval_status = 'approved' WHERE approval_status IS NULL;`;

  // Charmaine London is the Club Secretary and is one of the three officers who
  // can approve member records.
  const secretary = await sql`
    UPDATE members SET is_secretary = TRUE
    WHERE LOWER(TRIM(email)) = 'londoncharms@hotmail.com'
    RETURNING name;
  `;
  if (secretary.length > 0) {
    console.log(`Marked ${secretary[0].name} as Club Secretary.`);
  }

  // bcrypt hashes always start with $2; anything else stored here is a plaintext
  // password from the old client-side login and must be hashed in place.
  const plaintext = await sql`
    SELECT id, email, password FROM members
    WHERE password IS NOT NULL AND password NOT LIKE '$2%';
  `;
  for (const row of plaintext) {
    const hash = await bcrypt.hash(row.password, 10);
    await sql`UPDATE members SET password = ${hash} WHERE id = ${row.id};`;
    console.log(`Hashed the stored password for ${row.email}.`);
  }

  console.log(`Seeding super admin ${SUPER_ADMIN_EMAIL}...`);
  const hash = await bcrypt.hash(SUPER_ADMIN_INITIAL_PASSWORD, 10);
  await sql`
    INSERT INTO members (
      id, name, email, role, access, avatar,
      is_treasurer, is_president, is_secretary,
      approval_status, password
    )
    VALUES (
      '78008-0001', 'Club System Administrator', ${SUPER_ADMIN_EMAIL},
      'System Administrator', 'super admin', '/avatars/active_member_icon.jpg',
      TRUE, TRUE, TRUE, 'approved', ${hash}
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      access = EXCLUDED.access,
      approval_status = 'approved',
      password = EXCLUDED.password;
  `;
  await sql`
    INSERT INTO dues_ledger (member_id, fiscal_year, dues_rate, amount_paid, balance_due, payment_method, dues_status)
    VALUES ('78008-0001', '2025/2026 (Oct 1 - Sep 30)', '$0.00', '$0.00', '$0.00', 'Exempt', 'Exempt / Honorary')
    ON CONFLICT DO NOTHING;
  `;

  const counts = await sql`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE password IS NULL)::int AS without_password,
      COUNT(*) FILTER (WHERE approval_status = 'pending_approval')::int AS pending
    FROM members;
  `;
  console.log('\nMigration complete.');
  console.log(`  Members: ${counts[0].total}`);
  console.log(`  Awaiting approval: ${counts[0].pending}`);
  console.log(`  Without a password (will be emailed a set-password link on first login attempt): ${counts[0].without_password}`);
  console.log(`\n  Super admin: ${SUPER_ADMIN_EMAIL} / ${SUPER_ADMIN_INITIAL_PASSWORD}`);
  console.log('  Change that password after signing in.');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
