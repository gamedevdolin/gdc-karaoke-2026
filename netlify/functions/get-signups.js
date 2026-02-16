import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';

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
      // Send failed login alert — must await before returning or Netlify kills the process
      const resendKey = process.env.RESEND_API_KEY;
      const notifyEmail = process.env.ADMIN_NOTIFY_EMAIL || process.env.EMAIL_FROM;
      const fromEmail = process.env.EMAIL_FROM;

      console.log('Failed admin login attempt. Resend configured:', !!resendKey, 'notifyEmail:', !!notifyEmail, 'fromEmail:', fromEmail);

      if (resendKey && notifyEmail && fromEmail) {
        try {
          const resend = new Resend(resendKey);
          const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
          const timestamp = new Date().toISOString();

          const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: notifyEmail,
            subject: 'Failed Admin Login Attempt - GDC Karaoke',
            html: `<p>Someone attempted to access the admin panel with an incorrect password.</p><p><strong>Time:</strong> ${timestamp}<br><strong>IP:</strong> ${ip}</p>`,
          });

          if (error) {
            console.error('Resend error:', JSON.stringify(error));
          } else {
            console.log('Login alert sent:', data?.id);
          }
        } catch (err) {
          console.error('Failed to send login alert:', err);
        }
      }

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
