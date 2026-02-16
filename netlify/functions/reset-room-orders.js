import { neon } from '@neondatabase/serverless';

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

    const body = await req.json();
    const { roomId } = body;

    if (!roomId) {
      return new Response(JSON.stringify({ error: 'roomId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    // Delete all orders for this specific room
    const result = await sql`
      DELETE FROM orders
      WHERE room_id = ${roomId}
      RETURNING id
    `;

    // Reset booked status for this room
    await sql`
      UPDATE rooms SET booked = false, updated_at = NOW()
      WHERE room_id = ${roomId}
    `;

    return new Response(JSON.stringify({
      success: true,
      message: `Deleted ${result.length} order(s) and reset booking for room ${roomId}`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Reset room orders error:', error);
    return new Response(JSON.stringify({ error: 'Server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: "/api/reset-room-orders"
};
