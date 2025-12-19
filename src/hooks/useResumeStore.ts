import { useState, useEffect, useCallback } from 'react';
import { Resume, emptyResume } from '@/types/resume';
import { supabase } from '@/integrations/supabase/client';

const STORAGE_KEY = 'resume_builder_data';
const CURRENT_RESUME_KEY = 'resume_builder_current';

export const useResumeStore = () => {
  const [resume, setResume] = useState<Resume>(emptyResume);
  const [savedResumes, setSavedResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CURRENT_RESUME_KEY);
    if (stored) {
      try {
        setResume(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored resume:', e);
      }
    }

    const storedList = localStorage.getItem(STORAGE_KEY);
    if (storedList) {
      try {
        setSavedResumes(JSON.parse(storedList));
      } catch (e) {
        console.error('Failed to parse stored resumes:', e);
      }
    }
  }, []);

  // Auto-save to localStorage when resume changes
  useEffect(() => {
    localStorage.setItem(CURRENT_RESUME_KEY, JSON.stringify(resume));
  }, [resume]);

  const updateResume = useCallback((updates: Partial<Resume>) => {
    setResume(prev => ({ ...prev, ...updates }));
  }, []);

  const updatePersonalInfo = useCallback((updates: Partial<Resume['personalInfo']>) => {
    setResume(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...updates },
    }));
  }, []);

  const addEducation = useCallback((education: Resume['education'][0]) => {
    setResume(prev => ({
      ...prev,
      education: [...prev.education, education],
    }));
  }, []);

  const updateEducation = useCallback((id: string, updates: Partial<Resume['education'][0]>) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? { ...e, ...updates } : e),
    }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.filter(e => e.id !== id),
    }));
  }, []);

  const addExperience = useCallback((experience: Resume['experience'][0]) => {
    setResume(prev => ({
      ...prev,
      experience: [...prev.experience, experience],
    }));
  }, []);

  const updateExperience = useCallback((id: string, updates: Partial<Resume['experience'][0]>) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? { ...e, ...updates } : e),
    }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.filter(e => e.id !== id),
    }));
  }, []);

  const addProject = useCallback((project: Resume['projects'][0]) => {
    setResume(prev => ({
      ...prev,
      projects: [...prev.projects, project],
    }));
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Resume['projects'][0]>) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, ...updates } : p),
    }));
  }, []);

  const removeProject = useCallback((id: string) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
    }));
  }, []);

  const addSkill = useCallback((skill: Resume['skills'][0]) => {
    setResume(prev => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));
  }, []);

  const updateSkill = useCallback((id: string, updates: Partial<Resume['skills'][0]>) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === id ? { ...s, ...updates } : s),
    }));
  }, []);

  const removeSkill = useCallback((id: string) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id),
    }));
  }, []);

  const saveToDatabase = useCallback(async (): Promise<string | null> => {
    setIsSaving(true);
    try {
      const payload = {
        title: resume.title,
        personal_info: JSON.parse(JSON.stringify(resume.personalInfo)),
        education: JSON.parse(JSON.stringify(resume.education)),
        experience: JSON.parse(JSON.stringify(resume.experience)),
        projects: JSON.parse(JSON.stringify(resume.projects)),
        skills: JSON.parse(JSON.stringify(resume.skills)),
        ats_score: resume.atsScore || 0,
      };

      if (resume.id) {
        const { error } = await supabase
          .from('resumes')
          .update(payload)
          .eq('id', resume.id);
        
        if (error) throw error;
        return resume.id;
      } else {
        const { data, error } = await supabase
          .from('resumes')
          .insert([payload])
          .select('id')
          .single();
        
        if (error) throw error;
        const newId = data.id;
        setResume(prev => ({ ...prev, id: newId }));
        return newId;
      }
    } catch (error) {
      console.error('Failed to save to database:', error);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [resume]);

  const loadFromDatabase = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      setResume({
        id: data.id,
        title: data.title,
        personalInfo: (data.personal_info || {}) as unknown as Resume['personalInfo'],
        education: (data.education || []) as unknown as Resume['education'],
        experience: (data.experience || []) as unknown as Resume['experience'],
        projects: (data.projects || []) as unknown as Resume['projects'],
        skills: (data.skills || []) as unknown as Resume['skills'],
        atsScore: data.ats_score ?? undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      });
    } catch (error) {
      console.error('Failed to load from database:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createNewResume = useCallback(() => {
    setResume({ ...emptyResume });
  }, []);

  const calculateProgress = useCallback(() => {
    let filled = 0;
    let total = 5;

    if (resume.personalInfo.fullName && resume.personalInfo.email) filled++;
    if (resume.education.length > 0) filled++;
    if (resume.experience.length > 0) filled++;
    if (resume.projects.length > 0) filled++;
    if (resume.skills.length > 0) filled++;

    return Math.round((filled / total) * 100);
  }, [resume]);

  return {
    resume,
    savedResumes,
    isLoading,
    isSaving,
    updateResume,
    updatePersonalInfo,
    addEducation,
    updateEducation,
    removeEducation,
    addExperience,
    updateExperience,
    removeExperience,
    addProject,
    updateProject,
    removeProject,
    addSkill,
    updateSkill,
    removeSkill,
    saveToDatabase,
    loadFromDatabase,
    createNewResume,
    calculateProgress,
  };
};
