export {};

declare const Deno: {
  env: { get: (key: string) => string | undefined };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  opts?: { retries?: number; baseDelayMs?: number; maxDelayMs?: number }
): Promise<Response> {
  const retries = opts?.retries ?? 2;
  const baseDelayMs = opts?.baseDelayMs ?? 600;
  const maxDelayMs = opts?.maxDelayMs ?? 2500;

  let lastResponse: Response | undefined;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const response = await fetch(url, init);
    lastResponse = response;

    if (response.status !== 429) return response;

    if (attempt === retries) return response;

    // Prefer Retry-After if provided, otherwise exponential backoff with jitter.
    const retryAfterHeader = response.headers.get('retry-after');
    const retryAfterSeconds = retryAfterHeader ? Number(retryAfterHeader) : NaN;
    const headerDelayMs = Number.isFinite(retryAfterSeconds) ? retryAfterSeconds * 1000 : undefined;
    const backoffMs = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt));
    const jitterMs = Math.floor(Math.random() * 200);
    const delayMs = (headerDelayMs ?? backoffMs) + jitterMs;

    await sleep(delayMs);
  }

  // Should be unreachable, but TypeScript wants a return.
  return lastResponse as Response;
}

async function generateText(systemPrompt: string, userPrompt: string): Promise<string> {
  const AI_API_KEY = Deno.env.get('AI_API_KEY');
  const AI_PROVIDER = (Deno.env.get('AI_PROVIDER') ?? 'openai').toLowerCase();

  if (!AI_API_KEY) {
    throw new Error('AI_API_KEY is not configured');
  }

  if (AI_PROVIDER === 'gemini') {
    const rawModel = Deno.env.get('AI_MODEL') ?? 'gemini-1.5-flash';
    const modelName = rawModel.startsWith('models/') ? rawModel : `models/${rawModel}`;
    const AI_BASE_URL =
      Deno.env.get('AI_BASE_URL') ??
      `https://generativelanguage.googleapis.com/v1/${modelName}:generateContent`;

    const listModels = async (): Promise<string[]> => {
      const res = await fetch('https://generativelanguage.googleapis.com/v1/models', {
        headers: { 'x-goog-api-key': AI_API_KEY },
      });
      if (!res.ok) return [];
      const data = await res.json();
      const models: any[] = data?.models ?? [];
      return models
        .map((m) => (typeof m?.name === 'string' ? m.name : ''))
        .filter(Boolean)
        .filter((name) => name.toLowerCase().includes('gemini'))
        .slice(0, 12);
    };

    const response = await fetch(AI_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': AI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `SYSTEM:\n${systemPrompt}\n\nUSER:\n${userPrompt}` }],
          },
        ],
      }),
    });

    // If we got rate-limited, try a couple retries before failing.
    const finalResponse = response.status === 429
      ? await fetchWithRetry(
          AI_BASE_URL,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': AI_API_KEY,
            },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `SYSTEM:\n${systemPrompt}\n\nUSER:\n${userPrompt}` }],
                },
              ],
            }),
          },
          { retries: 2, baseDelayMs: 800, maxDelayMs: 2800 }
        )
      : response;

    if (!finalResponse.ok) {
      const errorText = await finalResponse.text();
      console.error('AI request error:', finalResponse.status, errorText);
      if (finalResponse.status === 404) {
        const available = await listModels();
        const hint = available.length ? ` Try AI_MODEL=${available[0]} (or one of: ${available.join(', ')}).` : '';
        throw new HttpError(404, `AI model not found: ${rawModel}. ${errorText.slice(0, 220)}${hint}`);
      }

      if (finalResponse.status === 429) {
        throw new HttpError(
          429,
          `Gemini quota/rate limit exceeded. Please check your plan/billing and try again. ${errorText.slice(0, 220)}`
        );
      }

      throw new HttpError(
        finalResponse.status,
        `AI request failed (status ${finalResponse.status}): ${errorText.slice(0, 300)}`
      );
    }

    const data = await finalResponse.json();
    const parts: any[] = data?.candidates?.[0]?.content?.parts ?? [];
    return parts.map((p) => (typeof p?.text === 'string' ? p.text : '')).join('').trim();
  }

  const isOpenRouter = AI_PROVIDER === 'openrouter';
  const AI_BASE_URL =
    Deno.env.get('AI_BASE_URL') ??
    (isOpenRouter
      ? 'https://openrouter.ai/api/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions');
  const AI_MODEL = Deno.env.get('AI_MODEL') ?? (isOpenRouter ? 'openai/gpt-4o-mini' : 'gpt-4o-mini');

  const extraHeaders: Record<string, string> = {};
  if (isOpenRouter) {
    const referer = Deno.env.get('AI_HTTP_REFERER') ?? Deno.env.get('OPENROUTER_HTTP_REFERER');
    const title = Deno.env.get('AI_APP_TITLE') ?? Deno.env.get('OPENROUTER_APP_TITLE');
    if (referer) extraHeaders['HTTP-Referer'] = referer;
    if (title) extraHeaders['X-Title'] = title;
  }

  const response = await fetchWithRetry(AI_BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${AI_API_KEY}`,
      'Content-Type': 'application/json',
      ...extraHeaders,
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
      throw new HttpError(
        429,
        `AI quota/rate limit exceeded. Please try again later. ${errorText.slice(0, 220)}`
      );
    }

    throw new HttpError(
      response.status,
      `AI request failed (status ${response.status}): ${errorText.slice(0, 300)}`
    );
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
    const status = error instanceof HttpError ? error.status : 500;
    return new Response(JSON.stringify({ error: errorMessage }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
