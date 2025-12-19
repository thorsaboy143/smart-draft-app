import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useResume } from '@/context/ResumeContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Target, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Copy,
  ArrowRight,
  Briefcase,
  Lightbulb
} from 'lucide-react';
import { toast } from 'sonner';

interface JobAnalysis {
  jobTitle: string;
  company: string;
  requiredKeywords: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  keywordMatchPercentage: number;
  suggestions: Array<{
    type: string;
    keyword: string;
    reason: string;
    where: string;
  }>;
  bulletImprovements: Array<{
    original: string;
    improved: string;
    addedKeywords: string[];
  }>;
  summaryRecommendation: string;
}

interface JobOptimizerProps {
  children?: React.ReactNode;
}

export const JobOptimizer = ({ children }: JobOptimizerProps) => {
  const [open, setOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const { resume, updatePersonalInfo } = useResume();

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please paste a job description');
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-job', {
        body: { jobDescription, resume }
      });

      if (error) throw error;

      setAnalysis(data);
      toast.success('Job analysis complete!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze job description');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applySummary = () => {
    if (analysis?.summaryRecommendation) {
      updatePersonalInfo({ summary: analysis.summaryRecommendation });
      toast.success('Summary updated!');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 70) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline">
            <Target className="w-4 h-4 mr-2" />
            Optimize for Job
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            AI Keyword Optimizer
          </DialogTitle>
          <DialogDescription>
            Paste a job description to get personalized keyword suggestions and optimize your resume for ATS systems.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job-desc">Job Description</Label>
              <Textarea
                id="job-desc"
                placeholder="Paste the job description here...

Example:
We are looking for a Senior Software Engineer with experience in React, Node.js, and AWS. The ideal candidate will have 5+ years of experience..."
                className="min-h-[250px] text-sm"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing || !jobDescription.trim()}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze & Optimize
                </>
              )}
            </Button>
          </div>

          {/* Results Section */}
          <ScrollArea className="h-[400px] pr-4">
            {analysis ? (
              <div className="space-y-4">
                {/* Match Score */}
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-sm">
                          {analysis.jobTitle} {analysis.company && `at ${analysis.company}`}
                        </span>
                      </div>
                      <span className={`text-2xl font-bold ${getMatchColor(analysis.keywordMatchPercentage)}`}>
                        {analysis.keywordMatchPercentage}%
                      </span>
                    </div>
                    <Progress value={analysis.keywordMatchPercentage} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">Keyword Match Score</p>
                  </CardContent>
                </Card>

                {/* Keywords */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Matched Keywords ({analysis.matchedKeywords.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {analysis.matchedKeywords.map((kw, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-green-100 text-green-700 text-xs">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 bg-orange-50/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-orange-700">
                      <AlertCircle className="w-4 h-4" />
                      Missing Keywords ({analysis.missingKeywords.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {analysis.missingKeywords.map((kw, idx) => (
                        <Badge key={idx} variant="outline" className="border-orange-300 text-orange-700 text-xs">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Suggestions */}
                {analysis.suggestions.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-500" />
                        Suggestions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {analysis.suggestions.slice(0, 5).map((suggestion, idx) => (
                        <div key={idx} className="text-sm border-l-2 border-primary pl-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{suggestion.type}</Badge>
                            <span className="font-medium">{suggestion.keyword}</span>
                          </div>
                          <p className="text-muted-foreground text-xs mt-1">{suggestion.reason}</p>
                          <p className="text-xs text-primary mt-1">Add to: {suggestion.where}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Bullet Improvements */}
                {analysis.bulletImprovements.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Improved Bullet Points</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {analysis.bulletImprovements.slice(0, 3).map((improvement, idx) => (
                        <div key={idx} className="space-y-2 text-sm">
                          <div className="flex items-start gap-2 text-muted-foreground line-through text-xs">
                            {improvement.original}
                          </div>
                          <div className="flex items-start gap-2">
                            <ArrowRight className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs">{improvement.improved}</p>
                              <div className="flex gap-1 mt-1">
                                {improvement.addedKeywords.map((kw, i) => (
                                  <Badge key={i} className="text-[10px] bg-green-100 text-green-700">
                                    +{kw}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="shrink-0 h-6 w-6"
                              onClick={() => copyToClipboard(improvement.improved)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Summary Recommendation */}
                {analysis.summaryRecommendation && (
                  <Card className="border-primary/30 bg-primary/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Tailored Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground mb-3">
                        {analysis.summaryRecommendation}
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={applySummary}>
                          Apply to Resume
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToClipboard(analysis.summaryRecommendation)}
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="font-medium">No analysis yet</p>
                  <p className="text-sm">Paste a job description to get started</p>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
