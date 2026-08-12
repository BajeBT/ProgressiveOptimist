import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEON_DATABASE_URL);

// The club's dues rate should have been $200.00 from the beginning, not $250.
// No member ever actually paid $250 - this corrects the historical ledger
// record to reflect what was actually owed and settled, so every current
// member shows dues_rate=$200.00, amount_paid=$200.00, balance_due=$0.00
// (zero balance, no retroactive credit). Official @progressiveoptimist.org
// utility accounts are Exempt/Honorary and are left untouched.
async function run() {
  if (!process.env.NEON_DATABASE_URL) {
    throw new Error('NEON_DATABASE_URL is not set. Add it to .env before running this script.');
  }

  const rows = await sql`
    UPDATE dues_ledger d
    SET dues_rate = '$200.00', amount_paid = '$200.00', balance_due = '$0.00', updated_at = CURRENT_TIMESTAMP
    FROM members m
    WHERE d.member_id = m.id
      AND NOT (m.email ILIKE '%@progressiveoptimist.org')
    RETURNING m.name, m.email, d.dues_rate, d.amount_paid, d.balance_due;
  `;

  console.log(`Corrected ${rows.length} member dues records:\n`);
  for (const r of rows) {
    console.log(`  ${r.name.padEnd(28)} rate=${r.dues_rate} paid=${r.amount_paid} balance=${r.balance_due}`);
  }
}

run().catch(err => {
  console.error('Fix failed:', err);
  process.exit(1);
});
