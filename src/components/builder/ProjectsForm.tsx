import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useResume } from '@/context/ResumeContext';
import { generateId, Project } from '@/types/resume';
import { Plus, Trash2, FolderKanban } from 'lucide-react';

const emptyProject: Omit<Project, 'id'> = {
  name: '',
  description: '',
  technologies: [],
  url: '',
  bullets: [''],
};

export const ProjectsForm = () => {
  const { resume, addProject, updateProject, removeProject } = useResume();
  const [isAdding, setIsAdding] = useState(false);
  const [newProject, setNewProject] = useState(emptyProject);
  const [techInput, setTechInput] = useState('');

  const handleAdd = () => {
    if (newProject.name) {
      addProject({ ...newProject, id: generateId() });
      setNewProject(emptyProject);
      setTechInput('');
      setIsAdding(false);
    }
  };

  const handleBulletChange = (projId: string, index: number, value: string) => {
    const proj = resume.projects.find(p => p.id === projId);
    if (proj) {
      const newBullets = [...proj.bullets];
      newBullets[index] = value;
      updateProject(projId, { bullets: newBullets });
    }
  };

  const addBullet = (projId: string) => {
    const proj = resume.projects.find(p => p.id === projId);
    if (proj) {
      updateProject(projId, { bullets: [...proj.bullets, ''] });
    }
  };

  const removeBullet = (projId: string, index: number) => {
    const proj = resume.projects.find(p => p.id === projId);
    if (proj && proj.bullets.length > 1) {
      updateProject(projId, { bullets: proj.bullets.filter((_, i) => i !== index) });
    }
  };

  const handleTechChange = (projId: string, value: string) => {
    const technologies = value.split(',').map(t => t.trim()).filter(Boolean);
    updateProject(projId, { technologies });
  };

  return (
    <div className="space-y-6">
      {resume.projects.map((proj) => (
        <Card key={proj.id} className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-primary" />
                {proj.name || 'Untitled Project'}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeProject(proj.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Project Name</Label>
                <Input
                  placeholder="My Awesome Project"
                  value={proj.name}
                  onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>URL (optional)</Label>
                <Input
                  placeholder="https://github.com/..."
                  value={proj.url || ''}
                  onChange={(e) => updateProject(proj.id, { url: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Brief description of the project..."
                value={proj.description}
                onChange={(e) => updateProject(proj.id, { description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Technologies (comma-separated)</Label>
              <Input
                placeholder="React, Node.js, PostgreSQL"
                value={proj.technologies.join(', ')}
                onChange={(e) => handleTechChange(proj.id, e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Key Points</Label>
              {proj.bullets.map((bullet, idx) => (
                <div key={idx} className="flex gap-2">
                  <Textarea
                    placeholder="Describe a key feature or achievement..."
                    value={bullet}
                    onChange={(e) => handleBulletChange(proj.id, idx, e.target.value)}
                    className="min-h-[60px]"
                  />
                  {proj.bullets.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBullet(proj.id, idx)}
                      className="shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={() => addBullet(proj.id)}>
                <Plus className="w-4 h-4 mr-2" /> Add Point
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {isAdding ? (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Add New Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Project Name *</Label>
                <Input
                  placeholder="My Awesome Project"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>URL (optional)</Label>
                <Input
                  placeholder="https://github.com/..."
                  value={newProject.url || ''}
                  onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Brief description..."
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Technologies (comma-separated)</Label>
              <Input
                placeholder="React, Node.js, PostgreSQL"
                value={techInput}
                onChange={(e) => {
                  setTechInput(e.target.value);
                  setNewProject({ 
                    ...newProject, 
                    technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean) 
                  });
                }}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd}>Add Project</Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button variant="outline" onClick={() => setIsAdding(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      )}
    </div>
  );
};
