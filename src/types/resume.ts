export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  summary?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  highlights?: string[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  bullets: string[];
}

export interface Skill {
  id: string;
  category: string;
  items: string[];
}

export interface Resume {
  id?: string;
  title: string;
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: Skill[];
  atsScore?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ATSAnalysis {
  score: number;
  keywordMatch: number;
  missingSections: string[];
  suggestions: string[];
  grammarIssues: number;
  formattingScore: number;
}

export const emptyResume: Resume = {
  title: 'Untitled Resume',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: '',
  },
  education: [],
  experience: [],
  projects: [],
  skills: [],
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};
