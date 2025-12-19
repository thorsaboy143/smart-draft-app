import { FileEdit, Wand2, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    icon: FileEdit,
    title: 'Enter Your Details',
    description: 'Fill in your work experience, education, skills, and projects using our intuitive step-by-step form.',
  },
  {
    icon: Wand2,
    title: 'AI Enhances Your Content',
    description: 'Our AI analyzes and improves your bullet points, optimizes keywords, and boosts your ATS score.',
  },
  {
    icon: Download,
    title: 'Download & Apply',
    description: 'Export your polished, ATS-optimized resume as a professional PDF ready for job applications.',
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create your professional resume in three simple steps
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-card rounded-2xl p-8 shadow-elegant hover:shadow-glow transition-all duration-300 h-full border border-border/50">
                <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center mb-6">
                  <step.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
