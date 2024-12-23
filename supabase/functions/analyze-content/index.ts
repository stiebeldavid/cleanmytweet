import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.24.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Received request to analyze-content function');
  
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Initializing OpenAI client');
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY')
    });

    const { textContent, context, fileContent } = await req.json();
    console.log('Received content:', { 
      hasTextContent: Boolean(textContent), 
      hasContext: Boolean(context), 
      hasFileContent: Boolean(fileContent) 
    });

    // Prepare the content for analysis
    const contentToAnalyze = `
      ${textContent ? `Content: ${textContent}\n` : ''}
      ${context ? `Context: ${context}\n` : ''}
      ${fileContent ? `File Content: ${fileContent}\n` : ''}
    `;

    console.log('Making request to OpenAI Chat Completions API');
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that analyzes content for potential controversy or sensitive topics. Provide clear, detailed feedback about any concerning elements and suggest improvements if needed."
        },
        {
          role: "user",
          content: `Please analyze this content for potential controversy:\n${contentToAnalyze}`
        }
      ]
    });

    console.log('Received response from OpenAI');
    const analysis = completion.choices[0].message.content;

    return new Response(JSON.stringify({ 
      analysis 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-content function:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return new Response(JSON.stringify({ 
      error: error.message,
      details: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});