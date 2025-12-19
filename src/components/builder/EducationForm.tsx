import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useResume } from '@/context/ResumeContext';
import { generateId, Education } from '@/types/resume';
import { Plus, Trash2, GraduationCap } from 'lucide-react';

const emptyEducation: Omit<Education, 'id'> = {
  institution: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
  gpa: '',
  highlights: [],
};

export const EducationForm = () => {
  const { resume, addEducation, updateEducation, removeEducation } = useResume();
  const [isAdding, setIsAdding] = useState(false);
  const [newEducation, setNewEducation] = useState(emptyEducation);

  const handleAdd = () => {
    if (newEducation.institution && newEducation.degree) {
      addEducation({ ...newEducation, id: generateId() });
      setNewEducation(emptyEducation);
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      {resume.education.map((edu) => (
        <Card key={edu.id} className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                {edu.institution || 'Untitled Education'}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeEducation(edu.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Institution</Label>
                <Input
                  placeholder="University Name"
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Degree</Label>
                <Input
                  placeholder="Bachelor of Science"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Field of Study</Label>
                <Input
                  placeholder="Computer Science"
                  value={edu.field}
                  onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>GPA (optional)</Label>
                <Input
                  placeholder="3.8/4.0"
                  value={edu.gpa || ''}
                  onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  placeholder="Sep 2018"
                  value={edu.startDate}
                  onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  placeholder="May 2022"
                  value={edu.endDate}
                  onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {isAdding ? (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Add New Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Institution *</Label>
                <Input
                  placeholder="University Name"
                  value={newEducation.institution}
                  onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Degree *</Label>
                <Input
                  placeholder="Bachelor of Science"
                  value={newEducation.degree}
                  onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Field of Study</Label>
                <Input
                  placeholder="Computer Science"
                  value={newEducation.field}
                  onChange={(e) => setNewEducation({ ...newEducation, field: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>GPA (optional)</Label>
                <Input
                  placeholder="3.8/4.0"
                  value={newEducation.gpa || ''}
                  onChange={(e) => setNewEducation({ ...newEducation, gpa: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  placeholder="Sep 2018"
                  value={newEducation.startDate}
                  onChange={(e) => setNewEducation({ ...newEducation, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  placeholder="May 2022"
                  value={newEducation.endDate}
                  onChange={(e) => setNewEducation({ ...newEducation, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd}>Add Education</Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button variant="outline" onClick={() => setIsAdding(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" /> Add Education
        </Button>
      )}
    </div>
  );
};
