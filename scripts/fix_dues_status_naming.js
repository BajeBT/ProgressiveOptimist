import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEON_DATABASE_URL);

// "Active Member (2025/2026)" and "Active Member in Good Standing" were
// treated identically everywhere in the app (both just needed to contain
// "Active") - the only real difference was which payment channel set them
// (Treasurer-recorded vs. Stripe), information already captured separately
// by payment_method. Merges both into one status. Also gives "Pending Dues
// Payment" and "Partial Payment - Balance Due" clearer, parallel names that
// make the zero-paid vs. some-paid distinction obvious at a glance.
const RENAMES = [
  { from: 'Active Member (2025/2026)', to: 'Active Member (Dues Paid)' },
  { from: 'Active Member in Good Standing (2025/2026)', to: 'Active Member (Dues Paid)' },
  { from: 'Active Member in Good Standing', to: 'Active Member (Dues Paid)' },
  { from: 'Pending Dues Payment', to: 'Unpaid (Dues Owed)' },
  { from: 'Partial Payment - Balance Due (2025/2026)', to: 'Partially Paid (Balance Due)' },
  { from: 'Partial Payment - Balance Due', to: 'Partially Paid (Balance Due)' }
];

async function run() {
  if (!process.env.NEON_DATABASE_URL) {
    throw new Error('NEON_DATABASE_URL is not set. Add it to .env before running this script.');
  }

  for (const r of RENAMES) {
    const rows = await sql`
      UPDATE dues_ledger SET dues_status = ${r.to}, updated_at = CURRENT_TIMESTAMP
      WHERE dues_status = ${r.from}
      RETURNING member_id;
    `;
    if (rows.length > 0) {
      console.log(`RENAMED  "${r.from}" -> "${r.to}" (${rows.length} record(s))`);
    }
  }

  const remaining = await sql`SELECT DISTINCT dues_status FROM dues_ledger ORDER BY dues_status;`;
  console.log('\nAll distinct dues_status values now in use:');
  for (const row of remaining) {
    console.log(`  ${row.dues_status}`);
  }
}

run().catch(err => {
  console.error('Fix failed:', err);
  process.exit(1);
});
