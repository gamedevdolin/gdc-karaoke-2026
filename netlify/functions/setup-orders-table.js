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

    // Create orders table
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        stripe_session_id VARCHAR UNIQUE,
        stripe_payment_intent VARCHAR,
        room_id VARCHAR NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price INTEGER NOT NULL,
        total_amount INTEGER NOT NULL,
        buyer_name VARCHAR,
        buyer_email VARCHAR NOT NULL,
        is_entire_room BOOLEAN DEFAULT false,
        payment_status VARCHAR DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create index for faster lookups
    await sql`
      CREATE INDEX IF NOT EXISTS idx_orders_room_id ON orders(room_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_session_id)
    `;

    // Add buyer_company column if it doesn't exist
    await sql`
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS buyer_company VARCHAR
    `;

    return new Response(JSON.stringify({
      success: true,
      message: 'Orders table created/updated successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Setup orders table error:', error);
    return new Response(JSON.stringify({ error: 'Server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: "/api/setup-orders-table"
};
