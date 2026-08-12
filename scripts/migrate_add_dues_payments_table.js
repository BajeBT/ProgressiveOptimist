import { neon } from '@neondatabase/serverless';

const NEON_DB_URL = "postgresql://neondb_owner:npg_g3Y2MVzbDSrn@ep-cold-bird-axj0in93-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require";
const sql = neon(NEON_DB_URL);

// Individual dues payment records. dues_ledger.amount_paid/balance_due become
// derived from summing these rather than a single overwritable field, so
// multiple partial payments toward the same fiscal year accumulate correctly.
async function migrate() {
  await sql`
    CREATE TABLE IF NOT EXISTS dues_payments (
      id SERIAL PRIMARY KEY,
      member_id VARCHAR(50) REFERENCES members(id) ON DELETE CASCADE,
      fiscal_year VARCHAR(50) NOT NULL,
      amount_bbd NUMERIC(10,2) NOT NULL,
      payment_method VARCHAR(100) NOT NULL,
      stripe_session_id VARCHAR(255) UNIQUE,
      paid_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  console.log("dues_payments table ready.");

  const count = await sql`SELECT COUNT(*)::int AS n FROM dues_payments;`;
  console.log(`Current row count: ${count[0].n}`);
}

migrate().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
