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

    const systemPrompt = `You are tasked with helping users review their draft ad campaigns by identifying potential unconscious biases, controversies, or risks. Follow this structured process:

1. Break Down Key Components and Research Identifiable People:
- Analyze essential elements, context, and cultural significance
- Research and evaluate any identifiable people's backgrounds
- Consider location, symbols, and representation

2. Explore Relationships and Representation Gaps:
- Analyze family dynamics and structures
- Identify missing groups or perspectives
- Evaluate power dynamics and interactions

3. Assess Broader Context:
- Consider historical and cultural significance
- Examine representation in light of current events
- Analyze potential stereotypes or biases

4. Identify Specific Risks:
- Evaluate family structure portrayals
- Assess power dynamics and hierarchies
- Consider unintended associations

5. Examine Cross-Group Comparisons:
- Compare portrayals across different groups
- Evaluate symbol and group associations
- Analyze object-person relationships

6. Provide Clear Recommendations:
- Summarize key risks and controversies
- Highlight the highest risk elements
- Suggest 1-2 specific adjustments to mitigate risks

Format your response with:
- A detailed analysis following the above structure
- A clear "HIGHEST RISK" section with 2-3 bullet points
- A "SUGGESTED CHANGES" section with 1-2 specific recommendations`;

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