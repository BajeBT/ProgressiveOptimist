import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEON_DATABASE_URL);

// dues_payments has existed since the Stripe webhook migration but was never
// backfilled for members whose dues were recorded manually (bank transfer,
// cash, etc.) before itemized payments existed. Without this, the new
// itemized statement would show an empty transaction list for everyone until
// their record is next edited. One row per current member, built from their
// existing aggregate amount_paid/last_payment_date/payment_method. Official
// @progressiveoptimist.org utility accounts (Exempt/Honorary, $0.00) are
// skipped - there's no real payment to itemize.
async function run() {
  if (!process.env.NEON_DATABASE_URL) {
    throw new Error('NEON_DATABASE_URL is not set. Add it to .env before running this script.');
  }

  const rows = await sql`
    SELECT d.member_id, d.fiscal_year, d.amount_paid, d.last_payment_date, d.payment_method, m.name
    FROM dues_ledger d
    JOIN members m ON m.id = d.member_id
    WHERE NOT (m.email ILIKE '%@progressiveoptimist.org')
      AND d.amount_paid IS NOT NULL
      AND d.amount_paid != '$0.00';
  `;

  let inserted = 0;
  for (const r of rows) {
    const existing = await sql`
      SELECT 1 FROM dues_payments
      WHERE member_id = ${r.member_id} AND fiscal_year = ${r.fiscal_year} AND stripe_session_id IS NULL;
    `;
    if (existing.length > 0) {
      console.log(`SKIPPED  ${r.name} - already has a manual payment row for ${r.fiscal_year}.`);
      continue;
    }

    const amount = Number(String(r.amount_paid).replace(/[^0-9.]/g, ''));
    const paidAt = /^\d{4}-\d{2}-\d{2}$/.test(r.last_payment_date) ? r.last_payment_date : new Date().toISOString().split('T')[0];

    await sql`
      INSERT INTO dues_payments (member_id, fiscal_year, amount_bbd, payment_method, paid_at)
      VALUES (${r.member_id}, ${r.fiscal_year}, ${amount}, ${r.payment_method || 'Bank Transfer'}, ${paidAt});
    `;
    console.log(`BACKFILLED  ${r.name}: $${amount.toFixed(2)} on ${paidAt} via ${r.payment_method || 'Bank Transfer'}`);
    inserted++;
  }

  console.log(`\n${inserted} payment record(s) backfilled.`);
}

run().catch(err => {
  console.error('Backfill failed:', err);
  process.exit(1);
});
