import Stripe from 'stripe';
import { sql } from '../lib/db.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
  // the client-side redirect back to /donate or /membership, which anyone
  // could fake by just visiting the URL with the right query string.
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const meta = session.metadata || {};

    try {
      if (meta.type === 'dues_payment') {
        const today = new Date().toISOString().split('T')[0];
        const fiscalYear = meta.fiscalYear || '2025/2026 (Oct 1 - Sep 30)';
        const bbdPaid = Number(meta.bbdAmount) || (session.amount_total / 100) * 2;
        const officialRate = Number(meta.officialRate) || 250;

        // One row per payment, so multiple partial payments accumulate
        // correctly instead of overwriting each other.
        await sql`
          INSERT INTO dues_payments (member_id, fiscal_year, amount_bbd, payment_method, stripe_session_id, paid_at)
          VALUES (${meta.memberId}, ${fiscalYear}, ${bbdPaid}, 'Card (Stripe)', ${session.id}, CURRENT_TIMESTAMP)
          ON CONFLICT (stripe_session_id) DO NOTHING;
        `;

        const totals = await sql`
          SELECT COALESCE(SUM(amount_bbd), 0)::numeric AS total
          FROM dues_payments
          WHERE member_id = ${meta.memberId} AND fiscal_year = ${fiscalYear};
        `;
        const totalPaid = Number(totals[0].total);

        // Not floored at zero - a negative balance is a real credit, not an
        // error, and should stay visible as one rather than being hidden.
        const balanceDue = officialRate - totalPaid;
        const duesStatus = balanceDue <= 0
          ? 'Active Member in Good Standing (2025/2026)'
          : 'Partial Payment - Balance Due (2025/2026)';
        const balanceDueStr = balanceDue < 0
          ? `-$${Math.abs(balanceDue).toFixed(2)}`
          : `$${balanceDue.toFixed(2)}`;

        const result = await sql`
          UPDATE dues_ledger
          SET
            dues_status = ${duesStatus},
            last_payment_date = ${today},
            amount_paid = ${'$' + totalPaid.toFixed(2)},
            balance_due = ${balanceDueStr},
            dues_rate = ${'$' + officialRate.toFixed(2)},
            payment_method = 'Card (Stripe)',
            updated_at = CURRENT_TIMESTAMP
          WHERE member_id = ${meta.memberId}
          RETURNING member_id;
        `;
        if (result.length === 0) {
          console.warn('Dues webhook: no dues_ledger row for member_id', meta.memberId);
        }
      } else {
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
      }
    } catch (err) {
      console.error('Failed to record payment:', err);
      return res.status(500).send('Database error');
    }
  }

  return res.status(200).json({ received: true });
}
