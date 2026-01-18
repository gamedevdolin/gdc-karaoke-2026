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

    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    // Delete all orders (for testing purposes)
    const result = await sql`
      DELETE FROM orders
      RETURNING id
    `;

    // Reset all rooms to not booked
    await sql`
      UPDATE rooms SET booked = false, updated_at = NOW()
    `;

    return new Response(JSON.stringify({
      success: true,
      message: `Deleted ${result.length} orders and reset all room bookings`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Reset orders error:', error);
    return new Response(JSON.stringify({ error: 'Server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: "/api/reset-orders"
};
