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
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    const { textContent, context, fileContent } = await req.json();

    // Create a thread
    const thread = await openai.beta.threads.create();

    // Add messages to the thread
    let messageContent = "Please analyze this content for potential controversy:\n\n";
    if (textContent) messageContent += `Text Content: ${textContent}\n\n`;
    if (context) messageContent += `Context: ${context}\n\n`;
    if (fileContent) messageContent += `File Content: ${fileContent}\n\n`;

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: messageContent,
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: Deno.env.get('OPENAI_ASSISTANT_ID'),
    });

    // Wait for the run to complete
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status !== "completed") {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      
      if (runStatus.status === "failed") {
        throw new Error("Assistant run failed");
      }
    }

    // Get the messages
    const messages = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messages.data[0];

    return new Response(JSON.stringify({ 
      analysis: lastMessage.content[0].text.value 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});