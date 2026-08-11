import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Barbados dollar has been pegged at BBD 2 = USD 1 since 1975.
const BBD_TO_USD = 0.5;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith('REPLACE_ME')) {
    return res.status(500).json({ success: false, message: 'Donations are not configured yet.' });
  }

  const { bbdAmount, donorName, donorEmail } = req.body || {};

  const amount = Number(bbdAmount);
  if (!Number.isFinite(amount) || amount < 5) {
    return res.status(400).json({ success: false, message: 'Donation amount must be at least $5 BBD.' });
  }
  if (!donorEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donorEmail)) {
    return res.status(400).json({ success: false, message: 'A valid email address is required.' });
  }

  const usdAmount = Math.round(amount * BBD_TO_USD * 100) / 100;
  const usdCents = Math.round(usdAmount * 100);

  try {
    const origin = req.headers.origin || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: donorEmail,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Donation to Progressive Optimist Club of Barbados',
            description: `$${amount.toFixed(2)} BBD (charged as $${usdAmount.toFixed(2)} USD)`
          },
          unit_amount: usdCents
        },
        quantity: 1
      }],
      metadata: {
        donorName: donorName || '',
        bbdAmount: amount.toFixed(2),
        usdAmount: usdAmount.toFixed(2)
      },
      success_url: `${origin}/donate?success=true&amount=${usdAmount.toFixed(2)}`,
      cancel_url: `${origin}/donate?canceled=true`
    });

    return res.status(200).json({ success: true, url: session.url });
  } catch (err) {
    console.error('create-checkout-session error:', err);
    return res.status(500).json({ success: false, message: 'Failed to start checkout. Please try again.' });
  }
}
