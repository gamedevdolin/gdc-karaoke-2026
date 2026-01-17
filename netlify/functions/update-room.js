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
    const { roomId, booked, name, price, roomPrice } = body;

    if (!roomId) {
      return new Response(JSON.stringify({ error: 'roomId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    // Upsert room data (insert or update)
    await sql`
      INSERT INTO rooms (room_id, booked, name, price, room_price)
      VALUES (${roomId}, ${booked ?? false}, ${name ?? null}, ${price ?? null}, ${roomPrice ?? null})
      ON CONFLICT (room_id)
      DO UPDATE SET
        booked = COALESCE(${booked}, rooms.booked),
        name = COALESCE(${name}, rooms.name),
        price = COALESCE(${price}, rooms.price),
        room_price = COALESCE(${roomPrice}, rooms.room_price),
        updated_at = NOW()
    `;

    return new Response(JSON.stringify({
      success: true,
      message: 'Room updated'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Update room error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: "/api/update-room"
};
