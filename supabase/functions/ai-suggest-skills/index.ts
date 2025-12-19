export {};

declare const Deno: {
  env: { get: (key: string) => string | undefined };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

async function generateText(systemPrompt: string, userPrompt: string): Promise<string> {
  const AI_API_KEY = Deno.env.get('AI_API_KEY');
  const AI_PROVIDER = (Deno.env.get('AI_PROVIDER') ?? 'openai').toLowerCase();

  if (!AI_API_KEY) {
    throw new Error('AI_API_KEY is not configured');
  }

  if (AI_PROVIDER === 'gemini') {
    const AI_MODEL = Deno.env.get('AI_MODEL') ?? 'gemini-1.5-flash';
    const AI_BASE_URL =
      Deno.env.get('AI_BASE_URL') ??
      `https://generativelanguage.googleapis.com/v1beta/models/${AI_MODEL}:generateContent`;

    const response = await fetch(AI_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': AI_API_KEY,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI request error:', response.status, errorText);
      throw new Error('AI request failed');
    }

    const data = await response.json();
    const parts: any[] = data?.candidates?.[0]?.content?.parts ?? [];
    return parts.map((p) => (typeof p?.text === 'string' ? p.text : '')).join('').trim();
  }

  const AI_BASE_URL =
    Deno.env.get('AI_BASE_URL') ?? 'https://api.openai.com/v1/chat/completions';
  const AI_MODEL = Deno.env.get('AI_MODEL') ?? 'gpt-4o-mini';

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
    throw new Error('AI request failed');
  }

  const data = await response.json();
  return (data.choices?.[0]?.message?.content || '').trim();
}

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

function tryParseJsonObject(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // attempt to extract the first JSON object block
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start >= 0 && end > start) {
      const candidate = trimmed.slice(start, end + 1);
      return JSON.parse(candidate);
    }
    throw new Error('AI returned invalid JSON');
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resume } = (await req.json()) as { resume?: ResumePayload };

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

    let content = await generateText(systemPrompt, userPrompt);

    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const parsed = tryParseJsonObject(content) as { skills?: ResumeSkill[] };
    const rawSkills = Array.isArray(parsed?.skills) ? parsed.skills : [];

    // Normalize + dedupe categories/items, and remove items already present
    const existingSet = new Set(existingSkills.map((s) => s.trim().toLowerCase()));
    const seenCategory = new Set<string>();
    const skills: ResumeSkill[] = [];
    for (const s of rawSkills) {
      const category = (s?.category ?? '').trim();
      if (!category) continue;
      const catKey = category.toLowerCase();
      if (seenCategory.has(catKey)) continue;

      const items = (s?.items ?? [])
        .map((i) => (typeof i === 'string' ? i.trim() : ''))
        .filter(Boolean)
        .filter((i) => !existingSet.has(i.toLowerCase()));

      const itemSeen = new Set<string>();
      const uniqueItems = items.filter((i) => {
        const k = i.toLowerCase();
        if (itemSeen.has(k)) return false;
        itemSeen.add(k);
        return true;
      });

      if (uniqueItems.length === 0) continue;
      skills.push({ category, items: uniqueItems });
      seenCategory.add(catKey);
    }

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
