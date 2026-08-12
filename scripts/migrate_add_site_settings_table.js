import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEON_DATABASE_URL);

// Site Variables (Annual Dues Rate, meeting info, etc.) were only ever saved to
// the admin's own browser localStorage - editing them didn't change what any
// other visitor saw, including the Stripe checkout default. This gives them a
// real, shared, single-row home in the database.
async function migrate() {
  if (!process.env.NEON_DATABASE_URL) {
    throw new Error('NEON_DATABASE_URL is not set. Add it to .env before running this migration.');
  }

  console.log('Creating site_settings table...');
  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY DEFAULT 1,
      meeting_schedule TEXT,
      meeting_venue TEXT,
      support_email TEXT,
      contact_phone TEXT,
      annual_dues_rate VARCHAR(50),
      theme_title TEXT,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT single_row CHECK (id = 1)
    );
  `;

  console.log('Seeding the single settings row (dues rate corrected to $200.00)...');
  await sql`
    INSERT INTO site_settings (
      id, meeting_schedule, meeting_venue, support_email, contact_phone, annual_dues_rate, theme_title
    )
    VALUES (
      1,
      '1st Monday of every month at 5:30 PM',
      'Ross University, Lloyd Erskine Sandiford Centre (LESC), Two Mile Hill, St. Michael, Barbados',
      'info@progressiveoptimist.org',
      '+1 (246) 836-6185',
      '$200.00',
      'C.A.R.E – Championing Authentic & Reinvigorating Engagement'
    )
    ON CONFLICT (id) DO NOTHING;
  `;

  const row = await sql`SELECT * FROM site_settings WHERE id = 1;`;
  console.log('\nCurrent site_settings row:', JSON.stringify(row[0], null, 1));
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
