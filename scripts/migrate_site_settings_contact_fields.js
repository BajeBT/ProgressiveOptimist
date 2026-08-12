import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEON_DATABASE_URL);

// support_email was mislabeled - it's actually the club's general contact
// address (shown in the Footer and Contact page), not a "support" address, so
// this renames it for clarity. contact_phone is dropped entirely: nothing on
// the site displays a phone number and there's no place planned for one.
// Meeting Schedule is corrected to capture both real start times (5:30 PM for
// members, 6:00 PM for guests) in one string, since the two previously
// disagreed across different hardcoded copies on the site.
async function migrate() {
  if (!process.env.NEON_DATABASE_URL) {
    throw new Error('NEON_DATABASE_URL is not set. Add it to .env before running this migration.');
  }

  console.log('Renaming support_email -> contact_email...');
  await sql`ALTER TABLE site_settings RENAME COLUMN support_email TO contact_email;`;

  console.log('Dropping contact_phone (never displayed anywhere on the site)...');
  await sql`ALTER TABLE site_settings DROP COLUMN IF EXISTS contact_phone;`;

  console.log('Correcting meeting_schedule to capture both member and guest times...');
  await sql`
    UPDATE site_settings
    SET meeting_schedule = '1st Monday of every month at 5:30 PM (6:00 PM for Guests)'
    WHERE id = 1;
  `;

  const row = await sql`SELECT * FROM site_settings WHERE id = 1;`;
  console.log('\nCurrent site_settings row:', JSON.stringify(row[0], null, 1));
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
