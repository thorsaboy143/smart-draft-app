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

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText } = await req.json();

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
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
