import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary?: string;
  };
  education: Array<{ institution: string; degree: string; field: string }>;
  experience: Array<{ company: string; position: string; bullets: string[] }>;
  projects: Array<{ name: string; description: string; technologies: string[] }>;
  skills: Array<{ category: string; items: string[] }>;
}

function calculateATSScore(resume: ResumeData, keywords?: string[]): {
  score: number;
  keywordMatch: number;
  missingSections: string[];
  suggestions: string[];
  formattingScore: number;
} {
  let score = 0;
  const missingSections: string[] = [];
  const suggestions: string[] = [];
  
  // Check personal info (20 points max)
  const personalInfo = resume.personalInfo;
  if (personalInfo.fullName) score += 5;
  else missingSections.push('Full Name');
  
  if (personalInfo.email) score += 5;
  else missingSections.push('Email');
  
  if (personalInfo.phone) score += 5;
  else missingSections.push('Phone');
  
  if (personalInfo.location) score += 3;
  if (personalInfo.summary && personalInfo.summary.length > 50) score += 2;
  else suggestions.push('Add a professional summary (50+ characters)');

  // Check experience (30 points max)
  if (resume.experience.length > 0) {
    score += 10;
    
    // Check for bullet points
    const totalBullets = resume.experience.reduce((sum, exp) => 
      sum + exp.bullets.filter(b => b.trim()).length, 0);
    
    if (totalBullets >= 6) score += 10;
    else if (totalBullets >= 3) score += 5;
    else suggestions.push('Add more bullet points to your experience (aim for 3-5 per role)');
    
    // Check for action verbs
    const actionVerbs = ['led', 'developed', 'managed', 'created', 'implemented', 'increased', 'decreased', 'improved', 'designed', 'built', 'achieved', 'delivered', 'launched'];
    const bulletText = resume.experience.flatMap(e => e.bullets).join(' ').toLowerCase();
    const hasActionVerbs = actionVerbs.some(verb => bulletText.includes(verb));
    if (hasActionVerbs) score += 5;
    else suggestions.push('Use strong action verbs (Led, Developed, Managed, etc.)');
    
    // Check for metrics
    const hasMetrics = /\d+%|\$\d+|\d+\+/.test(bulletText);
    if (hasMetrics) score += 5;
    else suggestions.push('Add quantifiable achievements (e.g., "increased sales by 25%")');
  } else {
    missingSections.push('Work Experience');
    suggestions.push('Add work experience to improve your resume');
  }

  // Check education (15 points max)
  if (resume.education.length > 0) {
    score += 10;
    if (resume.education[0].degree && resume.education[0].field) score += 5;
  } else {
    missingSections.push('Education');
    suggestions.push('Add your educational background');
  }

  // Check skills (15 points max)
  if (resume.skills.length > 0) {
    score += 8;
    const totalSkills = resume.skills.reduce((sum, cat) => sum + cat.items.length, 0);
    if (totalSkills >= 10) score += 7;
    else if (totalSkills >= 5) score += 4;
    else suggestions.push('Add more skills (aim for 10+)');
  } else {
    missingSections.push('Skills');
    suggestions.push('Add a skills section with relevant technical and soft skills');
  }

  // Check projects (10 points max)
  if (resume.projects.length > 0) {
    score += 5;
    if (resume.projects.some(p => p.technologies.length > 0)) score += 5;
  } else {
    suggestions.push('Consider adding projects to showcase your work');
  }

  // Formatting score (10 points max)
  let formattingScore = 100;
  
  // Check for consistent formatting
  if (resume.experience.some(e => !e.position)) {
    formattingScore -= 20;
    suggestions.push('Ensure all positions have job titles');
  }
  
  // Keyword matching
  let keywordMatch = 0;
  if (keywords && keywords.length > 0) {
    const resumeText = JSON.stringify(resume).toLowerCase();
    const matchedKeywords = keywords.filter(kw => resumeText.includes(kw.toLowerCase()));
    keywordMatch = Math.round((matchedKeywords.length / keywords.length) * 100);
    
    // Add up to 10 bonus points for keyword match
    score += Math.round(keywordMatch / 10);
  } else {
    keywordMatch = 75; // Default if no keywords provided
  }

  // Ensure score doesn't exceed 100
  score = Math.min(score, 100);

  return {
    score,
    keywordMatch,
    missingSections,
    suggestions: suggestions.slice(0, 5), // Limit to 5 suggestions
    formattingScore,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resume, keywords } = await req.json();
    
    console.log('Calculating ATS score for resume');
    
    const analysis = calculateATSScore(resume, keywords);
    
    console.log('ATS Analysis:', analysis);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ats-score:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
