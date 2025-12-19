import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Builder = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Resume Builder</h1>
          <p className="text-muted-foreground">Build your professional resume step by step</p>
        </div>
        <div className="max-w-4xl mx-auto bg-card rounded-2xl p-8 shadow-elegant border border-border/50">
          <p className="text-center text-muted-foreground mb-6">
            Resume builder form coming soon. The landing page and core structure are ready!
          </p>
          <div className="flex justify-center">
            <Link to="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Builder;
