import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Barbados dollar has been pegged at BBD 2 = USD 1 since 1975.
const DUES_BBD = 250;
const DUES_USD = 125;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith('REPLACE_ME')) {
    return res.status(500).json({ success: false, message: 'Dues payments are not configured yet.' });
  }

  const { memberId, memberName, memberEmail } = req.body || {};

  if (!memberId || !memberEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberEmail)) {
    return res.status(400).json({ success: false, message: 'Member ID and a valid email are required.' });
  }

  try {
    const origin = req.headers.origin || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: memberEmail,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Progressive Optimist Club of Barbados - Annual Dues (2025/2026)',
            description: `$${DUES_BBD.toFixed(2)} BBD (charged as $${DUES_USD.toFixed(2)} USD)`
          },
          unit_amount: DUES_USD * 100
        },
        quantity: 1
      }],
      metadata: {
        type: 'dues_payment',
        memberId,
        memberName: memberName || '',
        fiscalYear: '2025/2026 (Oct 1 - Sep 30)'
      },
      success_url: `${origin}/membership?duesPaid=true`,
      cancel_url: `${origin}/membership?duesCanceled=true`
    });

    return res.status(200).json({ success: true, url: session.url });
  } catch (err) {
    console.error('create-dues-checkout-session error:', err);
    return res.status(500).json({ success: false, message: 'Failed to start checkout. Please try again.' });
  }
}
