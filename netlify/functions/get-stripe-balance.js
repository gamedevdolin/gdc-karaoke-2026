import Stripe from 'stripe';

export default async (req, context) => {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Check admin password
    const authHeader = req.headers.get('Authorization');
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Get the balance from Stripe
    const balance = await stripe.balance.retrieve();

    // Get total from charges (successful payments)
    const charges = await stripe.charges.list({
      limit: 100,
    });

    // Sum up all successful charge amounts
    let totalCharged = 0;
    let chargeCount = 0;
    let hasMore = true;
    let startingAfter = null;

    while (hasMore) {
      const params = { limit: 100 };
      if (startingAfter) params.starting_after = startingAfter;

      const batch = await stripe.charges.list(params);
      batch.data.forEach(charge => {
        if (charge.status === 'succeeded' && !charge.refunded) {
          totalCharged += charge.amount;
          chargeCount++;
        }
      });

      hasMore = batch.has_more;
      if (batch.data.length > 0) {
        startingAfter = batch.data[batch.data.length - 1].id;
      } else {
        hasMore = false;
      }
    }

    // Available balance (what can be paid out)
    const available = balance.available.reduce((sum, b) => sum + b.amount, 0);
    // Pending balance (in transit)
    const pending = balance.pending.reduce((sum, b) => sum + b.amount, 0);

    return new Response(JSON.stringify({
      success: true,
      balance: {
        available: available / 100, // Convert cents to dollars
        pending: pending / 100,
        totalCharged: totalCharged / 100,
        chargeCount: chargeCount,
        currency: balance.available[0]?.currency || 'usd'
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get Stripe balance error:', error);
    return new Response(JSON.stringify({ error: 'Server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: "/api/stripe-balance"
};
