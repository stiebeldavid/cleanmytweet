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
    console.log('OpenAI client initialized with v2 headers');

    const { textContent, context, fileContent } = await req.json();
    console.log('Received content:', { 
      hasTextContent: Boolean(textContent), 
      hasContext: Boolean(context), 
      hasFileContent: Boolean(fileContent) 
    });

    // Create a thread
    console.log('Creating new thread');
    const thread = await openai.beta.threads.create();
    console.log('Thread created:', thread.id);

    // Add messages to the thread
    let messageContent = "Please analyze this content for potential controversy:\n\n";
    if (textContent) messageContent += `Text Content: ${textContent}\n\n`;
    if (context) messageContent += `Context: ${context}\n\n`;
    if (fileContent) messageContent += `File Content: ${fileContent}\n\n`;

    console.log('Adding message to thread');
    const message = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: messageContent,
    });
    console.log('Message added:', message.id);

    // Run the assistant
    console.log('Starting assistant run');
    const assistantId = Deno.env.get('OPENAI_ASSISTANT_ID');
    console.log('Using assistant ID:', assistantId);
    
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    });
    console.log('Run created:', run.id);

    // Wait for the run to complete
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    console.log('Initial run status:', runStatus.status);
    
    while (runStatus.status !== "completed") {
      if (runStatus.status === "failed") {
        console.error('Run failed:', runStatus.last_error);
        throw new Error(`Assistant run failed: ${runStatus.last_error?.message}`);
      }
      if (runStatus.status === "requires_action") {
        console.log('Run requires action:', runStatus.required_action);
        throw new Error('Assistant run requires action - not implemented');
      }
      
      console.log('Waiting for run completion. Current status:', runStatus.status);
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }
    console.log('Run completed successfully');

    // Get the messages
    console.log('Retrieving messages');
    const messages = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messages.data[0];
    console.log('Retrieved last message:', lastMessage.id);

    return new Response(JSON.stringify({ 
      analysis: lastMessage.content[0].text.value 
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