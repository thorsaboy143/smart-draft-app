const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { position, company, existingBullets } = await req.json();
    const AI_API_KEY = Deno.env.get('AI_API_KEY');
    const AI_BASE_URL = Deno.env.get('AI_BASE_URL') ?? 'https://api.openai.com/v1/chat/completions';
    const AI_MODEL = Deno.env.get('AI_MODEL') ?? 'gpt-4o-mini';
    
    if (!AI_API_KEY) {
      throw new Error('AI_API_KEY is not configured');
    }

    console.log('Generating bullets for:', position, 'at', company);

    const systemPrompt = `You are an expert resume writer specializing in creating impactful, ATS-friendly bullet points. 
Generate professional resume bullet points that:
- Start with strong action verbs
- Include quantifiable achievements when possible
- Use industry-specific keywords
- Are concise (under 20 words each)
- Follow the STAR method (Situation, Task, Action, Result)`;

    const userPrompt = `Generate 4-5 professional resume bullet points for a ${position} position at ${company || 'a company'}.
${existingBullets?.length > 0 ? `Consider these existing bullets for context: ${existingBullets.join('; ')}` : ''}

Return ONLY the bullet points, one per line, without bullet symbols or numbering.`;

    const response = await fetch(AI_BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI request error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add funds.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error('AI request failed');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Parse bullet points from the response
    const bullets = content
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .map((line: string) => line.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, ''));

    console.log('Generated bullets:', bullets);

    return new Response(JSON.stringify({ bullets }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-suggest-bullets:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
