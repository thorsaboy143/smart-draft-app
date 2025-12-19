import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useResume } from '@/context/ResumeContext';
import { 
  FileCheck, 
  Upload, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface ATSResult {
  score: number;
  keywordMatch: number;
  missingSections: string[];
  suggestions: string[];
  formattingScore: number;
}

const ATSChecker = () => {
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ATSResult | null>(null);
  const { resume } = useResume();

  const analyzeFromText = async () => {
    if (!resumeText.trim()) {
      toast.error('Please paste your resume content');
      return;
    }

    setIsAnalyzing(true);
    try {
      // First parse the resume text
      const { data: parseData, error: parseError } = await supabase.functions.invoke('parse-resume', {
        body: { resumeText }
      });

      if (parseError) throw parseError;

      // Then get ATS score
      const { data: atsData, error: atsError } = await supabase.functions.invoke('ats-score', {
        body: { resume: parseData.resume }
      });

      if (atsError) throw atsError;

      setResult(atsData);
      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze resume');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeCurrentResume = async () => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ats-score', {
        body: { resume }
      });

      if (error) throw error;

      setResult(data);
      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze resume');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary mb-6">
              <FileCheck className="w-4 h-4" />
              <span className="text-sm font-medium">ATS Resume Checker</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Is Your Resume ATS-Friendly?
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get instant feedback on how well your resume will perform with Applicant Tracking Systems
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Analyze Your Resume</CardTitle>
                    <CardDescription>
                      Choose how you want to analyze your resume
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {resume.personalInfo.fullName && (
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Current Resume</p>
                            <p className="text-sm text-muted-foreground">
                              {resume.personalInfo.fullName} - {resume.title}
                            </p>
                          </div>
                          <Button onClick={analyzeCurrentResume} disabled={isAnalyzing}>
                            {isAnalyzing ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Sparkles className="w-4 h-4 mr-2" />
                            )}
                            Analyze
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or paste resume text</span>
                      </div>
                    </div>

                    <Textarea
                      placeholder="Paste your resume content here..."
                      className="min-h-[300px] font-mono text-sm"
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                    />

                    <Button 
                      className="w-full" 
                      onClick={analyzeFromText}
                      disabled={isAnalyzing || !resumeText.trim()}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <FileCheck className="w-4 h-4 mr-2" />
                          Check ATS Score
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Results Section */}
              <div className="space-y-6">
                {result ? (
                  <>
                    {/* Score Card */}
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className={`text-6xl font-bold ${getScoreColor(result.score)}`}>
                            {result.score}
                          </div>
                          <p className="text-muted-foreground mt-2">out of 100</p>
                          <Progress 
                            value={result.score} 
                            className={`mt-4 h-3 ${getScoreBg(result.score)}`}
                          />
                          <p className="mt-4 text-lg font-medium">
                            {result.score >= 80 ? 'Excellent! Your resume is ATS-optimized.' :
                             result.score >= 60 ? 'Good, but there\'s room for improvement.' :
                             'Needs work to pass ATS screening.'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="pt-6 text-center">
                          <div className="text-3xl font-bold text-primary">
                            {result.keywordMatch}%
                          </div>
                          <p className="text-sm text-muted-foreground">Keyword Match</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6 text-center">
                          <div className="text-3xl font-bold text-primary">
                            {result.formattingScore}%
                          </div>
                          <p className="text-sm text-muted-foreground">Formatting Score</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Missing Sections */}
                    {result.missingSections.length > 0 && (
                      <Card className="border-red-200 bg-red-50/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                            <AlertCircle className="w-5 h-5" />
                            Missing Sections
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {result.missingSections.map((section, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-red-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                {section}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {/* Suggestions */}
                    {result.suggestions.length > 0 && (
                      <Card className="border-blue-200 bg-blue-50/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
                            <Info className="w-5 h-5" />
                            Suggestions for Improvement
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            {result.suggestions.map((suggestion, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-blue-700">
                                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {/* CTA */}
                    <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">Ready to improve your resume?</h3>
                            <p className="text-sm text-muted-foreground">
                              Use our AI-powered builder to optimize your resume
                            </p>
                          </div>
                          <Link to="/builder">
                            <Button>
                              Build Resume
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="h-full flex items-center justify-center min-h-[400px]">
                    <CardContent className="text-center">
                      <FileCheck className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No Analysis Yet</h3>
                      <p className="text-muted-foreground">
                        Paste your resume or analyze your current resume to see the results
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-12">What We Check</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Keywords & Skills',
                  description: 'We analyze if your resume contains relevant industry keywords that ATS systems look for.',
                },
                {
                  title: 'Section Structure',
                  description: 'Proper sections like Experience, Education, and Skills are essential for ATS parsing.',
                },
                {
                  title: 'Formatting',
                  description: 'Clean, simple formatting ensures ATS can properly read and parse your resume.',
                },
              ].map((item, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ATSChecker;
