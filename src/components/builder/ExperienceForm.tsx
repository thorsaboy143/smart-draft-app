import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useResume } from '@/context/ResumeContext';
import { generateId, Experience } from '@/types/resume';
import { Plus, Trash2, Briefcase, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const emptyExperience: Omit<Experience, 'id'> = {
  company: '',
  position: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  bullets: [''],
};

export const ExperienceForm = () => {
  const { resume, addExperience, updateExperience, removeExperience } = useResume();
  const [isAdding, setIsAdding] = useState(false);
  const [newExperience, setNewExperience] = useState(emptyExperience);
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);

  const handleAdd = () => {
    if (newExperience.company && newExperience.position) {
      addExperience({ ...newExperience, id: generateId() });
      setNewExperience(emptyExperience);
      setIsAdding(false);
    }
  };

  const handleBulletChange = (expId: string, index: number, value: string) => {
    const exp = resume.experience.find(e => e.id === expId);
    if (exp) {
      const newBullets = [...exp.bullets];
      newBullets[index] = value;
      updateExperience(expId, { bullets: newBullets });
    }
  };

  const addBullet = (expId: string) => {
    const exp = resume.experience.find(e => e.id === expId);
    if (exp) {
      updateExperience(expId, { bullets: [...exp.bullets, ''] });
    }
  };

  const removeBullet = (expId: string, index: number) => {
    const exp = resume.experience.find(e => e.id === expId);
    if (exp && exp.bullets.length > 1) {
      updateExperience(expId, { bullets: exp.bullets.filter((_, i) => i !== index) });
    }
  };

  const generateBullets = async (expId: string) => {
    const exp = resume.experience.find(e => e.id === expId);
    if (!exp) return;

    setGeneratingFor(expId);
    try {
      const { data, error } = await supabase.functions.invoke('ai-suggest-bullets', {
        body: { 
          position: exp.position, 
          company: exp.company,
          existingBullets: exp.bullets.filter(b => b.trim())
        }
      });

      if (error) throw error;
      
      if (data?.bullets && Array.isArray(data.bullets)) {
        updateExperience(expId, { bullets: data.bullets });
        toast.success('Bullet points generated!');
      }
    } catch (error) {
      console.error('Failed to generate bullets:', error);
      toast.error('Failed to generate bullet points');
    } finally {
      setGeneratingFor(null);
    }
  };

  return (
    <div className="space-y-6">
      {resume.experience.map((exp) => (
        <Card key={exp.id} className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                {exp.position || 'Untitled Position'} {exp.company && `at ${exp.company}`}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeExperience(exp.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  placeholder="Company Name"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Input
                  placeholder="Software Engineer"
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="San Francisco, CA"
                  value={exp.location}
                  onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  placeholder="Jan 2020"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  placeholder="Present"
                  value={exp.endDate}
                  disabled={exp.current}
                  onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onCheckedChange={(checked) => 
                    updateExperience(exp.id, { current: !!checked, endDate: checked ? 'Present' : '' })
                  }
                />
                <Label htmlFor={`current-${exp.id}`}>Currently working here</Label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Bullet Points</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateBullets(exp.id)}
                  disabled={generatingFor === exp.id || !exp.position}
                >
                  {generatingFor === exp.id ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  AI Suggest
                </Button>
              </div>
              {exp.bullets.map((bullet, idx) => (
                <div key={idx} className="flex gap-2">
                  <Textarea
                    placeholder="Describe your achievement or responsibility..."
                    value={bullet}
                    onChange={(e) => handleBulletChange(exp.id, idx, e.target.value)}
                    className="min-h-[60px]"
                  />
                  {exp.bullets.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBullet(exp.id, idx)}
                      className="shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={() => addBullet(exp.id)}>
                <Plus className="w-4 h-4 mr-2" /> Add Bullet Point
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {isAdding ? (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Add New Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company *</Label>
                <Input
                  placeholder="Company Name"
                  value={newExperience.company}
                  onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Position *</Label>
                <Input
                  placeholder="Software Engineer"
                  value={newExperience.position}
                  onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="San Francisco, CA"
                  value={newExperience.location}
                  onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  placeholder="Jan 2020"
                  value={newExperience.startDate}
                  onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  placeholder="Present"
                  value={newExperience.endDate}
                  disabled={newExperience.current}
                  onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="current-new"
                  checked={newExperience.current}
                  onCheckedChange={(checked) => 
                    setNewExperience({ ...newExperience, current: !!checked, endDate: checked ? 'Present' : '' })
                  }
                />
                <Label htmlFor="current-new">Currently working here</Label>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd}>Add Experience</Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button variant="outline" onClick={() => setIsAdding(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" /> Add Experience
        </Button>
      )}
    </div>
  );
};
