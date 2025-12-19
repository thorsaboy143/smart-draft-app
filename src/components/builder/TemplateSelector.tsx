import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface TemplateSelectorProps {
  selected: ResumeTemplate;
  onSelect: (template: ResumeTemplate) => void;
  selectedAccent: ResumeTemplateAccent;
  onAccentSelect: (accent: ResumeTemplateAccent) => void;
}

export const resumeTemplates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean design with accent color header',
    preview: 'bg-gradient-to-b from-primary/20 to-transparent',
    accents: [
      { id: 'primary', swatch: 'bg-primary' },
      { id: 'blue', swatch: 'bg-blue-500' },
      { id: 'green', swatch: 'bg-green-500' },
    ],
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional layout with serif fonts',
    preview: 'border-b-4 border-foreground',
    accents: [
      { id: 'gray', swatch: 'bg-gray-900' },
      { id: 'blue', swatch: 'bg-blue-900' },
      { id: 'green', swatch: 'bg-green-900' },
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate style with dark header',
    preview: 'bg-gradient-to-b from-slate-800 to-transparent',
    accents: [
      { id: 'slate', swatch: 'bg-slate-800' },
      { id: 'blue', swatch: 'bg-blue-800' },
      { id: 'gray', swatch: 'bg-gray-800' },
    ],
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Gradient header with rounded elements',
    preview: 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-t-lg',
    accents: [
      { id: 'purple', swatch: 'bg-purple-500' },
      { id: 'pink', swatch: 'bg-pink-500' },
      { id: 'orange', swatch: 'bg-orange-500' },
    ],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant typography focus',
    preview: 'border-b border-muted',
    accents: [
      { id: 'gray', swatch: 'bg-gray-400' },
      { id: 'slate', swatch: 'bg-gray-500' },
      { id: 'gray-dark', swatch: 'bg-gray-600' },
    ],
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Warm amber gradient, professional look',
    preview: 'bg-gradient-to-r from-amber-500/30 to-orange-400/20',
    accents: [
      { id: 'amber', swatch: 'bg-amber-600' },
      { id: 'orange', swatch: 'bg-orange-500' },
      { id: 'amber-dark', swatch: 'bg-amber-700' },
    ],
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Modern tech industry style with cyan accents',
    preview: 'bg-gradient-to-b from-cyan-500/30 to-transparent',
    accents: [
      { id: 'cyan', swatch: 'bg-cyan-500' },
      { id: 'teal', swatch: 'bg-teal-500' },
      { id: 'emerald', swatch: 'bg-emerald-500' },
    ],
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Clean medical professional design',
    preview: 'bg-gradient-to-b from-teal-500/25 to-transparent',
    accents: [
      { id: 'teal', swatch: 'bg-teal-600' },
      { id: 'green', swatch: 'bg-green-600' },
      { id: 'blue', swatch: 'bg-blue-500' },
    ],
  },
  {
    id: 'student',
    name: 'Student',
    description: 'Fresh and energetic for new graduates',
    preview: 'bg-gradient-to-r from-indigo-400/25 to-pink-400/20',
    accents: [
      { id: 'indigo', swatch: 'bg-indigo-500' },
      { id: 'pink', swatch: 'bg-pink-500' },
      { id: 'violet', swatch: 'bg-violet-500' },
    ],
  },
  {
    id: 'entry',
    name: 'Entry Level',
    description: 'Simple and impactful for first jobs',
    preview: 'bg-gradient-to-b from-green-500/25 to-transparent',
    accents: [
      { id: 'green', swatch: 'bg-green-600' },
      { id: 'lime', swatch: 'bg-lime-500' },
      { id: 'emerald', swatch: 'bg-emerald-600' },
    ],
  },
] as const;

export type ResumeTemplate = (typeof resumeTemplates)[number]['id'];
export type ResumeTemplateAccent = (typeof resumeTemplates)[number]['accents'][number]['id'];

export const getDefaultTemplateAccent = (template: ResumeTemplate): ResumeTemplateAccent => {
  const found = resumeTemplates.find((t) => t.id === template);
  return found?.accents?.[0]?.id ?? 'primary';
};

export const getTemplateAccents = (template: ResumeTemplate) => {
  const found = resumeTemplates.find((t) => t.id === template);
  return found?.accents ?? [];
};

export const TemplateSelector = ({ selected, onSelect, selectedAccent, onAccentSelect }: TemplateSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Choose a Template</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {resumeTemplates.map((template) => (
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
              {template.accents.slice(0, 4).map((accent) => {
                const isSelected = selected === template.id && selectedAccent === accent.id;
                return (
                  <span
                    key={accent.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${template.name} color ${accent.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onSelect(template.id);
                      onAccentSelect(accent.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        onSelect(template.id);
                        onAccentSelect(accent.id);
                      }
                    }}
                    className={cn(
                      'inline-block w-4 h-4 rounded-full border border-border/60 cursor-pointer',
                      accent.swatch,
                      isSelected && 'ring-2 ring-foreground ring-offset-2 ring-offset-background'
                    )}
                  />
                );
              })}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
