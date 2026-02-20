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

    // Normalize to array and send all in parallel
    const recipients = Array.isArray(to) ? to : [to];

    const settled = await Promise.allSettled(
      recipients.map(recipient =>
        resend.emails.send({
          from: fromAddress,
          to: [recipient],
          subject: subject,
          html: html,
        })
      )
    );

    const results = [];
    const errors = [];
    settled.forEach((result, i) => {
      if (result.status === 'fulfilled' && !result.value.error) {
        results.push({ recipient: recipients[i], emailId: result.value.data?.id });
      } else {
        const errMsg = result.status === 'rejected' ? result.reason?.message : result.value.error?.message;
        console.error(`Resend error for ${recipients[i]}:`, errMsg);
        errors.push({ recipient: recipients[i], error: errMsg });
      }
    });

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
