import { neon } from '@neondatabase/serverless';

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

    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    // Get all orders (including archived)
    const orders = await sql`
      SELECT
        id,
        stripe_session_id,
        room_id,
        quantity,
        unit_price,
        total_amount,
        buyer_name,
        buyer_email,
        buyer_company,
        is_entire_room,
        payment_status,
        created_at
      FROM orders
      ORDER BY created_at DESC
    `;

    // Get archived orders separately for admin display
    const archivedOrders = orders.filter(o => o.payment_status === 'archived');

    // Get summary stats
    const stats = await sql`
      SELECT
        COUNT(*) FILTER (WHERE payment_status = 'paid') as paid_count,
        COUNT(*) FILTER (WHERE payment_status = 'pending') as pending_count,
        COALESCE(SUM(total_amount) FILTER (WHERE payment_status = 'paid'), 0) as total_revenue,
        COALESCE(SUM(quantity) FILTER (WHERE payment_status = 'paid'), 0) as total_tickets
      FROM orders
    `;

    return new Response(JSON.stringify({
      success: true,
      orders: orders,
      archivedOrders: archivedOrders,
      stats: stats[0]
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: "/api/orders"
};
