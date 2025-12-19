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

    const retryAfterHeader = response.headers.get('retry-after');
    const retryAfterSeconds = retryAfterHeader ? Number(retryAfterHeader) : NaN;
    const headerDelayMs = Number.isFinite(retryAfterSeconds) ? retryAfterSeconds * 1000 : undefined;
    const backoffMs = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt));
    const jitterMs = Math.floor(Math.random() * 200);
    const delayMs = (headerDelayMs ?? backoffMs) + jitterMs;

    await sleep(delayMs);
  }

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

    const response = await fetchWithRetry(
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
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI request error:', response.status, errorText);

      if (response.status === 404) {
        const available = await listModels();
        const hint = available.length ? ` Try AI_MODEL=${available[0]} (or one of: ${available.join(', ')}).` : '';
        throw new HttpError(404, `AI model not found: ${rawModel}. ${errorText.slice(0, 220)}${hint}`);
      }

      if (response.status === 429) {
        throw new HttpError(
          429,
          `Gemini quota/rate limit exceeded. Please check your plan/billing and try again. ${errorText.slice(0, 220)}`
        );
      }

      throw new HttpError(
        response.status,
        `AI request failed (status ${response.status}): ${errorText.slice(0, 300)}`
      );
    }

    const data = await response.json();
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

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText } = await req.json();

    if (typeof resumeText !== 'string' || !resumeText.trim()) {
      return new Response(JSON.stringify({ error: 'resumeText is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Parsing resume text, length:', resumeText?.length);

    const systemPrompt = `You are an expert resume parser. Extract structured information from resume text and return it as JSON.`;

    const userPrompt = `Parse this resume and extract the information into a structured format.
Return a JSON object with this structure:
{
  "title": "Resume title based on the person's target role",
  "personalInfo": {
    "fullName": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": "",
    "summary": ""
  },
  "education": [
    {
      "id": "unique_id",
      "institution": "",
      "degree": "",
      "field": "",
      "startDate": "",
      "endDate": "",
      "gpa": ""
    }
  ],
  "experience": [
    {
      "id": "unique_id",
      "company": "",
      "position": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "current": false,
      "bullets": [""]
    }
  ],
  "projects": [
    {
      "id": "unique_id",
      "name": "",
      "description": "",
      "technologies": [],
      "url": "",
      "bullets": [""]
    }
  ],
  "skills": [
    {
      "id": "unique_id",
      "category": "",
      "items": []
    }
  ]
}

Resume text:
${resumeText}

Return ONLY valid JSON, no markdown formatting or code blocks.`;

    let content = await generateText(systemPrompt, userPrompt);
    
    // Clean up the response - remove markdown code blocks if present
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    console.log('Parsed resume content:', content.substring(0, 500));

    const resume = JSON.parse(content);

    return new Response(JSON.stringify({ resume }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in parse-resume:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const status = error instanceof HttpError ? error.status : 500;
    return new Response(JSON.stringify({ error: errorMessage }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
