import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    // Get all room data
    const rooms = await sql`
      SELECT room_id, booked, name, price, room_price
      FROM rooms
    `;

    // Convert to object keyed by room_id
    const roomStatus = {};
    rooms.forEach(room => {
      roomStatus[room.room_id] = {
        booked: room.booked,
        name: room.name,
        price: room.price,
        roomPrice: room.room_price
      };
    });

    return new Response(JSON.stringify({
      success: true,
      rooms: roomStatus
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get rooms error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: "/api/rooms"
};
