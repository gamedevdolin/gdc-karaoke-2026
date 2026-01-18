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

    // Get all paid orders grouped by room
    const orders = await sql`
      SELECT
        room_id,
        COALESCE(SUM(quantity), 0) as booked_count,
        bool_or(is_entire_room) as has_entire_room_booking
      FROM orders
      WHERE payment_status = 'paid'
      GROUP BY room_id
    `;

    // Get room booked status
    const rooms = await sql`
      SELECT room_id, booked, name, price, room_price
      FROM rooms
    `;

    // Build response
    const availability = {};

    // First, add room data
    rooms.forEach(room => {
      availability[room.room_id] = {
        booked: room.booked,
        name: room.name,
        price: room.price,
        roomPrice: room.room_price,
        bookedCount: 0,
        hasEntireRoomBooking: false
      };
    });

    // Then add order counts
    orders.forEach(order => {
      if (availability[order.room_id]) {
        availability[order.room_id].bookedCount = parseInt(order.booked_count);
        availability[order.room_id].hasEntireRoomBooking = order.has_entire_room_booking;
      } else {
        availability[order.room_id] = {
          booked: false,
          name: null,
          price: null,
          roomPrice: null,
          bookedCount: parseInt(order.booked_count),
          hasEntireRoomBooking: order.has_entire_room_booking
        };
      }
    });

    return new Response(JSON.stringify({
      success: true,
      rooms: availability
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get room availability error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: "/api/room-availability"
};
