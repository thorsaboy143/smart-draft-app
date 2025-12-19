import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const templates = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Clean and professional single-column layout',
    preview: 'bg-gradient-to-b from-card to-secondary',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with subtle accents',
    preview: 'bg-gradient-to-b from-primary/5 to-card',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Elegant simplicity with focus on content',
    preview: 'bg-gradient-to-b from-secondary to-card',
  },
];

export const TemplatesPreview = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ATS-Friendly Templates
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional templates designed to pass Applicant Tracking Systems
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-card rounded-2xl overflow-hidden shadow-elegant hover:shadow-glow transition-all duration-300 border border-border/50">
                <div className={`h-64 ${template.preview} p-6 relative`}>
                  {/* Mock resume preview */}
                  <div className="bg-card rounded-lg p-4 shadow-sm h-full overflow-hidden">
                    <div className="w-1/2 h-3 bg-foreground/80 rounded mb-2" />
                    <div className="w-3/4 h-2 bg-muted-foreground/30 rounded mb-4" />
                    <div className="w-full h-1 bg-border mb-3" />
                    <div className="w-1/3 h-2 bg-foreground/60 rounded mb-2" />
                    <div className="space-y-1.5">
                      <div className="w-full h-1.5 bg-muted-foreground/20 rounded" />
                      <div className="w-5/6 h-1.5 bg-muted-foreground/20 rounded" />
                      <div className="w-4/5 h-1.5 bg-muted-foreground/20 rounded" />
                    </div>
                    <div className="w-1/3 h-2 bg-foreground/60 rounded mb-2 mt-4" />
                    <div className="space-y-1.5">
                      <div className="w-full h-1.5 bg-muted-foreground/20 rounded" />
                      <div className="w-4/5 h-1.5 bg-muted-foreground/20 rounded" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {template.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/builder">
            <Button size="lg" className="gradient-primary text-primary-foreground">
              Start Building Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
