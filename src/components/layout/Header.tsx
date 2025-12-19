import { Link } from 'react-router-dom';
import { FileText, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-card border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg gradient-primary group-hover:shadow-glow transition-all duration-300">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">ResumeAI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Home
            </Link>
            <Link to="/builder" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Builder
            </Link>
            <Link to="/ats-checker" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              ATS Checker
            </Link>
            <Link to="/templates" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Templates
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/builder">
              <Button className="gradient-primary text-primary-foreground shadow-elegant hover:shadow-glow transition-all duration-300">
                Build Your Resume
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-card"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <Link to="/" className="text-foreground font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/builder" className="text-foreground font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                Builder
              </Link>
              <Link to="/ats-checker" className="text-foreground font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                ATS Checker
              </Link>
              <Link to="/templates" className="text-foreground font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                Templates
              </Link>
              <Link to="/builder" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full gradient-primary text-primary-foreground">
                  Build Your Resume
                </Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
