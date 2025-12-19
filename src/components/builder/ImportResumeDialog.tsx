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
import { useResume } from '@/context/ResumeContext';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface ImportResumeDialogProps {
  children?: React.ReactNode;
}

export const ImportResumeDialog = ({ children }: ImportResumeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { updateResume } = useResume();

  const handleImport = async () => {
    if (!resumeText.trim()) {
      toast.error('Please paste your resume content');
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('parse-resume', {
        body: { resumeText }
      });

      if (error) throw error;

      if (data?.resume) {
        updateResume(data.resume);
        toast.success('Resume imported successfully!');
        setOpen(false);
        setResumeText('');
      }
    } catch (error) {
      console.error('Failed to parse resume:', error);
      toast.error('Failed to parse resume. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Existing Resume
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Import Your Existing Resume
          </DialogTitle>
          <DialogDescription>
            Paste your existing resume text below and we'll automatically extract the information to fill your new resume.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resume-text">Resume Content</Label>
            <Textarea
              id="resume-text"
              placeholder="Paste your resume content here...

Example:
John Doe
Software Engineer
john@email.com | (555) 123-4567 | New York, NY

EXPERIENCE
Software Engineer at Tech Company
Jan 2020 - Present
• Led development of key features
• Improved system performance by 40%

EDUCATION
Bachelor of Science in Computer Science
University Name, 2019

SKILLS
JavaScript, Python, React, Node.js"
              className="min-h-[300px] font-mono text-sm"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Resume
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
