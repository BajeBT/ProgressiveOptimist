import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEON_DATABASE_URL);

// The official bank deposit account was hardcoded independently in four
// files, with values that had already drifted apart (AdminSettingsPage.jsx
// said "Scotiabank (Barbados) Ltd." / "Progressive Optimist Club of
// Barbados" / "Haggatt Hall Branch, St. Michael"; every other file said the
// shorter "Scotiabank" / "Progressive Optimist" / "Haggatt Hall"). This adds
// it to site_settings as the single source of truth, seeded with the
// shorter canonical values.
async function migrate() {
  if (!process.env.NEON_DATABASE_URL) {
    throw new Error('NEON_DATABASE_URL is not set. Add it to .env before running this migration.');
  }

  console.log('Adding bank detail columns to site_settings...');
  await sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS bank_name TEXT;`;
  await sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS bank_account_name TEXT;`;
  await sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS bank_account_number VARCHAR(50);`;
  await sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS bank_branch TEXT;`;
  await sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS bank_routing_number VARCHAR(50);`;

  console.log('Seeding canonical bank details...');
  await sql`
    UPDATE site_settings
    SET bank_name = 'Scotiabank',
        bank_account_name = 'Progressive Optimist',
        bank_account_number = '000451801',
        bank_branch = 'Haggatt Hall',
        bank_routing_number = '66555'
    WHERE id = 1;
  `;

  const row = await sql`SELECT * FROM site_settings WHERE id = 1;`;
  console.log('\nCurrent site_settings row:', JSON.stringify(row[0], null, 1));
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
