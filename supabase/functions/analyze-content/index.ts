import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.24.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY')
    });

    const { textContent, context, fileContent } = await req.json();

    const contentToAnalyze = `
      ${textContent ? `Content: ${textContent}\n` : ''}
      ${context ? `Context: ${context}\n` : ''}
      ${fileContent ? `File Content: ${fileContent}\n` : ''}
    `;

    const systemPrompt = `You are tasked with helping users review their draft ad campaigns by identifying potential unconscious biases, controversies, or risks. Follow the structured analysis process as before, but format your response as a JSON object with the following structure:

{
  "keyIssues": [
    {
      "title": "Brief title of the issue",
      "severity": "high|medium|low",
      "description": "Detailed explanation of the issue"
    }
  ],
  "suggestedChanges": [
    {
      "title": "Brief description of the suggested change",
      "details": "Detailed explanation of how to implement the change and why it would help"
    }
  ],
  "detailedAnalysis": {
    "componentBreakdown": "Analysis of key components and identifiable people",
    "relationshipsAndGaps": "Analysis of relationships and representation gaps",
    "broaderContext": "Assessment of broader context",
    "crossGroupComparisons": "Analysis of cross-group comparisons"
  }
}

Ensure your response is valid JSON and follows this exact structure. Each section should be thorough but concise.`;

    console.log('Making request to OpenAI Chat Completions API');
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Please analyze this content for potential controversy:\n${contentToAnalyze}`
        }
      ]
    });

    console.log('Received response from OpenAI');
    const analysis = completion.choices[0].message.content;

    // Parse the response to ensure it's valid JSON
    const parsedAnalysis = JSON.parse(analysis);

    return new Response(JSON.stringify({ 
      analysis: parsedAnalysis 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-content function:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});