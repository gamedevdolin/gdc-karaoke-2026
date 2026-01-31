import Stripe from 'stripe';
import { neon } from '@neondatabase/serverless';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async (req, context) => {
  if (req.method !== 'POST') {
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

    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const origin = req.headers.get('origin') || 'https://gdckaraoke.gamedevdolin.com';

    // Create Stripe Checkout session for $0.50 test
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'General Admission - 1 Ticket (TEST)',
              description: 'Game Dev Karaoke 2026 - General Admission (TEST)',
              metadata: {
                roomId: 'test',
                isEntireRoom: 'false'
              }
            },
            unit_amount: 50, // $0.50 in cents (Stripe minimum)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}?success=true&session_id={CHECKOUT_SESSION_ID}&test=true`,
      cancel_url: `${origin}?canceled=true&test=true`,
      metadata: {
        roomId: 'test',
        roomName: 'Test Purchase',
        quantity: '1',
        unitPrice: '0.50',
        isEntireRoom: 'false',
        roomCapacity: '1',
        isTestPurchase: 'true'
      },
      customer_creation: 'always',
      billing_address_collection: 'auto',
      custom_fields: [
        {
          key: 'full_name',
          label: { type: 'custom', custom: 'Full Name' },
          type: 'text',
        },
        {
          key: 'company',
          label: { type: 'custom', custom: 'Company / Studio (optional)' },
          type: 'text',
          optional: true,
        },
      ],
    });

    // Create a pending test order in the database
    await sql`
      INSERT INTO orders (
        stripe_session_id,
        room_id,
        quantity,
        unit_price,
        total_amount,
        is_entire_room,
        payment_status,
        buyer_email
      ) VALUES (
        ${session.id},
        'test',
        1,
        0.50,
        0.50,
        false,
        'pending',
        ''
      )
    `;

    return new Response(JSON.stringify({
      success: true,
      sessionId: session.id,
      url: session.url
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Create test checkout error:', error);
    return new Response(JSON.stringify({ error: 'Server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: "/api/create-test-checkout"
};
