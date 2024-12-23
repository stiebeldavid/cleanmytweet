import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "your-email@example.com"; // Replace this with your email

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  type: 'content-analysis' | 'waitlist';
  data: {
    email?: string;
    content?: string;
    context?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data }: NotificationRequest = await req.json();

    let subject = '';
    let html = '';

    if (type === 'content-analysis') {
      subject = 'New Content Analysis Submission';
      html = `
        <h2>New Content Analysis Submission</h2>
        <p><strong>Content:</strong> ${data.content || 'N/A'}</p>
        <p><strong>Context:</strong> ${data.context || 'N/A'}</p>
      `;
    } else if (type === 'waitlist') {
      subject = 'New Waitlist Signup';
      html = `
        <h2>New Waitlist Signup</h2>
        <p><strong>Email:</strong> ${data.email}</p>
      `;
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Clairity <notifications@yourdomain.com>", // Update this with your verified domain
        to: [ADMIN_EMAIL],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to send email: ${await res.text()}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});