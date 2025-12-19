import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalInfoForm } from '@/components/builder/PersonalInfoForm';
import { EducationForm } from '@/components/builder/EducationForm';
import { ExperienceForm } from '@/components/builder/ExperienceForm';
import { ProjectsForm } from '@/components/builder/ProjectsForm';
import { SkillsForm } from '@/components/builder/SkillsForm';
import { ResumePreview } from '@/components/builder/ResumePreview';
import { TemplateSelector } from '@/components/builder/TemplateSelector';
import { ImportResumeDialog } from '@/components/builder/ImportResumeDialog';
import { JobOptimizer } from '@/components/builder/JobOptimizer';
import { useResume } from '@/context/ResumeContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  FolderKanban, 
  Wrench, 
  Download, 
  Save,
  ChevronLeft,
  ChevronRight,
  Eye,
  Upload,
  FileCheck,
  Loader2,
  Target
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';

const steps = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'skills', label: 'Skills', icon: Wrench },
];

const Builder = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [showPreview, setShowPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { resume, calculateProgress, saveToDatabase, isSaving, updateResume } = useResume();

  const progress = calculateProgress();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    const id = await saveToDatabase();
    if (id) {
      toast.success('Resume saved successfully!');
    } else {
      toast.error('Failed to save resume');
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      let yPosition = margin;
      const lineHeight = 5;

      // Helper function to add text with word wrap
      const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
        pdf.setFontSize(fontSize);
        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, x, y);
        return y + (lines.length * lineHeight);
      };

      // Header - Name
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(resume.personalInfo.fullName || 'Your Name', margin, yPosition);
      yPosition += 8;

      // Contact info
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const contactParts = [
        resume.personalInfo.email,
        resume.personalInfo.phone,
        resume.personalInfo.location,
        resume.personalInfo.linkedin,
        resume.personalInfo.website,
      ].filter(Boolean);
      pdf.text(contactParts.join(' | '), margin, yPosition);
      yPosition += 10;

      // Summary
      if (resume.personalInfo.summary) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text('PROFESSIONAL SUMMARY', margin, yPosition);
        yPosition += 6;
        pdf.setFont('helvetica', 'normal');
        yPosition = addWrappedText(resume.personalInfo.summary, margin, yPosition, contentWidth);
        yPosition += 5;
      }

      // Experience
      if (resume.experience.length > 0) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text('WORK EXPERIENCE', margin, yPosition);
        yPosition += 6;

        resume.experience.forEach((exp) => {
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(11);
          pdf.text(exp.position, margin, yPosition);
          yPosition += 5;

          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(10);
          const expDetails = `${exp.company}${exp.location ? ' | ' + exp.location : ''} | ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`;
          pdf.text(expDetails, margin, yPosition);
          yPosition += 5;

          exp.bullets.filter(b => b.trim()).forEach((bullet) => {
            yPosition = addWrappedText(`• ${bullet}`, margin + 3, yPosition, contentWidth - 3);
          });
          yPosition += 3;
        });
        yPosition += 2;
      }

      // Education
      if (resume.education.length > 0) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text('EDUCATION', margin, yPosition);
        yPosition += 6;

        resume.education.forEach((edu) => {
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(11);
          pdf.text(`${edu.degree} in ${edu.field}`, margin, yPosition);
          yPosition += 5;

          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(10);
          pdf.text(`${edu.institution} | ${edu.startDate} - ${edu.endDate}${edu.gpa ? ' | GPA: ' + edu.gpa : ''}`, margin, yPosition);
          yPosition += 8;
        });
      }

      // Projects
      if (resume.projects.length > 0) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text('PROJECTS', margin, yPosition);
        yPosition += 6;

        resume.projects.forEach((proj) => {
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(11);
          pdf.text(proj.name, margin, yPosition);
          yPosition += 5;

          if (proj.technologies.length > 0) {
            pdf.setFont('helvetica', 'italic');
            pdf.setFontSize(9);
            pdf.text(proj.technologies.join(', '), margin, yPosition);
            yPosition += 4;
          }

          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(10);
          proj.bullets.filter(b => b.trim()).forEach((bullet) => {
            yPosition = addWrappedText(`• ${bullet}`, margin + 3, yPosition, contentWidth - 3);
          });
          yPosition += 3;
        });
        yPosition += 2;
      }

      // Skills
      if (resume.skills.length > 0) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text('SKILLS', margin, yPosition);
        yPosition += 6;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        resume.skills.forEach((skill) => {
          pdf.text(`${skill.category}: ${skill.items.join(', ')}`, margin, yPosition);
          yPosition += 5;
        });
      }

      pdf.save(`${resume.personalInfo.fullName || 'resume'}.pdf`);
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const checkATSScore = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('ats-score', {
        body: { resume }
      });

      if (error) throw error;

      if (data?.score !== undefined) {
        updateResume({ atsScore: data.score });
        toast.success(`ATS Score: ${data.score}/100`, {
          description: data.suggestions?.[0] || 'Keep improving your resume!'
        });
      }
    } catch (error) {
      console.error('ATS check error:', error);
      toast.error('Failed to check ATS score');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Progress Bar */}
        <div className="border-b border-border bg-card/50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl font-semibold">Resume Builder</h1>
              <div className="flex items-center gap-2">
                <ImportResumeDialog>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Resume
                  </Button>
                </ImportResumeDialog>
                <span className="text-sm text-muted-foreground">{progress}% Complete</span>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Template Selector */}
        <div className="border-b border-border bg-card/30">
          <div className="container mx-auto px-4 py-6">
            <TemplateSelector selected={selectedTemplate} onSelect={setSelectedTemplate} />
          </div>
        </div>

        {/* Main Builder Area */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="space-y-6">
              {/* Step Navigation */}
              <div className="flex items-center justify-between bg-card rounded-xl p-2 border border-border/50">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStep(index)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        currentStep === index 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline text-sm font-medium">{step.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Form Content */}
              <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-elegant min-h-[500px]">
                {currentStep === 0 && <PersonalInfoForm />}
                {currentStep === 1 && <EducationForm />}
                {currentStep === 2 && <ExperienceForm />}
                {currentStep === 3 && <ProjectsForm />}
                {currentStep === 4 && <SkillsForm />}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex gap-2">
                  <JobOptimizer>
                    <Button variant="outline" size="sm">
                      <Target className="w-4 h-4 mr-2" />
                      Optimize for Job
                    </Button>
                  </JobOptimizer>
                  <Button variant="outline" size="sm" onClick={checkATSScore}>
                    <FileCheck className="w-4 h-4 mr-2" />
                    ATS Score
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save
                  </Button>
                </div>

                {currentStep < steps.length - 1 ? (
                  <Button onClick={handleNext}>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleExportPDF} disabled={isExporting}>
                    {isExporting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    Export PDF
                  </Button>
                )}
              </div>
            </div>

            {/* Preview Section */}
            <div className="hidden lg:block">
              <div className="sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Live Preview</h2>
                  {resume.atsScore !== undefined && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      resume.atsScore >= 80 ? 'bg-green-100 text-green-700' :
                      resume.atsScore >= 60 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      ATS Score: {resume.atsScore}/100
                    </span>
                  )}
                </div>
                <div className="rounded-xl border border-border/50 shadow-elegant overflow-hidden">
                  <div className="overflow-auto max-h-[calc(100vh-200px)]">
                    <div className="transform scale-[0.6] origin-top">
                      <ResumePreview template={selectedTemplate as any} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Preview Toggle */}
          <div className="lg:hidden fixed bottom-4 right-4">
            <Button
              size="lg"
              className="rounded-full shadow-lg"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="w-5 h-5 mr-2" />
              Preview
            </Button>
          </div>

          {/* Mobile Preview Modal */}
          {showPreview && (
            <div className="lg:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-auto">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Resume Preview</h2>
                  <Button variant="outline" onClick={() => setShowPreview(false)}>
                    Close
                  </Button>
                </div>
                <ResumePreview template={selectedTemplate as any} />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Builder;
