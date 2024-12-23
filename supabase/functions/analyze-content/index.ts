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

    const { textContent, context, purpose } = await req.json();

    console.log('Analyzing content:', { textContent, context, purpose });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI content analyzer specializing in improving tweets while making them safer and more effective. 
          
Your task is to analyze the provided tweet and return a structured analysis that includes a cleaned/improved version of the tweet.

The cleaned tweet should:
1. Maintain the original message's intent
2. Remove potentially controversial elements
3. Improve clarity and impact
4. Stay within Twitter's character limit
5. Consider the provided context and purpose

Return your analysis in this exact JSON format:
{
  "cleanedTweet": "string (improved version of the tweet)",
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
}`
        },
        {
          role: "user",
          content: `Please analyze this tweet:
Tweet: ${textContent}
Purpose: ${purpose || 'Not specified'}
Context: ${context || 'Not specified'}`
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