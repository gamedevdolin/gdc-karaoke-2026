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

    // Normalize to array and send individually
    const recipients = Array.isArray(to) ? to : [to];
    const results = [];
    const errors = [];

    for (const recipient of recipients) {
      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: [recipient],
        subject: subject,
        html: html,
      });

      if (error) {
        console.error(`Resend error for ${recipient}:`, error);
        errors.push({ recipient, error: error.message });
      } else {
        results.push({ recipient, emailId: data?.id });
      }
    }

    if (results.length === 0) {
      return new Response(JSON.stringify({ error: 'Failed to send all emails', details: errors }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Email sent to ${results.length} recipient(s)${errors.length ? `, ${errors.length} failed` : ''}`,
      sent: results.length,
      failed: errors.length
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
