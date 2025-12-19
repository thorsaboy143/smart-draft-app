import { useRef, useState } from 'react';
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { updateResume } = useResume();

  const getFunctionInvokeErrorMessage = (err: unknown, fallback: string) => {
    const anyError = err as any;
    const body = anyError?.context?.body;
    const status = anyError?.context?.status;

    if (status === 429 && (!body || (typeof body === 'string' && !body.trim()))) {
      return 'AI quota/rate limit exceeded. Please check your plan/billing and try again.';
    }

    if (typeof body === 'string' && body.trim()) {
      try {
        const parsed = JSON.parse(body);
        const msg = typeof parsed?.error === 'string' ? parsed.error : undefined;
        return msg || anyError?.message || fallback;
      } catch {
        return anyError?.message || body || fallback;
      }
    }

    if (body && typeof body === 'object') {
      const msg = typeof (body as any)?.error === 'string' ? (body as any).error : undefined;
      return msg || anyError?.message || fallback;
    }

    return anyError?.message || fallback;
  };

  const parseAndApplyResumeText = async (text: string) => {
    const { data, error } = await supabase.functions.invoke('parse-resume', {
      body: { resumeText: text },
    });

    if (error) {
      throw new Error(getFunctionInvokeErrorMessage(error, 'Failed to parse resume'));
    }

    if (data?.resume) {
      updateResume(data.resume);
      toast.success('Resume imported successfully!');
      setOpen(false);
      setResumeText('');
    } else {
      toast.error('Could not extract resume data');
    }
  };

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const pdfjsLib: any = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();

    const data = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data }).promise;

    let text = '';
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const pageText = (content.items as any[])
        .map((item) => (typeof item?.str === 'string' ? item.str : ''))
        .filter(Boolean)
        .join(' ');
      text += `${pageText}\n`;
    }

    return text;
  };

  const handlePdfFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }

    setIsProcessing(true);
    try {
      const extracted = await extractTextFromPdf(file);
      if (!extracted.trim()) {
        toast.error('Could not read text from this PDF');
        return;
      }

      setResumeText(extracted);
      await parseAndApplyResumeText(extracted);
    } catch (error) {
      console.error('Failed to import PDF resume:', error);
      const message =
        (error instanceof Error && error.message) ||
        getFunctionInvokeErrorMessage(error, 'Failed to import PDF. Please try again.');
      toast.error(message);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleImport = async () => {
    if (!resumeText.trim()) {
      toast.error('Please paste your resume content');
      return;
    }

    setIsProcessing(true);
    try {
      await parseAndApplyResumeText(resumeText);
    } catch (error) {
      console.error('Failed to parse resume:', error);
      const message =
        (error instanceof Error && error.message) ||
        getFunctionInvokeErrorMessage(error, 'Failed to parse resume. Please try again.');
      toast.error(message);
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
            Upload a resume PDF or paste resume text, and we'll extract the information to fill your new resume.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Upload PDF</Label>
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handlePdfFile(file);
                }}
                disabled={isProcessing}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose PDF
              </Button>
              <p className="text-xs text-muted-foreground">
                Upload a resume PDF to auto-fill.
              </p>
            </div>
          </div>

          <div className="relative py-2">
            <div className="h-px bg-border" />
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
              OR
            </span>
          </div>

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
