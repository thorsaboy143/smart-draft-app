export {};

declare const Deno: {
  env: { get: (key: string) => string | undefined };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobDescription, resume } = await req.json();
    const AI_API_KEY = Deno.env.get('AI_API_KEY');
    const AI_BASE_URL = Deno.env.get('AI_BASE_URL') ?? 'https://api.openai.com/v1/chat/completions';
    const AI_MODEL = Deno.env.get('AI_MODEL') ?? 'gpt-4o-mini';
    
    if (!AI_API_KEY) {
      throw new Error('AI_API_KEY is not configured');
    }

    console.log('Analyzing job description, length:', jobDescription?.length);

    const systemPrompt = `You are an expert ATS optimization specialist and career coach. Analyze job descriptions and resumes to provide actionable keyword optimization suggestions.`;

    const userPrompt = `Analyze this job description and compare it with the resume to identify optimization opportunities.

JOB DESCRIPTION:
${jobDescription}

RESUME DATA:
${JSON.stringify(resume, null, 2)}

Return a JSON object with this exact structure:
{
  "jobTitle": "extracted job title from description",
  "company": "company name if mentioned",
  "requiredKeywords": ["list", "of", "important", "keywords", "from", "job", "description"],
  "matchedKeywords": ["keywords", "already", "in", "resume"],
  "missingKeywords": ["important", "keywords", "not", "in", "resume"],
  "keywordMatchPercentage": 65,
  "suggestions": [
    {
      "type": "add_skill",
      "keyword": "keyword to add",
      "reason": "Why this keyword is important",
      "where": "Where to add it (skills, experience, summary)"
    }
  ],
  "bulletImprovements": [
    {
      "original": "original bullet point from resume",
      "improved": "improved version with better keywords",
      "addedKeywords": ["keywords", "added"]
    }
  ],
  "summaryRecommendation": "A tailored professional summary for this job"
}

Return ONLY valid JSON, no markdown formatting or code blocks.`;

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
    let content = data.choices?.[0]?.message?.content || '';
    
    // Clean up the response
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    console.log('Job analysis complete');

    const analysis = JSON.parse(content);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-job:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
