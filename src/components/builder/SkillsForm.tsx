import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useResume } from '@/context/ResumeContext';
import { generateId, Skill } from '@/types/resume';
import { Plus, Trash2, Wrench } from 'lucide-react';

const emptySkill: Omit<Skill, 'id'> = {
  category: '',
  items: [],
};

export const SkillsForm = () => {
  const { resume, addSkill, updateSkill, removeSkill } = useResume();
  const [isAdding, setIsAdding] = useState(false);
  const [newSkill, setNewSkill] = useState(emptySkill);
  const [itemsInput, setItemsInput] = useState('');

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
