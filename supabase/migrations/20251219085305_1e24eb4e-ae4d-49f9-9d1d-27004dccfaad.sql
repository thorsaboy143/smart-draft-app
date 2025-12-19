-- Create resumes table for storing resume drafts
CREATE TABLE public.resumes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Untitled Resume',
  personal_info JSONB DEFAULT '{}',
  education JSONB DEFAULT '[]',
  experience JSONB DEFAULT '[]',
  projects JSONB DEFAULT '[]',
  skills JSONB DEFAULT '[]',
  ats_score INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read resumes (public guest mode)
CREATE POLICY "Anyone can view resumes" 
ON public.resumes 
FOR SELECT 
USING (true);

-- Create policy to allow anyone to insert resumes (guest mode)
CREATE POLICY "Anyone can create resumes" 
ON public.resumes 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow anyone to update resumes (guest mode)
CREATE POLICY "Anyone can update resumes" 
ON public.resumes 
FOR UPDATE 
USING (true);

-- Create policy to allow anyone to delete resumes (guest mode)
CREATE POLICY "Anyone can delete resumes" 
ON public.resumes 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_resumes_updated_at
BEFORE UPDATE ON public.resumes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();