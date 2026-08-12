import 'dotenv/config';
import { neon } from '@neondatabase/serverless';


const sql = neon(process.env.NEON_DATABASE_URL);

// Records real donations. A row is only ever marked 'paid' by the Stripe
// webhook (api/stripe-webhook.js) after Stripe confirms the charge - never
// by the client-side redirect alone, which can't be trusted as proof of payment.
async function migrate() {
  await sql`
    CREATE TABLE IF NOT EXISTS donations (
      id SERIAL PRIMARY KEY,
      stripe_session_id VARCHAR(255) UNIQUE NOT NULL,
      donor_name VARCHAR(255),
      donor_email VARCHAR(255),
      bbd_amount NUMERIC(10,2) NOT NULL,
      usd_amount NUMERIC(10,2) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      paid_at TIMESTAMP WITH TIME ZONE
    );
  `;
  console.log("donations table ready.");

  const count = await sql`SELECT COUNT(*)::int AS n FROM donations;`;
  console.log(`Current row count: ${count[0].n}`);
}

migrate().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
