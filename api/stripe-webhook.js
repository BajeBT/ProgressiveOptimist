import Stripe from 'stripe';
import { neon } from '@neondatabase/serverless';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const sql = neon("postgresql://neondb_owner:npg_g3Y2MVzbDSrn@ep-cold-bird-axj0in93-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require");

// Stripe signature verification needs the exact raw request bytes - Vercel's
// default JSON body parsing would re-serialize the payload and break the
// signature check, so it's disabled for this route only.
export const config = {
  api: {
    bodyParser: false
  }
};

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const signature = req.headers['stripe-signature'];
  let event;

  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Only checkout.session.completed is treated as proof of payment - never
  // the client-side redirect back to /donate, which anyone could fake.
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const meta = session.metadata || {};

    try {
      await sql`
        INSERT INTO donations (stripe_session_id, donor_name, donor_email, bbd_amount, usd_amount, status, paid_at)
        VALUES (
          ${session.id},
          ${meta.donorName || null},
          ${session.customer_details?.email || session.customer_email || null},
          ${Number(meta.bbdAmount) || 0},
          ${Number(meta.usdAmount) || (session.amount_total / 100)},
          'paid',
          CURRENT_TIMESTAMP
        )
        ON CONFLICT (stripe_session_id) DO NOTHING;
      `;
    } catch (err) {
      console.error('Failed to record donation:', err);
      return res.status(500).send('Database error');
    }
  }

  return res.status(200).json({ received: true });
}
