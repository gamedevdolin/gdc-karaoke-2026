import { Resend } from 'resend';

export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { to, subject, html } = await req.json();

    if (!to || !subject || !html) {
      return new Response(JSON.stringify({ error: 'to, subject, and html are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromAddress = process.env.EMAIL_FROM || 'noreply@example.com';

    // Normalize to array, send as batch (one API call, individual emails)
    const recipients = Array.isArray(to) ? to : [to];

    const { error } = await resend.batch.send(
      recipients.map(recipient => ({
        from: fromAddress,
        to: [recipient],
        subject: subject,
        html: html,
      }))
    );

    if (error) {
      console.error('Resend batch error:', error);
      return new Response(JSON.stringify({ error: 'Failed to send emails', details: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Email sent to ${recipients.length} recipient(s)`,
      sent: recipients.length,
      failed: 0
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Send email error:', error);
    return new Response(JSON.stringify({ error: 'Server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: "/api/send-email"
};
