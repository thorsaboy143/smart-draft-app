/*
  Local probe for Supabase Edge Functions.
  - Reads .env in this folder
  - Calls the function endpoint directly
  - Does NOT print the API key

  Usage:
    node scripts/probe-edge-function.cjs ai-suggest-skills
*/

const fs = require('fs');
const path = require('path');

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const text = fs.readFileSync(filePath, 'utf8');
  const env = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx < 0) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

async function main() {
  const functionName = process.argv[2] || 'ai-suggest-skills';
  const envPath = path.join(process.cwd(), '.env');
  const env = readEnvFile(envPath);

  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in .env');
    process.exit(1);
  }

  const endpoint = url.replace('.supabase.co', '.functions.supabase.co') + '/' + functionName;

  const body =
    functionName === 'parse-resume'
      ? JSON.stringify({
          resumeText:
            'John Doe\nSoftware Engineer\njohn@example.com\n\nSKILLS\nJavaScript, TypeScript, React\n',
        })
      : JSON.stringify({ resume: { title: 'Test', skills: [] } });

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        // This matches what supabase-js sends (anon key)
        authorization: `Bearer ${key}`,
        apikey: key,
      },
      body,
    });

    const text = await res.text();

    console.log('endpoint:', endpoint);
    console.log('status:', res.status);
    console.log('body (first 500 chars):', text.slice(0, 500));
  } catch (e) {
    console.error('fetch failed:', e && e.message ? e.message : e);
    process.exit(2);
  }
}

main();
