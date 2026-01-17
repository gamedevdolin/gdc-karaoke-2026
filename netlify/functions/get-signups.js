import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  // Only allow GET
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Check admin password from header
    const authHeader = req.headers.get('Authorization');
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Connect to Neon database
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    // Get all signups
    const signups = await sql`
      SELECT id, name, email, company, room, room_name, reserve_entire_room, created_at
      FROM signups
      ORDER BY created_at DESC
    `;

    return new Response(JSON.stringify({
      success: true,
      signups: signups
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get signups error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: "/api/signups"
};
