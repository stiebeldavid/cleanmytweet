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
      messages: [
        {
          role: "system",
          content: `You are an AI content analyzer representing a company's marketing, PR, content, and communications team. Your role is to evaluate draft content—specifically tweets and their associated media—for potential risks of controversy or PR issues before posting. Your analysis should focus on identifying genuine concerns while also recognizing content that is likely acceptable.

Key Instructions:
Risk Assessment: Assess the risk of potential backlash based on the following factors, rating each as low, medium, or high in terms of contribution to overall risk:
- Societal and cultural sensitivities
- Historical events or backgrounds
- Individuals involved and their personal backgrounds, including public perceptions related to ethnicity, culture, or politics
- Company history and industry context
- Relevant past controversies involving similar companies (with links for verification)
- Any other pertinent factors

Content Evaluation: Consider the following elements in your analysis:
- Content of the tweet (text)
- Uploaded images (if provided)
- Goal or purpose of the tweet
- Context or additional information provided

Additional Guidance:
- If you determine that the content is likely acceptable with no significant issues, clearly state this in your response without highlighting irrelevant concerns.
- Focus on constructive feedback that enhances understanding and improves the content where necessary.

Return your analysis in this exact JSON format:
{
  "cleanedTweet": "string (an improved version that addresses any identified issues while maintaining the original intent)",
  "keyIssues": [
    {
      "title": "string (50 chars max, e.g., 'Cultural Sensitivity')",
      "severity": "high" | "medium" | "low",
      "description": "string (200 chars max, detailed explanation of the issue)"
    }
  ],
  "suggestedChanges": [
    {
      "title": "string (50 chars max, e.g., 'Rephrase Cultural Reference')",
      "details": "string (200 chars max, specific suggestion for improvement)"
    }
  ],
  "detailedAnalysis": {
    "componentBreakdown": "string (300 chars max, analysis of key components and their potential impact)",
    "relationshipsAndGaps": "string (300 chars max, analysis of how different elements interact and potential gaps in understanding)",
    "broaderContext": "string (300 chars max, how the content might be perceived in different contexts)",
    "crossGroupComparisons": "string (300 chars max, how different audience segments might interpret the content)"
  }
}`
        },
        {
          role: "user",
          content: `Please analyze this content:
Draft Tweet: ${textContent}
Purpose/Goal: ${purpose || 'Not specified'}
Context: ${context || 'Not specified'}

Evaluate this content for controversy risks and PR crisis potential. Consider cultural sensitivity, potential misinterpretations, and various audience perspectives. Provide a cleaned version that maintains the original message while avoiding identified risks.`
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