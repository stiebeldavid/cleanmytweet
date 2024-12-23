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

    const { textContent, context } = await req.json();

    console.log('Analyzing content:', { textContent, context });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that helps users review their draft ad campaigns by identifying potential unconscious biases, controversies, or risks. Analyze the content and return a JSON response in the following exact format:

{
  "keyIssues": [
    {
      "title": "string",
      "severity": "high" | "medium" | "low",
      "description": "string"
    }
  ],
  "suggestedChanges": [
    {
      "title": "string",
      "details": "string"
    }
  ],
  "detailedAnalysis": {
    "componentBreakdown": "string",
    "relationshipsAndGaps": "string",
    "broaderContext": "string",
    "crossGroupComparisons": "string"
  }
}

Your response must be valid JSON. Do not include any markdown formatting, code blocks, or additional text outside of the JSON structure.`
        },
        {
          role: "user",
          content: `Please analyze this content:\n${textContent}\nContext: ${context}`
        }
      ],
      response_format: { type: "json_object" }
    });

    console.log('Received response from OpenAI');
    
    const analysis = completion.choices[0].message.content;
    console.log('Analysis:', analysis);

    // Parse the response to ensure it's valid JSON before sending
    const parsedAnalysis = JSON.parse(analysis);

    return new Response(
      JSON.stringify({ analysis: parsedAnalysis }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in analyze-content function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }), 
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});