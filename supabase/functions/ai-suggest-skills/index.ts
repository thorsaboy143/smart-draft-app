const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type ResumeSkill = { category: string; items: string[] };

type ResumePayload = {
  title?: string;
  personalInfo?: { summary?: string };
  experience?: Array<{ position?: string; company?: string; bullets?: string[] }>;
  projects?: Array<{ name?: string; technologies?: string[]; bullets?: string[] }>;
  skills?: ResumeSkill[];
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resume } = (await req.json()) as { resume?: ResumePayload };

    const AI_API_KEY = Deno.env.get('AI_API_KEY');
    const AI_BASE_URL =
      Deno.env.get('AI_BASE_URL') ?? 'https://api.openai.com/v1/chat/completions';
    const AI_MODEL = Deno.env.get('AI_MODEL') ?? 'gpt-4o-mini';

    if (!AI_API_KEY) {
      throw new Error('AI_API_KEY is not configured');
    }

    const existingSkills = (resume?.skills ?? [])
      .flatMap((s) => s.items ?? [])
      .map((s) => (typeof s === 'string' ? s.trim() : ''))
      .filter(Boolean);

    const inferredRole =
      resume?.title?.trim() || resume?.experience?.[0]?.position?.trim() || '';

    const systemPrompt =
      'You are an expert resume writer and ATS optimization specialist.';

    const userPrompt = `Suggest resume skills to add based on the candidate's background.

TARGET ROLE (if known): ${inferredRole || 'Unknown'}

RESUME CONTEXT (JSON):
${JSON.stringify(
  {
    title: resume?.title,
    summary: resume?.personalInfo?.summary,
    experience: (resume?.experience ?? []).slice(0, 6),
    projects: (resume?.projects ?? []).slice(0, 6),
    existingSkills,
  },
  null,
  2
)}

Return a JSON object with this exact structure:
{
  "skills": [
    { "category": "Programming Languages", "items": ["..."] },
    { "category": "Frameworks & Libraries", "items": ["..."] },
    { "category": "Tools & Technologies", "items": ["..."] },
    { "category": "Databases", "items": ["..."] },
    { "category": "Soft Skills", "items": ["..."] }
  ]
}

Rules:
- Suggest 3-6 categories.
- 4-8 skills per category.
- Skills must be ATS-friendly (exact names), no sentences.
- Avoid duplicates and avoid skills already in existingSkills.
- Return ONLY valid JSON.`;

    const response = await fetch(AI_BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI request error:', response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: 'Rate limit exceeded. Please try again later.',
          }),
          {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add funds.' }),
          {
            status: 402,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      throw new Error('AI request failed');
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || '';

    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const parsed = JSON.parse(content) as { skills?: ResumeSkill[] };
    const skills = Array.isArray(parsed?.skills) ? parsed.skills : [];

    return new Response(JSON.stringify({ skills }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-suggest-skills:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
