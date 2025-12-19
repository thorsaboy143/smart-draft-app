import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface TemplateSelectorProps {
  selected: string;
  onSelect: (template: string) => void;
}

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean design with accent color header',
    preview: 'bg-gradient-to-b from-primary/20 to-transparent',
    colors: ['bg-primary', 'bg-blue-500', 'bg-green-500'],
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional layout with serif fonts',
    preview: 'border-b-4 border-foreground',
    colors: ['bg-gray-900', 'bg-blue-900', 'bg-green-900'],
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate style with dark header',
    preview: 'bg-gradient-to-b from-slate-800 to-transparent',
    colors: ['bg-slate-800', 'bg-blue-800', 'bg-gray-800'],
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Gradient header with rounded elements',
    preview: 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-t-lg',
    colors: ['bg-purple-500', 'bg-pink-500', 'bg-orange-500'],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant typography focus',
    preview: 'border-b border-muted',
    colors: ['bg-gray-400', 'bg-gray-500', 'bg-gray-600'],
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Warm amber gradient, professional look',
    preview: 'bg-gradient-to-r from-amber-500/30 to-orange-400/20',
    colors: ['bg-amber-600', 'bg-orange-500', 'bg-amber-700'],
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Modern tech industry style with cyan accents',
    preview: 'bg-gradient-to-b from-cyan-500/30 to-transparent',
    colors: ['bg-cyan-500', 'bg-teal-500', 'bg-emerald-500'],
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Clean medical professional design',
    preview: 'bg-gradient-to-b from-teal-500/25 to-transparent',
    colors: ['bg-teal-600', 'bg-green-600', 'bg-blue-500'],
  },
  {
    id: 'student',
    name: 'Student',
    description: 'Fresh and energetic for new graduates',
    preview: 'bg-gradient-to-r from-indigo-400/25 to-pink-400/20',
    colors: ['bg-indigo-500', 'bg-pink-500', 'bg-violet-500'],
  },
  {
    id: 'entry',
    name: 'Entry Level',
    description: 'Simple and impactful for first jobs',
    preview: 'bg-gradient-to-b from-green-500/25 to-transparent',
    colors: ['bg-green-600', 'bg-lime-500', 'bg-emerald-600'],
  },
];

export const TemplateSelector = ({ selected, onSelect }: TemplateSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Choose a Template</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={cn(
              'relative p-4 rounded-xl border-2 transition-all hover:scale-105',
              selected === template.id 
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                : 'border-border hover:border-primary/50'
            )}
          >
            {selected === template.id && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
            
            {/* Template Preview */}
            <div className="aspect-[8.5/11] bg-white rounded border border-border/50 mb-3 overflow-hidden">
              <div className={cn('h-1/4', template.preview)} />
              <div className="p-2 space-y-1">
                <div className="h-1 bg-gray-200 rounded w-3/4" />
                <div className="h-1 bg-gray-200 rounded w-1/2" />
                <div className="h-0.5 bg-gray-100 rounded w-full mt-2" />
                <div className="h-0.5 bg-gray-100 rounded w-full" />
                <div className="h-0.5 bg-gray-100 rounded w-3/4" />
              </div>
            </div>
            
            <div className="text-left">
              <p className="font-medium text-sm">{template.name}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">{template.description}</p>
            </div>
            
            {/* Color swatches */}
            <div className="flex gap-1 mt-2">
              {template.colors.slice(0, 4).map((color, idx) => (
                <div 
                  key={idx}
                  className={cn('w-4 h-4 rounded-full', color)}
                />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
