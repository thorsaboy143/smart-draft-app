import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useResume } from '@/context/ResumeContext';
import { generateId, Skill } from '@/types/resume';
import { Plus, Trash2, Wrench, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const emptySkill: Omit<Skill, 'id'> = {
  category: '',
  items: [],
};

export const SkillsForm = () => {
  const { resume, addSkill, updateSkill, removeSkill, updateResume } = useResume();
  const [isAdding, setIsAdding] = useState(false);
  const [newSkill, setNewSkill] = useState(emptySkill);
  const [itemsInput, setItemsInput] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleAdd = () => {
    if (newSkill.category && newSkill.items.length > 0) {
      addSkill({ ...newSkill, id: generateId() });
      setNewSkill(emptySkill);
      setItemsInput('');
      setIsAdding(false);
    }
  };

  const handleItemsChange = (skillId: string, value: string) => {
    const items = value.split(',').map(i => i.trim()).filter(Boolean);
    updateSkill(skillId, { items });
  };

  const suggestedCategories = [
    'Programming Languages',
    'Frameworks & Libraries',
    'Databases',
    'Tools & Technologies',
    'Soft Skills',
    'Languages',
  ];

  const mergeSuggestedSkills = (existing: Skill[], suggested: Array<{ category: string; items: string[] }>): Skill[] => {
    const normalize = (value: string) => value.trim().toLowerCase();

    const next: Skill[] = existing.map((s) => ({
      ...s,
      items: (s.items ?? []).map((i) => i.trim()).filter(Boolean),
    }));

    for (const suggestion of suggested) {
      const category = (suggestion?.category ?? '').trim();
      const items = (suggestion?.items ?? []).map((i) => i.trim()).filter(Boolean);
      if (!category || items.length === 0) continue;

      const existingIndex = next.findIndex((s) => normalize(s.category) === normalize(category));
      if (existingIndex >= 0) {
        const current = next[existingIndex];
        const existingSet = new Set(current.items.map(normalize));
        const mergedItems = [...current.items];
        for (const item of items) {
          const key = normalize(item);
          if (!existingSet.has(key)) {
            mergedItems.push(item);
            existingSet.add(key);
          }
        }
        next[existingIndex] = { ...current, category: current.category || category, items: mergedItems };
      } else {
        next.push({ id: generateId(), category, items: Array.from(new Set(items.map((i) => i.trim()))).filter(Boolean) });
      }
    }

    return next;
  };

  const suggestSkills = async () => {
    setIsSuggesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-suggest-skills', {
        body: { resume },
      });

      if (error) {
        const anyError = error as any;
        const body = anyError?.context?.body;
        const status = anyError?.context?.status;

        if (typeof body === 'string' && body.trim()) {
          try {
            const parsed = JSON.parse(body);
            const msg = typeof parsed?.error === 'string' ? parsed.error : undefined;
            throw new Error(msg || anyError?.message || `Skill suggestion failed${typeof status === 'number' ? ` (status ${status})` : ''}`);
          } catch {
            throw new Error(anyError?.message || body || `Skill suggestion failed${typeof status === 'number' ? ` (status ${status})` : ''}`);
          }
        }

        if (body && typeof body === 'object') {
          const msg = typeof (body as any)?.error === 'string' ? (body as any).error : undefined;
          throw new Error(msg || anyError?.message || `Skill suggestion failed${typeof status === 'number' ? ` (status ${status})` : ''}`);
        }

        throw new Error(anyError?.message || `Skill suggestion failed${typeof status === 'number' ? ` (status ${status})` : ''}`);
      }

      const suggested = data?.skills;
      if (!Array.isArray(suggested) || suggested.length === 0) {
        toast.error('No skill suggestions returned');
        return;
      }

      const merged = mergeSuggestedSkills(resume.skills, suggested);
      updateResume({ skills: merged });
      toast.success('Skill suggestions added!');
    } catch (error) {
      console.error('Failed to suggest skills:', error);
      const anyError = error as any;
      const message =
        (error instanceof Error && error.message) ||
        (typeof anyError?.message === 'string' && anyError.message) ||
        (typeof anyError?.error === 'string' && anyError.error) ||
        (typeof anyError?.details === 'string' && anyError.details) ||
        'Failed to generate skill suggestions';
      toast.error(message);
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground mb-4">
        Group your skills by category for better ATS parsing. Common categories include:
        <div className="flex flex-wrap gap-2 mt-2">
          {suggestedCategories.map((cat) => (
            <span key={cat} className="px-2 py-1 bg-muted rounded text-xs">
              {cat}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={suggestSkills} disabled={isSuggesting}>
          {isSuggesting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Suggesting…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" /> Suggest skills
            </>
          )}
        </Button>
      </div>

      {resume.skills.map((skill) => (
        <Card key={skill.id} className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Wrench className="w-5 h-5 text-primary" />
                {skill.category || 'Untitled Category'}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSkill(skill.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                placeholder="Programming Languages"
                value={skill.category}
                onChange={(e) => updateSkill(skill.id, { category: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Skills (comma-separated)</Label>
              <Input
                placeholder="JavaScript, Python, TypeScript, Go"
                value={skill.items.join(', ')}
                onChange={(e) => handleItemsChange(skill.id, e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {isAdding ? (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Add Skill Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Input
                placeholder="Programming Languages"
                value={newSkill.category}
                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Skills (comma-separated) *</Label>
              <Input
                placeholder="JavaScript, Python, TypeScript"
                value={itemsInput}
                onChange={(e) => {
                  setItemsInput(e.target.value);
                  setNewSkill({
                    ...newSkill,
                    items: e.target.value.split(',').map(i => i.trim()).filter(Boolean)
                  });
                }}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd}>Add Skills</Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button variant="outline" onClick={() => setIsAdding(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" /> Add Skill Category
        </Button>
      )}
    </div>
  );
};
