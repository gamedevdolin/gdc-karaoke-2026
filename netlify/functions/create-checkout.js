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
    const body = await req.json();
    const { roomId, roomName, quantity, unitPrice, isEntireRoom, roomCapacity } = body;

    if (!roomId || !roomName || !quantity || !unitPrice) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    // Check current availability
    const orders = await sql`
      SELECT COALESCE(SUM(quantity), 0) as booked_count
      FROM orders
      WHERE room_id = ${roomId}
      AND payment_status = 'paid'
    `;

    const bookedCount = parseInt(orders[0]?.booked_count || 0);
    const availableSpots = roomCapacity - bookedCount;

    // Check if room is already fully booked by someone reserving the entire room
    const entireRoomOrders = await sql`
      SELECT id FROM orders
      WHERE room_id = ${roomId}
      AND is_entire_room = true
      AND payment_status = 'paid'
      LIMIT 1
    `;

    if (entireRoomOrders.length > 0) {
      return new Response(JSON.stringify({
        error: 'This room has already been reserved',
        availableSpots: 0
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (quantity > availableSpots) {
      return new Response(JSON.stringify({
        error: `Only ${availableSpots} spots available`,
        availableSpots
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Build the product description
    const totalAmount = unitPrice * (isEntireRoom ? 1 : quantity);
    let productName = isEntireRoom
      ? `${roomName} - Entire Room (up to ${roomCapacity} guests)`
      : `${roomName} - ${quantity} ${quantity === 1 ? 'Ticket' : 'Tickets'}`;

    const origin = req.headers.get('origin') || 'https://karaoke.gamedevdolin.com';

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
              description: `Game Dev Karaoke 2026 - ${roomName}`,
              metadata: {
                roomId,
                isEntireRoom: isEntireRoom ? 'true' : 'false'
              }
            },
            unit_amount: totalAmount * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}?success=true&session_id={CHECKOUT_SESSION_ID}&room=${roomId}&qty=${isEntireRoom ? roomCapacity : quantity}&entire=${isEntireRoom ? '1' : '0'}`,
      cancel_url: `${origin}?canceled=true&room=${roomId}`,
      metadata: {
        roomId,
        roomName,
        quantity: quantity.toString(),
        unitPrice: unitPrice.toString(),
        isEntireRoom: isEntireRoom ? 'true' : 'false',
        roomCapacity: roomCapacity.toString()
      },
      // Allow Stripe promotion codes
      allow_promotion_codes: true,
      // Collect customer info
      customer_creation: 'always',
      billing_address_collection: 'auto',
      // Custom fields for name and company
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

    // Create a pending order in the database
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
        ${roomId},
        ${isEntireRoom ? roomCapacity : quantity},
        ${unitPrice},
        ${totalAmount},
        ${isEntireRoom},
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
    console.error('Create checkout error:', error);
    return new Response(JSON.stringify({ error: 'Server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: "/api/create-checkout"
};
