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
      apiKey: Deno.env.get('OPENAI_API_KEY'),
      defaultHeaders: {
        'OpenAI-Beta': 'assistants=v2'
      }
    });

    const assistantId = Deno.env.get('OPENAI_ASSISTANT_ID');
    if (!assistantId) {
      throw new Error('Assistant ID not configured');
    }

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

    console.log('Creating thread with initial message');
    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: "user",
          content: `Please analyze this content for potential controversy:\n${contentToAnalyze}`
        }
      ]
    });

    console.log('Creating run with assistant');
    const run = await openai.beta.threads.runs.create(
      thread.id,
      { assistant_id: assistantId }
    );

    // Poll for completion
    let analysis = '';
    while (true) {
      const runStatus = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id
      );
      console.log('Run status:', runStatus.status);
      
      if (runStatus.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(thread.id);
        // Get the assistant's response (last message)
        const assistantMessage = messages.data.find(msg => msg.role === 'assistant');
        if (assistantMessage && assistantMessage.content[0].type === 'text') {
          analysis = assistantMessage.content[0].text.value;
        }
        break;
      } else if (runStatus.status === 'failed' || runStatus.status === 'expired') {
        throw new Error(`Run ${runStatus.status}: ${runStatus.last_error?.message || 'Unknown error'}`);
      } else if (runStatus.status === 'requires_action') {
        throw new Error('Run requires action - this should not happen with our current assistant configuration');
      }
      
      // Wait before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('Analysis completed successfully');
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