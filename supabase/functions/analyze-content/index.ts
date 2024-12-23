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
          content: `You are an AI content analyzer specializing in identifying potential biases, controversies, and risks in ad campaigns and content. 

Your task is to analyze the provided content and return a structured analysis in a strict JSON format.

Required JSON structure:
{
  "keyIssues": [
    {
      "title": "string (50 chars max)",
      "severity": "high" | "medium" | "low",
      "description": "string (200 chars max)"
    }
  ],
  "suggestedChanges": [
    {
      "title": "string (50 chars max)",
      "details": "string (200 chars max)"
    }
  ],
  "detailedAnalysis": {
    "componentBreakdown": "string (300 chars max)",
    "relationshipsAndGaps": "string (300 chars max)",
    "broaderContext": "string (300 chars max)",
    "crossGroupComparisons": "string (300 chars max)"
  }
}

Important rules:
1. Return ONLY valid JSON - no markdown, no code blocks, no additional text
2. Always include all fields in the structure, even if empty
3. Respect the maximum character limits for each field
4. Use "severity" values strictly from: "high", "medium", "low"
5. If no issues are found, return an empty array for keyIssues
6. If no changes are needed, return an empty array for suggestedChanges
7. Never use line breaks within strings`
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