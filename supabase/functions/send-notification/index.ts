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

    if (type === 'content-analysis') {
      const { content, context, analysis } = data
      console.log('Processing content analysis notification')

      // Format the analysis results in a more readable way
      const formatAnalysis = (analysis: any) => {
        if (!analysis) return 'No analysis results available';

        let html = '<h3>Analysis Results:</h3>';

        // Key Issues
        if (analysis.keyIssues?.length > 0) {
          html += '<h4>Key Issues:</h4><ul>';
          analysis.keyIssues.forEach((issue: any) => {
            html += `<li><strong>${issue.title}</strong> (${issue.severity})<br>${issue.description}</li>`;
          });
          html += '</ul>';
        }

        // Suggested Changes
        if (analysis.suggestedChanges?.length > 0) {
          html += '<h4>Suggested Changes:</h4><ul>';
          analysis.suggestedChanges.forEach((change: any) => {
            html += `<li><strong>${change.title}</strong><br>${change.details}</li>`;
          });
          html += '</ul>';
        }

        // Detailed Analysis
        if (analysis.detailedAnalysis) {
          html += '<h4>Detailed Analysis:</h4>';
          html += `<p><strong>Component Breakdown:</strong><br>${analysis.detailedAnalysis.componentBreakdown}</p>`;
          html += `<p><strong>Relationships & Gaps:</strong><br>${analysis.detailedAnalysis.relationshipsAndGaps}</p>`;
          html += `<p><strong>Broader Context:</strong><br>${analysis.detailedAnalysis.broaderContext}</p>`;
          html += `<p><strong>Cross-Group Comparisons:</strong><br>${analysis.detailedAnalysis.crossGroupComparisons}</p>`;
        }

        return html;
      };

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
          subject: 'New Content Analysis Submission',
          html: `
            <h2>New Content Analysis Submission</h2>
            <p>Time: ${new Date().toLocaleString()}</p>
            
            <h3>Submitted Content:</h3>
            <p style="white-space: pre-wrap; background: #f5f5f5; padding: 1em; border-radius: 4px;">${content || '(No content provided)'}</p>
            
            <h3>Context:</h3>
            <p style="white-space: pre-wrap; background: #f5f5f5; padding: 1em; border-radius: 4px;">${context || '(No context provided)'}</p>
            
            ${formatAnalysis(analysis)}
          `,
        }),
      })

      if (!res.ok) {
        const error = await res.text()
        console.error('Error sending email:', error)
        throw new Error('Failed to send email notification')
      }

      console.log('Content analysis notification sent successfully')

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