import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, data } = await req.json()

    if (type === 'waitlist') {
      const { email } = data
      console.log(`Processing waitlist signup for email: ${email}`)
      
      // Send email notification using Resend
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Content Analyzer <onboarding@resend.dev>',
          to: [ADMIN_EMAIL],
          subject: 'New Waitlist Signup',
          html: `
            <h2>New Waitlist Signup</h2>
            <p>A new user has joined the waitlist for the file upload feature:</p>
            <p><strong>Email:</strong> ${email}</p>
            <p>Time: ${new Date().toLocaleString()}</p>
          `,
        }),
      })

      if (!res.ok) {
        const error = await res.text()
        console.error('Error sending email:', error)
        throw new Error('Failed to send email notification')
      }

      console.log('Email notification sent successfully')

      return new Response(
        JSON.stringify({ message: 'Notification sent successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    throw new Error('Invalid notification type')
  } catch (error) {
    console.error('Error in send-notification function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})