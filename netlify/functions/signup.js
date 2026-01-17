import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await req.json();
    const { name, email, company, room, roomName, reserveEntireRoom } = body;

    // Validate required fields
    if (!name || !email) {
      return new Response(JSON.stringify({ error: 'Name and email are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Connect to Neon database
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    // Insert signup
    const result = await sql`
      INSERT INTO signups (name, email, company, room, room_name, reserve_entire_room)
      VALUES (${name}, ${email}, ${company || null}, ${room || null}, ${roomName || null}, ${reserveEntireRoom || false})
      RETURNING id, created_at
    `;

    return new Response(JSON.stringify({
      success: true,
      message: 'Signup successful',
      id: result[0].id
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Signup error:', error);

    // Check for duplicate email (if you add a unique constraint later)
    if (error.code === '23505') {
      return new Response(JSON.stringify({ error: 'This email is already registered' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Server error. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: "/api/signup"
};
