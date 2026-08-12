import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Barbados dollar has been pegged at BBD 2 = USD 1 since 1975.
const BBD_TO_USD = 0.5;
const DEFAULT_DUES_BBD = 200;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith('REPLACE_ME')) {
    return res.status(500).json({ success: false, message: 'Dues payments are not configured yet.' });
  }

  const { memberId, memberName, memberEmail, bbdAmount, officialRate } = req.body || {};

  if (!memberId || !memberEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberEmail)) {
    return res.status(400).json({ success: false, message: 'Member ID and a valid email are required.' });
  }

  const amount = bbdAmount === undefined || bbdAmount === null || bbdAmount === ''
    ? DEFAULT_DUES_BBD
    : Number(bbdAmount);
  if (!Number.isFinite(amount) || amount < 5) {
    return res.status(400).json({ success: false, message: 'Dues amount must be at least $5 BBD.' });
  }

  // Captured now so the webhook computes the balance against the rate the
  // member actually saw, unaffected by a rate change between now and payment.
  const rateAtPayment = Number.isFinite(Number(officialRate)) && Number(officialRate) > 0
    ? Number(officialRate)
    : DEFAULT_DUES_BBD;

  const baseAmount = amount;
  const stripeFeeRate = 0.0375; // 3.75%
  const feeBBD = Math.round(baseAmount * stripeFeeRate * 100) / 100;
  const totalBBD = baseAmount + feeBBD;

  const usdBase = Math.round(baseAmount * BBD_TO_USD * 100) / 100;
  const usdBaseCents = Math.round(usdBase * 100);

  const usdFee = Math.round(feeBBD * BBD_TO_USD * 100) / 100;
  const usdFeeCents = Math.round(usdFee * 100);

  const usdTotal = Math.round(totalBBD * BBD_TO_USD * 100) / 100;

  try {
    const origin = req.headers.origin || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: memberEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Progressive Optimist Club of Barbados - Annual Dues (2025/2026)',
              description: `Base dues credit applied to member ledger ($${baseAmount.toFixed(2)} BBD / $${usdBase.toFixed(2)} USD)`
            },
            unit_amount: usdBaseCents
          },
          quantity: 1
        },
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Credit Card Processing Fee (3.75%)',
              description: `Stripe merchant card fee ($${feeBBD.toFixed(2)} BBD / $${usdFee.toFixed(2)} USD)`
            },
            unit_amount: usdFeeCents
          },
          quantity: 1
        }
      ],
      metadata: {
        type: 'dues_payment',
        memberId,
        memberName: memberName || '',
        fiscalYear: '2025/2026 (Oct 1 - Sep 30)',
        bbdAmount: baseAmount.toFixed(2),
        feeBBD: feeBBD.toFixed(2),
        totalBBD: totalBBD.toFixed(2),
        usdAmount: usdTotal.toFixed(2),
        officialRate: rateAtPayment.toFixed(2)
      },
      success_url: `${origin}/membership?duesPaid=true&amount=${baseAmount.toFixed(2)}`,
      cancel_url: `${origin}/membership?duesCanceled=true`
    });

    return res.status(200).json({ success: true, url: session.url });
  } catch (err) {
    console.error('create-dues-checkout-session error:', err);
    return res.status(500).json({ success: false, message: 'Failed to start checkout. Please try again.' });
  }
}
