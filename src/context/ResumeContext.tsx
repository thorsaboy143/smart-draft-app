import React, { createContext, useContext, ReactNode } from 'react';
import { useResumeStore } from '@/hooks/useResumeStore';

type ResumeContextType = ReturnType<typeof useResumeStore>;

const ResumeContext = createContext<ResumeContextType | null>(null);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const store = useResumeStore();
  
  return (
    <ResumeContext.Provider value={store}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
