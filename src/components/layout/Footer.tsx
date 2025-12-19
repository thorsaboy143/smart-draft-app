import { Link } from 'react-router-dom';
import { FileText, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 rounded-lg gradient-primary">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">ResumeAI</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Build ATS-optimized resumes with AI-powered suggestions. 
              Land your dream job with a professional resume.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/builder" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link to="/ats-checker" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  ATS Checker
                </Link>
              </li>
              <li>
                <Link to="/templates" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Templates
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-muted-foreground text-sm cursor-pointer hover:text-primary transition-colors">
                  Resume Writing Guide
                </span>
              </li>
              <li>
                <span className="text-muted-foreground text-sm cursor-pointer hover:text-primary transition-colors">
                  ATS Tips
                </span>
              </li>
              <li>
                <span className="text-muted-foreground text-sm cursor-pointer hover:text-primary transition-colors">
                  Career Blog
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-muted-foreground text-sm cursor-pointer hover:text-primary transition-colors">
                  About Us
                </span>
              </li>
              <li>
                <span className="text-muted-foreground text-sm cursor-pointer hover:text-primary transition-colors">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-muted-foreground text-sm cursor-pointer hover:text-primary transition-colors">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} ResumeAI. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
