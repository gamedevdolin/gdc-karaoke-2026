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
    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    let event;

    // If webhook secret is configured, verify the signature
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
      } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return new Response(JSON.stringify({ error: 'Invalid signature' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } else {
      // For testing without webhook secret
      event = JSON.parse(body);
    }

    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;

        // Update the order with payment info
        await sql`
          UPDATE orders
          SET
            payment_status = 'paid',
            stripe_payment_intent = ${session.payment_intent},
            buyer_email = ${session.customer_details?.email || ''},
            buyer_name = ${session.customer_details?.name || ''},
            updated_at = NOW()
          WHERE stripe_session_id = ${session.id}
        `;

        // Check if this was an entire room purchase and mark room as booked
        const metadata = session.metadata || {};
        if (metadata.isEntireRoom === 'true') {
          await sql`
            INSERT INTO rooms (room_id, booked)
            VALUES (${metadata.roomId}, true)
            ON CONFLICT (room_id)
            DO UPDATE SET booked = true, updated_at = NOW()
          `;
        } else {
          // Check if room is now at capacity
          const orders = await sql`
            SELECT COALESCE(SUM(quantity), 0) as booked_count
            FROM orders
            WHERE room_id = ${metadata.roomId}
            AND payment_status = 'paid'
          `;

          const bookedCount = parseInt(orders[0]?.booked_count || 0);
          const roomCapacity = parseInt(metadata.roomCapacity || 0);

          if (bookedCount >= roomCapacity) {
            await sql`
              INSERT INTO rooms (room_id, booked)
              VALUES (${metadata.roomId}, true)
              ON CONFLICT (room_id)
              DO UPDATE SET booked = true, updated_at = NOW()
            `;
          }
        }

        console.log(`Payment completed for session ${session.id}`);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;

        // Mark the order as expired/canceled
        await sql`
          UPDATE orders
          SET payment_status = 'expired', updated_at = NOW()
          WHERE stripe_session_id = ${session.id}
        `;

        console.log(`Session expired: ${session.id}`);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;

        // Mark order as failed
        await sql`
          UPDATE orders
          SET payment_status = 'failed', updated_at = NOW()
          WHERE stripe_payment_intent = ${paymentIntent.id}
        `;

        console.log(`Payment failed: ${paymentIntent.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: 'Webhook handler failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: "/api/stripe-webhook"
};
