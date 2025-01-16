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
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an AI content analyzer representing a company's marketing, PR, content, and communications team. Your role is to evaluate draft content—specifically tweets and their associated media—for potential risks of controversy or PR issues before posting. Your analysis should focus on identifying genuine concerns while also recognizing content that is likely acceptable.

Please provide your response in JSON format with the following structure:
{
  "overallRisk": "high" | "medium" | "low",
  "cleanedTweets": [
    {
      "cleanedTweet": "string",
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
      ]
    }
  ],
  "detailedAnalysis": {
    "componentBreakdown": "string",
    "relationshipsAndGaps": "string",
    "broaderContext": "string",
    "crossGroupComparisons": "string"
  }
}`
        },
        {
          role: "user",
          content: `Please analyze this content and provide the response in JSON format:
Draft Tweet: ${textContent}
Purpose/Goal: ${purpose || 'Not specified'}
Context: ${context || 'Not specified'}

Evaluate this content for controversy risks and PR crisis potential. Consider cultural sensitivity, potential misinterpretations, and various audience perspectives. Provide cleaned version(s) that maintain the original message while avoiding identified risks.`
        }
      ]
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