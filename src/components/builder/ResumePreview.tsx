import { useResume } from '@/context/ResumeContext';
import { cn } from '@/lib/utils';
import type { ResumeTemplate, ResumeTemplateAccent } from './TemplateSelector';

interface ResumePreviewProps {
  template?: ResumeTemplate;
  accent?: ResumeTemplateAccent;
}

export const ResumePreview = ({ template = 'modern', accent = 'primary' }: ResumePreviewProps) => {
  const { resume } = useResume();
  const { personalInfo, education, experience, projects, skills } = resume;

  // Modern Template - Clean left sidebar with accent color
  if (template === 'modern') {
    const sidebarClass =
      accent === 'primary'
        ? 'bg-primary text-primary-foreground'
        : accent === 'blue'
          ? 'bg-blue-700 text-white'
          : accent === 'green'
            ? 'bg-green-700 text-white'
            : 'bg-slate-800 text-white';

    return (
      <div className="resume-preview bg-white text-gray-900 shadow-lg w-full max-w-[8.5in] mx-auto flex flex-col sm:flex-row" style={{ minHeight: '11in' }}>
        {/* Left Sidebar */}
        <div className={cn('w-full sm:w-[2.5in] p-4 sm:p-5 flex-shrink-0', sidebarClass)}>
          <div className="mb-6">
            <h1 className="text-xl font-bold leading-tight">{personalInfo.fullName || 'Your Name'}</h1>
          </div>
          
          <div className="space-y-5 text-sm">
            <div>
              <h3 className="font-bold text-white/80 uppercase text-xs tracking-wider mb-2 border-b border-white/20 pb-1">Contact</h3>
              <div className="space-y-1.5 text-white/80">
                {personalInfo.email && <p className="text-xs break-words">{personalInfo.email}</p>}
                {personalInfo.phone && <p className="text-xs">{personalInfo.phone}</p>}
                {personalInfo.location && <p className="text-xs">{personalInfo.location}</p>}
                {personalInfo.linkedin && <p className="text-xs break-words">{personalInfo.linkedin}</p>}
                {personalInfo.website && <p className="text-xs break-words">{personalInfo.website}</p>}
              </div>
            </div>

            {skills.length > 0 && (
              <div>
                <h3 className="font-bold text-white/80 uppercase text-xs tracking-wider mb-2 border-b border-white/20 pb-1">Skills</h3>
                {skills.map((skill) => (
                  <div key={skill.id} className="mb-3">
                    <p className="font-semibold text-xs text-white">{skill.category}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {skill.items.map((item, idx) => (
                        <span key={idx} className="text-xs text-white/75">• {item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {education.length > 0 && (
              <div>
                <h3 className="font-bold text-white/80 uppercase text-xs tracking-wider mb-2 border-b border-white/20 pb-1">Education</h3>
                {education.map((edu) => (
                  <div key={edu.id} className="mb-3">
                    <p className="font-semibold text-xs">{edu.degree}</p>
                    <p className="text-xs text-white/75">{edu.field}</p>
                    <p className="text-xs text-white/65">{edu.institution}</p>
                    <p className="text-xs text-white/55">{edu.startDate} - {edu.endDate}</p>
                    {edu.gpa && <p className="text-xs text-white/65">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6">
          {personalInfo.summary && (
            <section className="mb-5">
              <h2 className="text-slate-800 font-bold text-sm uppercase tracking-wide border-b-2 border-slate-800 pb-1 mb-3">Professional Summary</h2>
              <p className="text-sm text-gray-700 leading-relaxed">{personalInfo.summary}</p>
            </section>
          )}

          {experience.length > 0 && (
            <section className="mb-5">
              <h2 className="text-slate-800 font-bold text-sm uppercase tracking-wide border-b-2 border-slate-800 pb-1 mb-3">Work Experience</h2>
              {experience.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">{exp.position}</h3>
                      <p className="text-sm text-gray-600">{exp.company}{exp.location && ` • ${exp.location}`}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {exp.bullets.filter(b => b.trim()).map((bullet, idx) => (
                      <li key={idx} className="text-xs text-gray-700 flex">
                        <span className="text-slate-800 mr-2">▪</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <h2 className="text-slate-800 font-bold text-sm uppercase tracking-wide border-b-2 border-slate-800 pb-1 mb-3">Projects</h2>
              {projects.map((proj) => (
                <div key={proj.id} className="mb-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm">{proj.name}</h3>
                    {proj.url && <span className="text-xs text-blue-600">{proj.url}</span>}
                  </div>
                  {proj.technologies.length > 0 && (
                    <p className="text-xs text-gray-500 mt-0.5">{proj.technologies.join(' • ')}</p>
                  )}
                  <ul className="mt-1">
                    {proj.bullets.filter(b => b.trim()).map((bullet, idx) => (
                      <li key={idx} className="text-xs text-gray-700 flex">
                        <span className="text-slate-800 mr-2">▪</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    );
  }

  // Classic Template - Traditional single-column centered
  if (template === 'classic') {
    const classicBorder =
      accent === 'blue'
        ? 'border-blue-900'
        : accent === 'green'
          ? 'border-green-900'
          : 'border-gray-900';

    return (
      <div className="resume-preview bg-white text-gray-900 p-4 sm:p-8 shadow-lg w-full max-w-[8.5in] mx-auto" style={{ minHeight: '11in' }}>
        <header className={cn('text-center border-b-2 pb-4 mb-5', classicBorder)}>
          <h1 className="text-2xl font-serif font-bold tracking-wide uppercase">{personalInfo.fullName || 'Your Name'}</h1>
          <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-sm mt-2 text-gray-600">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          </div>
        </header>

        {personalInfo.summary && (
          <section className="mb-5">
            <h2 className="font-serif font-bold text-sm uppercase border-b border-gray-300 pb-1 mb-2">Objective</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="mb-5">
            <h2 className="font-serif font-bold text-sm uppercase border-b border-gray-300 pb-1 mb-3">Professional Experience</h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-sm">{exp.position}</span>
                    <span className="text-gray-600 text-sm">, {exp.company}</span>
                    {exp.location && <span className="text-gray-500 text-sm">, {exp.location}</span>}
                  </div>
                  <span className="text-xs text-gray-500">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <ul className="list-disc list-inside mt-1.5 ml-2">
                  {exp.bullets.filter(b => b.trim()).map((bullet, idx) => (
                    <li key={idx} className="text-sm text-gray-700">{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section className="mb-5">
            <h2 className="font-serif font-bold text-sm uppercase border-b border-gray-300 pb-1 mb-3">Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2 flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-sm">{edu.degree} in {edu.field}</span>
                  <span className="text-gray-600 text-sm">, {edu.institution}</span>
                  {edu.gpa && <span className="text-sm text-gray-500 ml-2">(GPA: {edu.gpa})</span>}
                </div>
                <span className="text-xs text-gray-500">{edu.endDate}</span>
              </div>
            ))}
          </section>
        )}

        {projects.length > 0 && (
          <section className="mb-5">
            <h2 className="font-serif font-bold text-sm uppercase border-b border-gray-300 pb-1 mb-3">Projects</h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-3">
                <div className="flex justify-between">
                  <span className="font-bold text-sm">{proj.name}</span>
                  {proj.technologies.length > 0 && <span className="text-xs text-gray-500">{proj.technologies.join(', ')}</span>}
                </div>
                <ul className="list-disc list-inside mt-1 ml-2">
                  {proj.bullets.filter(b => b.trim()).map((bullet, idx) => (
                    <li key={idx} className="text-sm text-gray-700">{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h2 className="font-serif font-bold text-sm uppercase border-b border-gray-300 pb-1 mb-3">Skills</h2>
            <div className="space-y-1.5">
              {skills.map((skill) => (
                <p key={skill.id} className="text-sm">
                  <span className="font-bold">{skill.category}:</span> {skill.items.join(', ')}
                </p>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // Professional Template - Header banner with right sidebar
  if (template === 'professional') {
    const p =
      accent === 'gray'
        ? {
            headerBg: 'bg-gray-900',
            headerText: 'text-white/80',
            title: 'text-gray-900',
            border: 'border-gray-200',
            company: 'text-gray-700',
            tagBg: 'bg-gray-100',
            tagText: 'text-gray-800',
          }
        : accent === 'slate'
          ? {
              headerBg: 'bg-slate-900',
              headerText: 'text-white/80',
              title: 'text-slate-900',
              border: 'border-slate-200',
              company: 'text-slate-700',
              tagBg: 'bg-slate-100',
              tagText: 'text-slate-800',
            }
          : {
              headerBg: 'bg-blue-900',
              headerText: 'text-blue-100',
              title: 'text-blue-900',
              border: 'border-blue-200',
              company: 'text-blue-700',
              tagBg: 'bg-blue-100',
              tagText: 'text-blue-800',
            };

    return (
      <div className="resume-preview bg-white text-gray-900 shadow-lg w-full max-w-[8.5in] mx-auto" style={{ minHeight: '11in' }}>
        <header className={cn('text-white p-4 sm:p-6', p.headerBg)}>
          <h1 className="text-2xl font-bold">{personalInfo.fullName || 'Your Name'}</h1>
          <div className={cn('flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm', p.headerText)}>
            {personalInfo.email && <span>✉ {personalInfo.email}</span>}
            {personalInfo.phone && <span>☏ {personalInfo.phone}</span>}
            {personalInfo.location && <span>📍 {personalInfo.location}</span>}
            {personalInfo.linkedin && <span>🔗 {personalInfo.linkedin}</span>}
          </div>
        </header>

        <div className="flex flex-col sm:flex-row">
          {/* Main Content - 2/3 width */}
          <div className="w-full sm:w-2/3 p-4 sm:p-6 border-b border-gray-100 sm:border-b-0 sm:border-r">
            {personalInfo.summary && (
              <section className="mb-5">
                <h2 className={cn('font-bold uppercase text-sm tracking-wide border-b-2 pb-1 mb-3', p.title, p.border)}>Summary</h2>
                <p className="text-sm text-gray-700 leading-relaxed">{personalInfo.summary}</p>
              </section>
            )}

            {experience.length > 0 && (
              <section className="mb-5">
                <h2 className={cn('font-bold uppercase text-sm tracking-wide border-b-2 pb-1 mb-3', p.title, p.border)}>Experience</h2>
                {experience.map((exp) => (
                  <div key={exp.id} className={cn('mb-4 pl-3 border-l-2', p.border)}>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-sm">{exp.position}</h3>
                      <span className="text-xs text-gray-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    <p className={cn('text-sm', p.company)}>{exp.company}{exp.location && `, ${exp.location}`}</p>
                    <ul className="mt-1.5 space-y-1">
                      {exp.bullets.filter(b => b.trim()).map((bullet, idx) => (
                        <li key={idx} className="text-xs text-gray-700">• {bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            )}

            {projects.length > 0 && (
              <section>
                <h2 className={cn('font-bold uppercase text-sm tracking-wide border-b-2 pb-1 mb-3', p.title, p.border)}>Projects</h2>
                {projects.map((proj) => (
                  <div key={proj.id} className={cn('mb-3 pl-3 border-l-2', p.border)}>
                    <h3 className="font-bold text-sm">{proj.name}</h3>
                    {proj.technologies.length > 0 && (
                      <p className={cn('text-xs', p.company)}>{proj.technologies.join(' • ')}</p>
                    )}
                    <ul className="mt-1">
                      {proj.bullets.filter(b => b.trim()).map((bullet, idx) => (
                        <li key={idx} className="text-xs text-gray-700">• {bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            )}
          </div>

          {/* Right Sidebar - 1/3 width */}
          <div className="w-full sm:w-1/3 bg-gray-50 p-4 sm:p-5">
            {education.length > 0 && (
              <section className="mb-5">
                <h2 className={cn('font-bold uppercase text-xs tracking-wide mb-3', p.title)}>Education</h2>
                {education.map((edu) => (
                  <div key={edu.id} className="mb-3 pb-2 border-b border-gray-200 last:border-0">
                    <p className="font-bold text-sm">{edu.degree}</p>
                    <p className="text-xs text-gray-600">{edu.field}</p>
                    <p className="text-xs text-gray-500">{edu.institution}</p>
                    <p className={cn('text-xs', p.company)}>{edu.startDate} - {edu.endDate}</p>
                    {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </section>
            )}

            {skills.length > 0 && (
              <section>
                <h2 className={cn('font-bold uppercase text-xs tracking-wide mb-3', p.title)}>Skills</h2>
                {skills.map((skill) => (
                  <div key={skill.id} className="mb-3">
                    <p className="font-semibold text-xs text-gray-700">{skill.category}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {skill.items.map((item, idx) => (
                        <span key={idx} className={cn('px-2 py-0.5 rounded text-xs', p.tagBg, p.tagText)}>{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Creative Template - Bold asymmetric with gradients
  if (template === 'creative') {
    const c =
      accent === 'orange'
        ? {
            headerGradient: 'from-orange-600 via-amber-500 to-rose-500',
            nameGradient: 'from-orange-600 to-rose-500',
            sectionText: 'text-orange-700',
            pill: 'bg-orange-100 text-orange-700',
            railGradient: 'before:from-orange-500 before:to-rose-500',
          }
        : accent === 'pink'
          ? {
              headerGradient: 'from-pink-600 via-rose-500 to-fuchsia-500',
              nameGradient: 'from-pink-600 to-fuchsia-500',
              sectionText: 'text-pink-700',
              pill: 'bg-pink-100 text-pink-700',
              railGradient: 'before:from-pink-500 before:to-fuchsia-500',
            }
          : {
              headerGradient: 'from-violet-600 via-fuchsia-500 to-pink-500',
              nameGradient: 'from-violet-600 to-fuchsia-500',
              sectionText: 'text-violet-700',
              pill: 'bg-violet-100 text-violet-700',
              railGradient: 'before:from-violet-500 before:to-fuchsia-500',
            };

    return (
      <div className="resume-preview bg-white text-gray-900 shadow-lg w-full max-w-[8.5in] mx-auto overflow-hidden" style={{ minHeight: '11in' }}>
        {/* Header with gradient */}
        <div className="relative">
          <div className={cn('absolute inset-0 bg-gradient-to-r h-28', c.headerGradient)} />
          <div className="relative pt-6 px-4 sm:px-6 pb-12">
            <div className="bg-white rounded-xl shadow-lg p-5 mt-16">
              <h1 className={cn('text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent', c.nameGradient)}>
                {personalInfo.fullName || 'Your Name'}
              </h1>
              <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                {personalInfo.email && <span>✉ {personalInfo.email}</span>}
                {personalInfo.phone && <span>☏ {personalInfo.phone}</span>}
                {personalInfo.location && <span>📍 {personalInfo.location}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 pb-6 grid grid-cols-1 sm:grid-cols-3 gap-5 -mt-4">
          {/* Left 2 columns */}
          <div className="col-span-1 sm:col-span-2 space-y-5">
            {personalInfo.summary && (
              <section className="bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-lg p-4">
                <h2 className={cn('font-bold text-sm uppercase mb-2', c.sectionText)}>About Me</h2>
                <p className="text-sm text-gray-700 leading-relaxed">{personalInfo.summary}</p>
              </section>
            )}

            {experience.length > 0 && (
              <section>
                <h2 className={cn('font-bold text-sm uppercase mb-3', c.sectionText)}>Experience</h2>
                {experience.map((exp) => (
                  <div key={exp.id} className={cn("mb-4 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:rounded", c.railGradient)}>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-sm">{exp.position}</h3>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full', c.pill)}>
                        {exp.startDate} - {exp.current ? 'Now' : exp.endDate}
                      </span>
                    </div>
                    <p className="text-sm text-fuchsia-600">{exp.company}</p>
                    <ul className="mt-1.5 space-y-1">
                      {exp.bullets.filter(b => b.trim()).map((bullet, idx) => (
                        <li key={idx} className="text-xs text-gray-600">→ {bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            )}

            {projects.length > 0 && (
              <section>
                <h2 className={cn('font-bold text-sm uppercase mb-3', c.sectionText)}>Projects</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projects.map((proj) => (
                    <div key={proj.id} className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-lg p-3">
                      <h3 className="font-bold text-sm">{proj.name}</h3>
                      <p className="text-xs text-fuchsia-600 mt-0.5">{proj.technologies.slice(0, 3).join(' • ')}</p>
                      {proj.bullets.filter(b => b.trim()).slice(0, 1).map((bullet, idx) => (
                        <p key={idx} className="text-xs text-gray-600 mt-1">{bullet}</p>
                      ))}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {skills.length > 0 && (
              <section className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-lg p-4">
                <h2 className="text-violet-700 font-bold text-xs uppercase mb-3">Skills</h2>
                {skills.map((skill) => (
                  <div key={skill.id} className="mb-3">
                    <p className="text-xs font-bold text-gray-700 mb-1">{skill.category}</p>
                    <div className="flex flex-wrap gap-1">
                      {skill.items.map((item, idx) => (
                        <span key={idx} className="bg-white text-gray-700 px-2 py-0.5 rounded-full text-xs shadow-sm">{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {education.length > 0 && (
              <section>
                <h2 className="text-violet-700 font-bold text-xs uppercase mb-2">Education</h2>
                {education.map((edu) => (
                  <div key={edu.id} className="mb-2 p-2 border-l-2 border-fuchsia-400 bg-white">
                    <p className="font-bold text-xs">{edu.degree}</p>
                    <p className="text-xs text-gray-600">{edu.institution}</p>
                    <p className="text-xs text-fuchsia-500">{edu.endDate}</p>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Minimal Template - Ultra clean with lots of whitespace
  if (template === 'minimal') {
    const minimalMuted =
      accent === 'gray-dark'
        ? 'text-gray-500'
        : accent === 'slate'
          ? 'text-slate-500'
          : 'text-gray-400';

    return (
      <div className="resume-preview bg-white text-gray-900 p-4 sm:p-10 shadow-lg w-full max-w-[8.5in] mx-auto" style={{ minHeight: '11in' }}>
        <header className="mb-8">
          <h1 className="text-3xl font-light tracking-tight">{personalInfo.fullName || 'Your Name'}</h1>
          <div className={cn('flex flex-wrap gap-x-6 gap-y-1 mt-2 text-sm', minimalMuted)}>
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
        </header>

        {personalInfo.summary && (
          <section className="mb-8">
            <p className="text-gray-600 leading-relaxed text-sm max-w-xl">{personalInfo.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="mb-8">
            <h2 className={cn('text-xs uppercase tracking-[0.2em] mb-5', minimalMuted)}>Experience</h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-6">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-medium text-sm">{exp.position}</h3>
                  <span className={cn('text-xs', minimalMuted)}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{exp.company}</p>
                {exp.bullets.filter(b => b.trim()).map((bullet, idx) => (
                  <p key={idx} className="text-xs text-gray-600 mb-1 pl-3 border-l border-gray-200">{bullet}</p>
                ))}
              </div>
            ))}
          </section>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {education.length > 0 && (
            <section>
              <h2 className={cn('text-xs uppercase tracking-[0.2em] mb-4', minimalMuted)}>Education</h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <p className="font-medium text-sm">{edu.degree}</p>
                  <p className="text-xs text-gray-500">{edu.institution} • {edu.endDate}</p>
                </div>
              ))}
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h2 className={cn('text-xs uppercase tracking-[0.2em] mb-4', minimalMuted)}>Skills</h2>
              {skills.map((skill) => (
                <p key={skill.id} className="text-xs text-gray-600 mb-2">{skill.items.join(' · ')}</p>
              ))}
            </section>
          )}
        </div>

        {projects.length > 0 && (
          <section className="mt-8">
            <h2 className={cn('text-xs uppercase tracking-[0.2em] mb-4', minimalMuted)}>Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <p className="font-medium text-sm">{proj.name}</p>
                  <p className="text-xs text-gray-500">{proj.technologies.join(' · ')}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // Elegant Template - Warm tones with decorative elements
  if (template === 'elegant') {
    const e =
      accent === 'orange'
        ? {
            headerGradient: 'from-orange-700 to-amber-600',
            title: 'text-orange-700',
            border: 'border-orange-300',
            dot: 'bg-orange-500',
            bullet: 'text-orange-500',
            sub: 'text-orange-600',
            softBg: 'bg-orange-50',
            strongBorder: 'border-orange-500',
            sideBg: 'bg-orange-50',
            sideBorder: 'border-orange-200',
          }
        : accent === 'amber-dark'
          ? {
              headerGradient: 'from-amber-800 to-orange-700',
              title: 'text-amber-800',
              border: 'border-amber-400',
              dot: 'bg-amber-600',
              bullet: 'text-amber-600',
              sub: 'text-amber-700',
              softBg: 'bg-amber-50',
              strongBorder: 'border-amber-600',
              sideBg: 'bg-orange-50',
              sideBorder: 'border-orange-200',
            }
          : {
              headerGradient: 'from-amber-700 to-orange-600',
              title: 'text-amber-700',
              border: 'border-amber-300',
              dot: 'bg-amber-500',
              bullet: 'text-amber-500',
              sub: 'text-amber-600',
              softBg: 'bg-amber-50',
              strongBorder: 'border-amber-500',
              sideBg: 'bg-orange-50',
              sideBorder: 'border-orange-200',
            };

    return (
      <div className="resume-preview bg-white text-gray-900 shadow-lg w-full max-w-[8.5in] mx-auto" style={{ minHeight: '11in' }}>
        <header className={cn('bg-gradient-to-r text-white p-4 sm:p-6 relative', e.headerGradient)}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <h1 className="text-2xl font-bold relative z-10">{personalInfo.fullName || 'Your Name'}</h1>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-amber-100 text-sm relative z-10">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.location && <span>• {personalInfo.location}</span>}
          </div>
        </header>

        <div className="p-4 sm:p-6">
          {personalInfo.summary && (
            <section className={cn('mb-5 p-4 rounded-lg border-l-4', e.softBg, e.strongBorder)}>
              <p className="text-sm text-gray-700 italic">{personalInfo.summary}</p>
            </section>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="col-span-1 sm:col-span-2 space-y-5">
              {experience.length > 0 && (
                <section>
                  <h2 className={cn('font-bold uppercase text-sm tracking-wide border-b-2 pb-1 mb-3 flex items-center gap-2', e.title, e.border)}>
                    <span className={cn('w-2 h-2 rounded-full', e.dot)} />
                    Experience
                  </h2>
                  {experience.map((exp) => (
                    <div key={exp.id} className="mb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-sm">{exp.position}</h3>
                          <p className={cn('text-sm', e.title)}>{exp.company}</p>
                        </div>
                        <span className="text-xs text-gray-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                      </div>
                      <ul className="mt-1.5 space-y-1">
                        {exp.bullets.filter(b => b.trim()).map((bullet, idx) => (
                          <li key={idx} className="text-xs text-gray-700 flex">
                            <span className={cn('mr-2', e.bullet)}>◆</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              )}

              {projects.length > 0 && (
                <section>
                  <h2 className={cn('font-bold uppercase text-sm tracking-wide border-b-2 pb-1 mb-3 flex items-center gap-2', e.title, e.border)}>
                    <span className={cn('w-2 h-2 rounded-full', e.dot)} />
                    Projects
                  </h2>
                  {projects.map((proj) => (
                    <div key={proj.id} className="mb-3">
                      <h3 className="font-bold text-sm">{proj.name}</h3>
                      <p className={cn('text-xs', e.sub)}>{proj.technologies.join(' • ')}</p>
                      <ul className="mt-1">
                        {proj.bullets.filter(b => b.trim()).map((bullet, idx) => (
                          <li key={idx} className="text-xs text-gray-700 flex">
                            <span className={cn('mr-2', e.bullet)}>◆</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              )}
            </div>

            <div className="space-y-5">
              {education.length > 0 && (
                <section className={cn('rounded-lg p-4', e.sideBg)}>
                  <h2 className={cn('font-bold uppercase text-xs tracking-wide mb-3', e.title)}>Education</h2>
                  {education.map((edu) => (
                    <div key={edu.id} className={cn('mb-3 pb-2 border-b last:border-0', e.sideBorder)}>
                      <p className="font-bold text-sm">{edu.degree}</p>
                      <p className="text-xs text-gray-600">{edu.field}</p>
                      <p className="text-xs text-gray-500">{edu.institution}</p>
                      <p className={cn('text-xs', e.sub)}>{edu.endDate}</p>
                    </div>
                  ))}
                </section>
              )}

              {skills.length > 0 && (
                <section>
                  <h2 className={cn('font-bold uppercase text-xs tracking-wide mb-3', e.title)}>Skills</h2>
                  {skills.map((skill) => (
                    <div key={skill.id} className="mb-3">
                      <p className={cn('font-medium text-xs', e.title)}>{skill.category}</p>
                      <p className="text-xs text-gray-600">{skill.items.join(', ')}</p>
                    </div>
                  ))}
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tech Template - Dark terminal-inspired
  if (template === 'tech') {
    const t =
      accent === 'cyan'
        ? {
            headerGradient: 'from-cyan-600 to-teal-500',
            primary: 'text-cyan-300',
            secondary: 'text-teal-300',
            border: 'border-cyan-500',
            arrow: 'text-cyan-400',
          }
        : accent === 'teal'
          ? {
              headerGradient: 'from-teal-600 to-cyan-500',
              primary: 'text-teal-300',
              secondary: 'text-cyan-300',
              border: 'border-teal-500',
              arrow: 'text-teal-400',
            }
          : {
              headerGradient: 'from-emerald-600 to-teal-500',
              primary: 'text-emerald-300',
              secondary: 'text-teal-300',
              border: 'border-emerald-500',
              arrow: 'text-emerald-500',
            };

    return (
      <div className="resume-preview bg-gray-900 text-gray-100 shadow-lg w-full max-w-[8.5in] mx-auto font-mono" style={{ minHeight: '11in' }}>
        <header className={cn('bg-gradient-to-r p-4 sm:p-5', t.headerGradient)}>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <h1 className="text-xl font-bold">{personalInfo.fullName || 'Your Name'}</h1>
          <p className="text-emerald-100 text-sm mt-1">
            <span className={t.primary}>$</span> {[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(' | ')}
          </p>
        </header>

        <div className="p-4 sm:p-5 space-y-5">
          {personalInfo.summary && (
            <section>
              <p className="text-sm text-gray-400">
                <span className={t.primary}>// </span>
                {personalInfo.summary}
              </p>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h2 className={cn('text-sm mb-3', t.primary)}>{'<'}<span className={t.secondary}>Skills</span>{' />'}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skills.map((skill) => (
                  <div key={skill.id} className="bg-gray-800 rounded p-3">
                    <p className={cn('text-xs mb-2', t.secondary)}>{skill.category}</p>
                    <div className="flex flex-wrap gap-1">
                      {skill.items.map((item, idx) => (
                        <span key={idx} className="bg-gray-700 text-emerald-300 px-2 py-0.5 rounded text-xs">{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {experience.length > 0 && (
            <section>
              <h2 className={cn('text-sm mb-3', t.primary)}>{'<'}<span className={t.secondary}>Experience</span>{' />'}</h2>
              {experience.map((exp) => (
                <div key={exp.id} className={cn('mb-4 border-l-2 pl-3', t.border)}>
                  <div className="flex justify-between">
                    <h3 className="text-teal-300 font-bold text-sm">{exp.position}</h3>
                    <span className="text-gray-500 text-xs">{exp.startDate} → {exp.current ? 'present' : exp.endDate}</span>
                  </div>
                  <p className="text-gray-400 text-xs">{exp.company}</p>
                  <ul className="mt-1.5 space-y-1">
                    {exp.bullets.filter(b => b.trim()).map((bullet, idx) => (
                      <li key={idx} className="text-xs text-gray-300">
                        <span className={t.arrow}>→</span> {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {education.length > 0 && (
              <section>
                <h2 className={cn('text-sm mb-2', t.primary)}>{'<'}<span className={t.secondary}>Education</span>{' />'}</h2>
                {education.map((edu) => (
                  <div key={edu.id} className="bg-gray-800 rounded p-3 mb-2">
                    <p className="text-sm font-bold text-gray-200">{edu.degree}</p>
                    <p className="text-xs text-gray-400">{edu.institution}</p>
                    <p className={cn('text-xs', t.secondary)}>{edu.endDate}</p>
                  </div>
                ))}
              </section>
            )}

            {projects.length > 0 && (
              <section>
                <h2 className={cn('text-sm mb-2', t.primary)}>{'<'}<span className={t.secondary}>Projects</span>{' />'}</h2>
                {projects.map((proj) => (
                  <div key={proj.id} className="bg-gray-800 rounded p-3 mb-2">
                    <p className="text-sm font-bold text-gray-200">{proj.name}</p>
                    <p className={cn('text-xs', t.primary)}>{proj.technologies.join(' • ')}</p>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Healthcare Template - Clean medical professional look
  if (template === 'healthcare') {
    const h =
      accent === 'green'
        ? {
            header: 'bg-green-700',
            headerText: 'text-green-100',
            title: 'text-green-700',
            border: 'border-green-300',
            borderStrong: 'border-green-500',
            softBg: 'bg-green-50',
            sub: 'text-green-600',
            bullet: 'text-green-500',
            divider: 'border-green-200',
          }
        : accent === 'blue'
          ? {
              header: 'bg-blue-700',
              headerText: 'text-blue-100',
              title: 'text-blue-700',
              border: 'border-blue-300',
              borderStrong: 'border-blue-500',
              softBg: 'bg-blue-50',
              sub: 'text-blue-600',
              bullet: 'text-blue-500',
              divider: 'border-blue-200',
            }
          : {
              header: 'bg-teal-700',
              headerText: 'text-teal-100',
              title: 'text-teal-700',
              border: 'border-teal-300',
              borderStrong: 'border-teal-500',
              softBg: 'bg-teal-50',
              sub: 'text-teal-600',
              bullet: 'text-teal-500',
              divider: 'border-teal-200',
            };

    return (
      <div className="resume-preview bg-white text-gray-900 shadow-lg w-full max-w-[8.5in] mx-auto" style={{ minHeight: '11in' }}>
        <header className={cn('text-white p-4 sm:p-6', h.header)}>
          <h1 className="text-2xl font-bold">{personalInfo.fullName || 'Your Name'}</h1>
          <div className={cn('flex flex-wrap gap-3 mt-2 text-sm', h.headerText)}>
            {personalInfo.email && <span>✉ {personalInfo.email}</span>}
            {personalInfo.phone && <span>☏ {personalInfo.phone}</span>}
            {personalInfo.location && <span>📍 {personalInfo.location}</span>}
          </div>
        </header>

        <div className="p-4 sm:p-6">
          {personalInfo.summary && (
            <section className={cn('mb-5 p-4 rounded border-l-4', h.softBg, h.borderStrong)}>
              <h2 className={cn('font-bold text-sm uppercase mb-1', h.title)}>Professional Summary</h2>
              <p className="text-sm text-gray-700">{personalInfo.summary}</p>
            </section>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="col-span-1 sm:col-span-2 space-y-5">
              {experience.length > 0 && (
                <section>
                  <h2 className={cn('font-bold uppercase text-sm border-b-2 pb-1 mb-3', h.title, h.border)}>Clinical Experience</h2>
                  {experience.map((exp) => (
                    <div key={exp.id} className="mb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-sm">{exp.position}</h3>
                          <p className={cn('text-sm', h.sub)}>{exp.company}</p>
                        </div>
                        <span className={cn('text-xs text-gray-500 px-2 py-0.5 rounded', h.softBg)}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                      </div>
                      <ul className="mt-1.5 space-y-1">
                        {exp.bullets.filter(b => b.trim()).map((bullet, idx) => (
                          <li key={idx} className="text-xs text-gray-700 flex">
                            <span className={cn('mr-2', h.bullet)}>+</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              )}

              {projects.length > 0 && (
                <section>
                  <h2 className={cn('font-bold uppercase text-sm border-b-2 pb-1 mb-3', h.title, h.border)}>Research & Projects</h2>
                  {projects.map((proj) => (
                    <div key={proj.id} className="mb-3">
                      <h3 className="font-bold text-sm">{proj.name}</h3>
                      {proj.description && <p className="text-xs text-gray-600">{proj.description}</p>}
                      <ul className="mt-1">
                        {proj.bullets.filter(b => b.trim()).map((bullet, idx) => (
                          <li key={idx} className="text-xs text-gray-700 flex">
                            <span className={cn('mr-2', h.bullet)}>+</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              )}
            </div>

            <div className="space-y-5">
              {education.length > 0 && (
                <section className={cn('rounded-lg p-4', h.softBg)}>
                  <h2 className={cn('font-bold uppercase text-xs mb-3', h.title)}>Education & Certifications</h2>
                  {education.map((edu) => (
                    <div key={edu.id} className={cn('mb-3 pb-2 border-b last:border-0', h.divider)}>
                      <p className="font-bold text-sm">{edu.degree}</p>
                      <p className="text-xs text-gray-600">{edu.field}</p>
                      <p className="text-xs text-gray-500">{edu.institution}</p>
                      <p className={cn('text-xs', h.sub)}>{edu.endDate}</p>
                    </div>
                  ))}
                </section>
              )}

              {skills.length > 0 && (
                <section className={cn('rounded-lg p-4', h.softBg)}>
                  <h2 className={cn('font-bold uppercase text-xs mb-3', h.title)}>Clinical Skills</h2>
                  {skills.map((skill) => (
                    <div key={skill.id} className="mb-2">
                      <p className={cn('font-medium text-xs', h.title)}>{skill.category}</p>
                      <p className="text-xs text-gray-600">{skill.items.join(' • ')}</p>
                    </div>
                  ))}
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Student Template - Education-first with projects highlighted
  if (template === 'student') {
    const s =
      accent === 'pink'
        ? {
            headerGradient: 'from-pink-600 via-rose-600 to-fuchsia-500',
            headerText: 'text-pink-100',
            eduBg: 'bg-pink-50',
            eduTitle: 'text-pink-700',
            eduPill: 'bg-pink-100 text-pink-700',
            projectsTitle: 'text-fuchsia-700',
            projectsBorder: 'border-fuchsia-300',
            chip: 'bg-fuchsia-200 text-fuchsia-700',
            expTitle: 'text-rose-700',
            expBorder: 'border-rose-300',
            company: 'text-rose-600',
            skillsTitle: 'text-pink-700',
            skillsBorder: 'border-pink-300',
          }
        : accent === 'violet'
          ? {
              headerGradient: 'from-violet-600 via-purple-600 to-fuchsia-500',
              headerText: 'text-violet-100',
              eduBg: 'bg-violet-50',
              eduTitle: 'text-violet-700',
              eduPill: 'bg-violet-100 text-violet-700',
              projectsTitle: 'text-purple-700',
              projectsBorder: 'border-purple-300',
              chip: 'bg-purple-200 text-purple-700',
              expTitle: 'text-fuchsia-700',
              expBorder: 'border-fuchsia-300',
              company: 'text-fuchsia-600',
              skillsTitle: 'text-violet-700',
              skillsBorder: 'border-violet-300',
            }
          : {
              headerGradient: 'from-indigo-600 via-purple-600 to-pink-500',
              headerText: 'text-indigo-100',
              eduBg: 'bg-indigo-50',
              eduTitle: 'text-indigo-700',
              eduPill: 'bg-indigo-100 text-indigo-700',
              projectsTitle: 'text-purple-700',
              projectsBorder: 'border-purple-300',
              chip: 'bg-purple-200 text-purple-700',
              expTitle: 'text-pink-700',
              expBorder: 'border-pink-300',
              company: 'text-pink-600',
              skillsTitle: 'text-indigo-700',
              skillsBorder: 'border-indigo-300',
            };

    return (
      <div className="resume-preview bg-white text-gray-900 shadow-lg w-full max-w-[8.5in] mx-auto" style={{ minHeight: '11in' }}>
        <header className={cn('bg-gradient-to-r text-white p-4 sm:p-6', s.headerGradient)}>
          <h1 className="text-2xl font-bold">{personalInfo.fullName || 'Your Name'}</h1>
          <div className={cn('flex flex-wrap gap-3 mt-2 text-sm', s.headerText)}>
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          </div>
        </header>

        <div className="p-4 sm:p-6">
          {personalInfo.summary && (
            <section className="mb-5 text-center max-w-2xl mx-auto">
              <p className="text-sm text-gray-600 italic">{personalInfo.summary}</p>
            </section>
          )}

          {/* Education First */}
          {education.length > 0 && (
            <section className={cn('mb-5 rounded-lg p-4', s.eduBg)}>
              <h2 className={cn('font-bold uppercase text-sm mb-3 flex items-center gap-2', s.eduTitle)}>
                <span className="text-lg">🎓</span>
                Education
              </h2>
              {education.map((edu) => (
                <div key={edu.id} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-2">
                  <div>
                    <span className="font-bold text-sm">{edu.degree} in {edu.field}</span>
                    <span className={cn('text-sm', s.eduTitle)}> — {edu.institution}</span>
                    {edu.gpa && <span className={cn('ml-2 px-2 py-0.5 rounded text-xs', s.eduPill)}>GPA: {edu.gpa}</span>}
                  </div>
                  <span className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</span>
                </div>
              ))}
            </section>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Projects */}
            {projects.length > 0 && (
              <section>
                <h2 className={cn('font-bold uppercase text-sm border-b-2 pb-1 mb-3', s.projectsTitle, s.projectsBorder)}>Projects</h2>
                {projects.map((proj) => (
                  <div key={proj.id} className="mb-3 p-3 bg-purple-50 rounded-lg">
                    <h3 className="font-bold text-sm">{proj.name}</h3>
                    <div className="flex flex-wrap gap-1 my-1">
                      {proj.technologies.map((tech, idx) => (
                        <span key={idx} className={cn('px-2 py-0.5 rounded-full text-xs', s.chip)}>{tech}</span>
                      ))}
                    </div>
                    <ul>
                      {proj.bullets.filter(b => b.trim()).slice(0, 2).map((bullet, idx) => (
                        <li key={idx} className="text-xs text-gray-600">• {bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            )}

            <div className="space-y-5">
              {experience.length > 0 && (
                <section>
                  <h2 className={cn('font-bold uppercase text-sm border-b-2 pb-1 mb-3', s.expTitle, s.expBorder)}>Experience</h2>
                  {experience.map((exp) => (
                    <div key={exp.id} className="mb-3">
                      <h3 className="font-bold text-sm">{exp.position}</h3>
                      <p className={cn('text-xs', s.company)}>{exp.company} • {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                      <ul className="mt-1">
                        {exp.bullets.filter(b => b.trim()).slice(0, 2).map((bullet, idx) => (
                          <li key={idx} className="text-xs text-gray-600">• {bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              )}

              {skills.length > 0 && (
                <section>
                  <h2 className={cn('font-bold uppercase text-sm border-b-2 pb-1 mb-3', s.skillsTitle, s.skillsBorder)}>Skills</h2>
                  {skills.map((skill) => (
                    <div key={skill.id} className="mb-2">
                      <p className="text-xs font-bold text-gray-700">{skill.category}</p>
                      <p className="text-xs text-gray-600">{skill.items.join(' • ')}</p>
                    </div>
                  ))}
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Entry Level Template - Skills-first, clean and approachable
  if (template === 'entry') {
    const en =
      accent === 'lime'
        ? {
            header: 'bg-lime-600',
            headerText: 'text-lime-100',
            title: 'text-lime-700',
            border: 'border-lime-300',
            borderStrong: 'border-lime-500',
            softBg: 'bg-lime-50',
            chip: 'bg-lime-200 text-lime-800',
            sub: 'text-lime-600',
          }
        : accent === 'emerald'
          ? {
              header: 'bg-emerald-700',
              headerText: 'text-emerald-100',
              title: 'text-emerald-700',
              border: 'border-emerald-300',
              borderStrong: 'border-emerald-500',
              softBg: 'bg-emerald-50',
              chip: 'bg-emerald-200 text-emerald-800',
              sub: 'text-emerald-600',
            }
          : {
              header: 'bg-green-600',
              headerText: 'text-green-100',
              title: 'text-green-700',
              border: 'border-green-300',
              borderStrong: 'border-green-500',
              softBg: 'bg-green-50',
              chip: 'bg-green-200 text-green-800',
              sub: 'text-green-600',
            };

    return (
      <div className="resume-preview bg-white text-gray-900 shadow-lg w-full max-w-[8.5in] mx-auto" style={{ minHeight: '11in' }}>
        <header className={cn('text-white p-4 sm:p-6', en.header)}>
          <h1 className="text-2xl font-bold">{personalInfo.fullName || 'Your Name'}</h1>
          <div className={cn('flex flex-wrap gap-3 mt-2 text-sm', en.headerText)}>
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>| {personalInfo.phone}</span>}
            {personalInfo.location && <span>| {personalInfo.location}</span>}
          </div>
        </header>

        <div className="p-4 sm:p-6">
          {personalInfo.summary && (
            <section className={cn('mb-5 border-l-4 pl-4 py-3', en.borderStrong, en.softBg)}>
              <h2 className={cn('font-bold text-sm uppercase mb-1', en.title)}>Career Objective</h2>
              <p className="text-sm text-gray-700">{personalInfo.summary}</p>
            </section>
          )}

          {/* Skills First */}
          {skills.length > 0 && (
            <section className="mb-5">
              <h2 className={cn('font-bold uppercase text-sm border-b-2 pb-1 mb-3', en.title, en.border)}>Key Skills & Competencies</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skills.map((skill) => (
                  <div key={skill.id} className={cn('rounded p-3', en.softBg)}>
                    <p className={cn('font-bold text-xs mb-2', en.title)}>{skill.category}</p>
                    <div className="flex flex-wrap gap-1">
                      {skill.items.map((item, idx) => (
                        <span key={idx} className={cn('px-2 py-0.5 rounded text-xs', en.chip)}>{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              {education.length > 0 && (
                <section className="mb-5">
                  <h2 className={cn('font-bold uppercase text-sm border-b-2 pb-1 mb-3', en.title, en.border)}>Education</h2>
                  {education.map((edu) => (
                    <div key={edu.id} className={cn('mb-3 p-3 border rounded', en.border)}>
                      <p className="font-bold text-sm">{edu.degree} in {edu.field}</p>
                      <p className={cn('text-sm', en.sub)}>{edu.institution}</p>
                      <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                      {edu.gpa && <p className={cn('text-xs mt-1', en.title)}>GPA: {edu.gpa}</p>}
                    </div>
                  ))}
                </section>
              )}

              {projects.length > 0 && (
                <section>
                  <h2 className={cn('font-bold uppercase text-sm border-b-2 pb-1 mb-3', en.title, en.border)}>Projects</h2>
                  {projects.map((proj) => (
                    <div key={proj.id} className="mb-3">
                      <h3 className="font-bold text-sm">{proj.name}</h3>
                      <p className={cn('text-xs', en.sub)}>{proj.technologies.join(' • ')}</p>
                      {proj.description && <p className="text-xs text-gray-600 mt-1">{proj.description}</p>}
                    </div>
                  ))}
                </section>
              )}
            </div>

            <div>
              {experience.length > 0 && (
                <section>
                  <h2 className={cn('font-bold uppercase text-sm border-b-2 pb-1 mb-3', en.title, en.border)}>Work Experience</h2>
                  {experience.map((exp) => (
                    <div key={exp.id} className="mb-4">
                      <h3 className="font-bold text-sm">{exp.position}</h3>
                      <p className={cn('text-sm', en.sub)}>{exp.company}</p>
                      <p className="text-xs text-gray-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                      <ul className="mt-1 space-y-1">
                        {exp.bullets.filter(b => b.trim()).map((bullet, idx) => (
                          <li key={idx} className="text-xs text-gray-700">✓ {bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback to Modern
  return (
    <div className="resume-preview bg-white text-gray-900 p-4 sm:p-8 shadow-lg w-full max-w-[8.5in] mx-auto" style={{ minHeight: '11in' }}>
      <p className="text-center text-gray-500">Select a template to preview your resume</p>
    </div>
  );
};
