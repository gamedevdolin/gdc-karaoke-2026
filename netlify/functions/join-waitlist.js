import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await req.json();
    const { roomId, roomName, email, fullName, quantity } = body;

    // Validate required fields
    if (!roomId || !roomName || !email || !fullName) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    // Check if this email is already on the waitlist for this room
    const existing = await sql`
      SELECT id FROM waitlist
      WHERE room_id = ${roomId} AND email = ${email.toLowerCase()}
    `;

    if (existing.length > 0) {
      return new Response(JSON.stringify({
        success: true,
        message: 'You are already on the waitlist for this room',
        alreadyOnList: true
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Add to waitlist
    await sql`
      INSERT INTO waitlist (room_id, room_name, email, full_name, quantity)
      VALUES (${roomId}, ${roomName}, ${email.toLowerCase()}, ${fullName}, ${quantity || 1})
    `;

    return new Response(JSON.stringify({
      success: true,
      message: 'Successfully joined the waitlist'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Join waitlist error:', error);
    return new Response(JSON.stringify({ error: 'Server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: "/api/join-waitlist"
};
