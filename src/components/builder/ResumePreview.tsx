import { useResume } from '@/context/ResumeContext';
import { cn } from '@/lib/utils';

interface ResumePreviewProps {
  template?: 'modern' | 'classic' | 'professional' | 'creative' | 'minimal';
}

export const ResumePreview = ({ template = 'modern' }: ResumePreviewProps) => {
  const { resume } = useResume();
  const { personalInfo, education, experience, projects, skills } = resume;

  const templateStyles = {
    modern: {
      header: 'bg-primary text-primary-foreground p-6',
      headerName: 'text-2xl font-bold',
      section: 'border-l-2 border-primary pl-4',
      sectionTitle: 'text-primary font-semibold text-sm uppercase tracking-wide mb-2',
    },
    classic: {
      header: 'border-b-2 border-foreground pb-4 mb-4',
      headerName: 'text-2xl font-serif font-bold text-center',
      section: 'mb-4',
      sectionTitle: 'text-foreground font-serif font-bold text-base border-b border-muted-foreground pb-1 mb-2',
    },
    professional: {
      header: 'bg-slate-800 text-white p-6',
      headerName: 'text-2xl font-bold',
      section: 'mb-4',
      sectionTitle: 'text-slate-800 font-bold text-sm uppercase tracking-wide border-b-2 border-slate-300 pb-1 mb-2',
    },
    creative: {
      header: 'bg-gradient-to-r from-purple-600 to-blue-500 text-white p-6 rounded-lg',
      headerName: 'text-2xl font-bold',
      section: 'bg-muted/30 p-4 rounded-lg mb-4',
      sectionTitle: 'text-purple-600 font-bold text-sm uppercase tracking-wide mb-2',
    },
    minimal: {
      header: 'pb-4 mb-4',
      headerName: 'text-3xl font-light',
      section: 'mb-4',
      sectionTitle: 'text-muted-foreground font-medium text-xs uppercase tracking-widest mb-3',
    },
  };

  const styles = templateStyles[template];

  return (
    <div className="resume-preview bg-white text-black p-8 shadow-lg max-w-[8.5in] mx-auto" style={{ minHeight: '11in' }}>
      {/* Header */}
      <header className={cn(styles.header, template === 'minimal' && 'border-b border-gray-200')}>
        <h1 className={styles.headerName}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div className={cn(
          'flex flex-wrap gap-3 text-sm mt-2',
          template === 'classic' && 'justify-center',
          (template === 'modern' || template === 'professional' || template === 'creative') && 'text-white/90'
        )}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          {personalInfo.website && <span>• {personalInfo.website}</span>}
        </div>
      </header>

      <div className={cn('space-y-4', (template === 'modern' || template === 'professional' || template === 'creative') && 'mt-6')}>
        {/* Summary */}
        {personalInfo.summary && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Professional Summary</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Work Experience</h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-sm">{exp.position}</h3>
                      <p className="text-sm text-gray-600">{exp.company}{exp.location && ` • ${exp.location}`}</p>
                    </div>
                    <span className="text-xs text-gray-500 shrink-0">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.bullets.filter(b => b.trim()).length > 0 && (
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {exp.bullets.filter(b => b.trim()).map((bullet, idx) => (
                        <li key={idx} className="text-sm text-gray-700">{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Education</h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-sm">{edu.degree} in {edu.field}</h3>
                      <p className="text-sm text-gray-600">{edu.institution}</p>
                    </div>
                    <span className="text-xs text-gray-500 shrink-0">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  {edu.gpa && <p className="text-xs text-gray-500 mt-1">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Projects</h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-sm">{proj.name}</h3>
                    {proj.url && (
                      <span className="text-xs text-blue-600">{proj.url}</span>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-sm text-gray-600 mt-1">{proj.description}</p>
                  )}
                  {proj.technologies.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Technologies: {proj.technologies.join(', ')}
                    </p>
                  )}
                  {proj.bullets.filter(b => b.trim()).length > 0 && (
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {proj.bullets.filter(b => b.trim()).map((bullet, idx) => (
                        <li key={idx} className="text-sm text-gray-700">{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Skills</h2>
            <div className="space-y-2">
              {skills.map((skill) => (
                <div key={skill.id} className="text-sm">
                  <span className="font-medium">{skill.category}: </span>
                  <span className="text-gray-700">{skill.items.join(', ')}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
