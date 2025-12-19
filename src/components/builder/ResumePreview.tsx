import { useResume } from '@/context/ResumeContext';
import { cn } from '@/lib/utils';

interface ResumePreviewProps {
  template?: 'modern' | 'classic' | 'professional' | 'creative' | 'minimal' | 'elegant' | 'tech' | 'healthcare' | 'student' | 'entry';
}

export const ResumePreview = ({ template = 'modern' }: ResumePreviewProps) => {
  const { resume } = useResume();
  const { personalInfo, education, experience, projects, skills } = resume;

  // Modern Template - Two-column with left sidebar
  if (template === 'modern') {
    return (
      <div className="resume-preview bg-white text-black shadow-lg max-w-[8.5in] mx-auto flex" style={{ minHeight: '11in' }}>
        {/* Left Sidebar */}
        <div className="w-1/3 bg-blue-600 text-white p-6">
          <h1 className="text-xl font-bold mb-1">{personalInfo.fullName || 'Your Name'}</h1>
          
          <div className="space-y-4 mt-6 text-sm">
            <div>
              <h3 className="font-semibold text-blue-200 uppercase text-xs tracking-wide mb-2">Contact</h3>
              <div className="space-y-1 text-blue-100">
                {personalInfo.email && <p>{personalInfo.email}</p>}
                {personalInfo.phone && <p>{personalInfo.phone}</p>}
                {personalInfo.location && <p>{personalInfo.location}</p>}
                {personalInfo.linkedin && <p>{personalInfo.linkedin}</p>}
              </div>
            </div>

            {skills.length > 0 && (
              <div>
                <h3 className="font-semibold text-blue-200 uppercase text-xs tracking-wide mb-2">Skills</h3>
                {skills.map((skill) => (
                  <div key={skill.id} className="mb-3">
                    <p className="font-medium text-blue-100">{skill.category}</p>
                    <p className="text-blue-200 text-xs">{skill.items.join(' • ')}</p>
                  </div>
                ))}
              </div>
            )}

            {education.length > 0 && (
              <div>
                <h3 className="font-semibold text-blue-200 uppercase text-xs tracking-wide mb-2">Education</h3>
                {education.map((edu) => (
                  <div key={edu.id} className="mb-2">
                    <p className="font-medium text-sm">{edu.degree}</p>
                    <p className="text-blue-200 text-xs">{edu.institution}</p>
                    <p className="text-blue-300 text-xs">{edu.startDate} - {edu.endDate}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="w-2/3 p-6">
          {personalInfo.summary && (
            <section className="mb-5">
              <h2 className="text-blue-600 font-bold text-sm uppercase tracking-wide border-b-2 border-blue-600 pb-1 mb-2">Profile</h2>
              <p className="text-sm text-gray-700 leading-relaxed">{personalInfo.summary}</p>
            </section>
          )}

          {experience.length > 0 && (
            <section className="mb-5">
              <h2 className="text-blue-600 font-bold text-sm uppercase tracking-wide border-b-2 border-blue-600 pb-1 mb-2">Experience</h2>
              {experience.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-sm">{exp.position}</h3>
                    <span className="text-xs text-gray-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <p className="text-sm text-gray-600 italic">{exp.company} • {exp.location}</p>
                  <ul className="mt-1 space-y-1">
                    {exp.bullets.filter(b => b.trim()).map((bullet, idx) => (
                      <li key={idx} className="text-xs text-gray-700 flex">
                        <span className="text-blue-600 mr-2">▸</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <h2 className="text-blue-600 font-bold text-sm uppercase tracking-wide border-b-2 border-blue-600 pb-1 mb-2">Projects</h2>
              {projects.map((proj) => (
                <div key={proj.id} className="mb-3">
                  <h3 className="font-bold text-sm">{proj.name}</h3>
                  {proj.technologies.length > 0 && (
                    <p className="text-xs text-blue-600">{proj.technologies.join(' | ')}</p>
                  )}
                  <ul className="mt-1">
                    {proj.bullets.filter(b => b.trim()).map((bullet, idx) => (
                      <li key={idx} className="text-xs text-gray-700 flex">
                        <span className="text-blue-600 mr-2">▸</span>
                        {bullet}
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

  // Classic Template - Traditional centered layout
  if (template === 'classic') {
    return (
      <div className="resume-preview bg-white text-black p-8 shadow-lg max-w-[8.5in] mx-auto" style={{ minHeight: '11in' }}>
        <header className="text-center border-b-2 border-gray-800 pb-4 mb-6">
          <h1 className="text-3xl font-serif font-bold tracking-wide">{personalInfo.fullName || 'Your Name'}</h1>
          <div className="flex justify-center gap-4 text-sm mt-2 text-gray-600">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>|</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>|</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
        </header>

        {personalInfo.summary && (
          <section className="mb-5">
            <h2 className="font-serif font-bold text-lg border-b border-gray-400 pb-1 mb-2">OBJECTIVE</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="mb-5">
            <h2 className="font-serif font-bold text-lg border-b border-gray-400 pb-1 mb-2">PROFESSIONAL EXPERIENCE</h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold">{exp.position}</span>
                    <span className="text-gray-600"> — {exp.company}</span>
                  </div>
                  <span className="text-sm text-gray-500">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p className="text-sm text-gray-500 italic">{exp.location}</p>
                <ul className="list-disc list-inside mt-1">
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
            <h2 className="font-serif font-bold text-lg border-b border-gray-400 pb-1 mb-2">EDUCATION</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2 flex justify-between">
                <div>
                  <span className="font-bold">{edu.degree} in {edu.field}</span>
                  <span className="text-gray-600"> — {edu.institution}</span>
                  {edu.gpa && <span className="text-sm text-gray-500 ml-2">GPA: {edu.gpa}</span>}
                </div>
                <span className="text-sm text-gray-500">{edu.endDate}</span>
              </div>
            ))}
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h2 className="font-serif font-bold text-lg border-b border-gray-400 pb-1 mb-2">SKILLS</h2>
            <div className="text-sm">
              {skills.map((skill) => (
                <p key={skill.id} className="mb-1">
                  <span className="font-bold">{skill.category}:</span> {skill.items.join(', ')}
                </p>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // Professional Template - Right sidebar with photo placeholder
  if (template === 'professional') {
    return (
      <div className="resume-preview bg-white text-black shadow-lg max-w-[8.5in] mx-auto" style={{ minHeight: '11in' }}>
        <header className="bg-slate-800 text-white p-6">
          <h1 className="text-2xl font-bold">{personalInfo.fullName || 'Your Name'}</h1>
          <div className="flex gap-4 text-sm mt-2 text-slate-300">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.location && <span>• {personalInfo.location}</span>}
          </div>
        </header>

        <div className="flex">
          {/* Main Content */}
          <div className="w-2/3 p-6">
            {personalInfo.summary && (
              <section className="mb-5">
                <h2 className="font-bold text-slate-800 uppercase text-sm tracking-wide border-b-2 border-slate-300 pb-1 mb-2">Summary</h2>
                <p className="text-sm text-gray-700">{personalInfo.summary}</p>
              </section>
            )}

            {experience.length > 0 && (
              <section className="mb-5">
                <h2 className="font-bold text-slate-800 uppercase text-sm tracking-wide border-b-2 border-slate-300 pb-1 mb-2">Experience</h2>
                {experience.map((exp) => (
                  <div key={exp.id} className="mb-4 border-l-2 border-slate-200 pl-3">
                    <h3 className="font-bold text-sm">{exp.position}</h3>
                    <p className="text-sm text-slate-600">{exp.company} | {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                    <ul className="mt-1 space-y-1">
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
                <h2 className="font-bold text-slate-800 uppercase text-sm tracking-wide border-b-2 border-slate-300 pb-1 mb-2">Projects</h2>
                {projects.map((proj) => (
                  <div key={proj.id} className="mb-3 border-l-2 border-slate-200 pl-3">
                    <h3 className="font-bold text-sm">{proj.name}</h3>
                    <p className="text-xs text-gray-500">{proj.technologies.join(' • ')}</p>
                  </div>
                ))}
              </section>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-1/3 bg-slate-50 p-6">
            {education.length > 0 && (
              <section className="mb-5">
                <h2 className="font-bold text-slate-800 uppercase text-xs tracking-wide mb-2">Education</h2>
                {education.map((edu) => (
                  <div key={edu.id} className="mb-3">
                    <p className="font-bold text-sm">{edu.degree}</p>
                    <p className="text-xs text-gray-600">{edu.field}</p>
                    <p className="text-xs text-gray-500">{edu.institution}</p>
                    <p className="text-xs text-gray-400">{edu.endDate}</p>
                  </div>
                ))}
              </section>
            )}

            {skills.length > 0 && (
              <section>
                <h2 className="font-bold text-slate-800 uppercase text-xs tracking-wide mb-2">Skills</h2>
                {skills.map((skill) => (
                  <div key={skill.id} className="mb-3">
                    <p className="font-medium text-xs text-slate-700">{skill.category}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {skill.items.map((item, idx) => (
                        <span key={idx} className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-xs">{item}</span>
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

  // Creative Template - Asymmetric with color blocks
  if (template === 'creative') {
    return (
      <div className="resume-preview bg-white text-black shadow-lg max-w-[8.5in] mx-auto overflow-hidden" style={{ minHeight: '11in' }}>
        <div className="relative">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400" />
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-b from-purple-600/10 to-transparent" />
          
          <div className="relative pt-8 px-8">
            <div className="bg-white rounded-xl shadow-lg p-6 -mb-4 relative z-10">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                {personalInfo.fullName || 'Your Name'}
              </h1>
              <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                {personalInfo.email && <span className="flex items-center gap-1">✉ {personalInfo.email}</span>}
                {personalInfo.phone && <span className="flex items-center gap-1">☎ {personalInfo.phone}</span>}
                {personalInfo.location && <span className="flex items-center gap-1">📍 {personalInfo.location}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 pt-10 grid grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="col-span-2 space-y-5">
            {personalInfo.summary && (
              <section className="bg-purple-50 rounded-lg p-4">
                <h2 className="text-purple-600 font-bold text-sm uppercase mb-2">About Me</h2>
                <p className="text-sm text-gray-700">{personalInfo.summary}</p>
              </section>
            )}

            {experience.length > 0 && (
              <section>
                <h2 className="text-purple-600 font-bold text-sm uppercase mb-3">Experience</h2>
                {experience.map((exp, index) => (
                  <div key={exp.id} className="mb-4 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-purple-500 before:to-pink-500 before:rounded">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-sm">{exp.position}</h3>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                        {exp.startDate} - {exp.current ? 'Now' : exp.endDate}
                      </span>
                    </div>
                    <p className="text-sm text-pink-600">{exp.company}</p>
                    <ul className="mt-2 space-y-1">
                      {exp.bullets.filter(b => b.trim()).map((bullet, idx) => (
                        <li key={idx} className="text-xs text-gray-600">→ {bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            {skills.length > 0 && (
              <section className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
                <h2 className="text-purple-600 font-bold text-xs uppercase mb-3">Skills</h2>
                {skills.map((skill) => (
                  <div key={skill.id} className="mb-3">
                    <p className="text-xs font-bold text-gray-700 mb-1">{skill.category}</p>
                    {skill.items.map((item, idx) => (
                      <span key={idx} className="inline-block bg-white text-gray-700 px-2 py-1 rounded-full text-xs mr-1 mb-1 shadow-sm">{item}</span>
                    ))}
                  </div>
                ))}
              </section>
            )}

            {education.length > 0 && (
              <section>
                <h2 className="text-purple-600 font-bold text-xs uppercase mb-2">Education</h2>
                {education.map((edu) => (
                  <div key={edu.id} className="mb-2 p-2 border-l-2 border-pink-400">
                    <p className="font-bold text-xs">{edu.degree}</p>
                    <p className="text-xs text-gray-600">{edu.institution}</p>
                    <p className="text-xs text-gray-400">{edu.endDate}</p>
                  </div>
                ))}
              </section>
            )}

            {projects.length > 0 && (
              <section>
                <h2 className="text-purple-600 font-bold text-xs uppercase mb-2">Projects</h2>
                {projects.map((proj) => (
                  <div key={proj.id} className="mb-2 p-2 bg-orange-50 rounded">
                    <p className="font-bold text-xs">{proj.name}</p>
                    <p className="text-xs text-orange-600">{proj.technologies.slice(0, 3).join(' • ')}</p>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Minimal Template - Clean whitespace focus
  if (template === 'minimal') {
    return (
      <div className="resume-preview bg-white text-black p-12 shadow-lg max-w-[8.5in] mx-auto" style={{ minHeight: '11in' }}>
        <header className="mb-10">
          <h1 className="text-4xl font-light tracking-tight">{personalInfo.fullName || 'Your Name'}</h1>
          <div className="flex gap-6 mt-3 text-sm text-gray-400">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
        </header>

        {personalInfo.summary && (
          <section className="mb-10">
            <p className="text-gray-600 leading-relaxed max-w-2xl">{personalInfo.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-6">Experience</h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-8">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-medium">{exp.position}</h3>
                  <span className="text-sm text-gray-400">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p className="text-sm text-gray-500 mb-2">{exp.company}</p>
                {exp.bullets.filter(b => b.trim()).map((bullet, idx) => (
                  <p key={idx} className="text-sm text-gray-600 mb-1 pl-4 border-l border-gray-200">{bullet}</p>
                ))}
              </div>
            ))}
          </section>
        )}

        <div className="grid grid-cols-2 gap-10">
          {education.length > 0 && (
            <section>
              <h2 className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">Education</h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <p className="font-medium text-sm">{edu.degree}</p>
                  <p className="text-sm text-gray-500">{edu.institution} • {edu.endDate}</p>
                </div>
              ))}
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h2 className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">Skills</h2>
              {skills.map((skill) => (
                <p key={skill.id} className="text-sm text-gray-600 mb-2">{skill.items.join(' · ')}</p>
              ))}
            </section>
          )}
        </div>
      </div>
    );
  }

  // Elegant Template - Decorative with warm tones
  if (template === 'elegant') {
    return (
      <div className="resume-preview bg-white text-black shadow-lg max-w-[8.5in] mx-auto" style={{ minHeight: '11in' }}>
        <header className="bg-gradient-to-r from-amber-700 to-orange-600 text-white p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <h1 className="text-3xl font-bold relative z-10">{personalInfo.fullName || 'Your Name'}</h1>
          <div className="flex gap-4 mt-3 text-amber-100 text-sm relative z-10">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>•</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>•</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
        </header>

        <div className="p-8">
          {personalInfo.summary && (
            <section className="mb-6 bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
              <p className="text-sm text-gray-700 italic">{personalInfo.summary}</p>
            </section>
          )}

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              {experience.length > 0 && (
                <section>
                  <h2 className="text-amber-700 font-bold uppercase tracking-wide text-sm border-b-2 border-amber-300 pb-1 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full" />
                    Work Experience
                  </h2>
                  {experience.map((exp) => (
                    <div key={exp.id} className="mb-5">
                      <h3 className="font-bold">{exp.position}</h3>
                      <p className="text-sm text-amber-700">{exp.company} | {exp.location}</p>
                      <p className="text-xs text-gray-500 mb-2">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                      <ul className="space-y-1">
                        {exp.bullets.filter(b => b.trim()).map((bullet, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex">
                            <span className="text-amber-500 mr-2">◆</span>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              )}

              {projects.length > 0 && (
                <section>
                  <h2 className="text-amber-700 font-bold uppercase tracking-wide text-sm border-b-2 border-amber-300 pb-1 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full" />
                    Projects
                  </h2>
                  {projects.map((proj) => (
                    <div key={proj.id} className="mb-3">
                      <h3 className="font-bold text-sm">{proj.name}</h3>
                      <p className="text-xs text-amber-600">{proj.technologies.join(' • ')}</p>
                    </div>
                  ))}
                </section>
              )}
            </div>

            <div className="space-y-6">
              {education.length > 0 && (
                <section className="bg-orange-50 p-4 rounded-lg">
                  <h2 className="text-amber-700 font-bold uppercase tracking-wide text-xs mb-3">Education</h2>
                  {education.map((edu) => (
                    <div key={edu.id} className="mb-3">
                      <p className="font-bold text-sm">{edu.degree}</p>
                      <p className="text-xs text-gray-600">{edu.institution}</p>
                      <p className="text-xs text-amber-600">{edu.endDate}</p>
                    </div>
                  ))}
                </section>
              )}

              {skills.length > 0 && (
                <section>
                  <h2 className="text-amber-700 font-bold uppercase tracking-wide text-xs mb-3">Expertise</h2>
                  {skills.map((skill) => (
                    <div key={skill.id} className="mb-3">
                      <p className="font-medium text-xs text-amber-800">{skill.category}</p>
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

  // Tech Template - Terminal/code inspired
  if (template === 'tech') {
    return (
      <div className="resume-preview bg-gray-900 text-gray-100 shadow-lg max-w-[8.5in] mx-auto font-mono" style={{ minHeight: '11in' }}>
        <header className="bg-gradient-to-r from-cyan-600 to-teal-500 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <h1 className="text-2xl font-bold">{personalInfo.fullName || 'Your Name'}</h1>
          <p className="text-cyan-100 text-sm mt-1">
            <span className="text-cyan-300">$</span> {personalInfo.email} | {personalInfo.phone} | {personalInfo.location}
          </p>
        </header>

        <div className="p-6 space-y-6">
          {personalInfo.summary && (
            <section>
              <p className="text-sm text-gray-400">
                <span className="text-cyan-400">// </span>
                {personalInfo.summary}
              </p>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h2 className="text-cyan-400 text-sm mb-3">{'<'}<span className="text-teal-400">Skills</span>{' />'}</h2>
              <div className="grid grid-cols-2 gap-4">
                {skills.map((skill) => (
                  <div key={skill.id} className="bg-gray-800 rounded p-3">
                    <p className="text-teal-400 text-xs mb-2">{skill.category}</p>
                    <div className="flex flex-wrap gap-1">
                      {skill.items.map((item, idx) => (
                        <span key={idx} className="bg-gray-700 text-cyan-300 px-2 py-0.5 rounded text-xs">{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {experience.length > 0 && (
            <section>
              <h2 className="text-cyan-400 text-sm mb-3">{'<'}<span className="text-teal-400">Experience</span>{' />'}</h2>
              {experience.map((exp) => (
                <div key={exp.id} className="mb-4 border-l-2 border-cyan-500 pl-4">
                  <div className="flex justify-between">
                    <h3 className="text-teal-300 font-bold text-sm">{exp.position}</h3>
                    <span className="text-gray-500 text-xs">{exp.startDate} → {exp.current ? 'present' : exp.endDate}</span>
                  </div>
                  <p className="text-gray-400 text-xs">{exp.company} @ {exp.location}</p>
                  <ul className="mt-2 space-y-1">
                    {exp.bullets.filter(b => b.trim()).map((bullet, idx) => (
                      <li key={idx} className="text-xs text-gray-300">
                        <span className="text-cyan-500">→</span> {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          <div className="grid grid-cols-2 gap-6">
            {education.length > 0 && (
              <section>
                <h2 className="text-cyan-400 text-sm mb-2">{'<'}<span className="text-teal-400">Education</span>{' />'}</h2>
                {education.map((edu) => (
                  <div key={edu.id} className="bg-gray-800 rounded p-3 mb-2">
                    <p className="text-sm font-bold text-gray-200">{edu.degree}</p>
                    <p className="text-xs text-gray-400">{edu.institution}</p>
                    <p className="text-xs text-teal-500">{edu.endDate}</p>
                  </div>
                ))}
              </section>
            )}

            {projects.length > 0 && (
              <section>
                <h2 className="text-cyan-400 text-sm mb-2">{'<'}<span className="text-teal-400">Projects</span>{' />'}</h2>
                {projects.map((proj) => (
                  <div key={proj.id} className="bg-gray-800 rounded p-3 mb-2">
                    <p className="text-sm font-bold text-gray-200">{proj.name}</p>
                    <p className="text-xs text-cyan-400">{proj.technologies.join(' • ')}</p>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Healthcare Template - Clean medical professional
  if (template === 'healthcare') {
    return (
      <div className="resume-preview bg-white text-black shadow-lg max-w-[8.5in] mx-auto" style={{ minHeight: '11in' }}>
        <header className="bg-teal-600 text-white p-6">
          <h1 className="text-2xl font-bold">{personalInfo.fullName || 'Your Name'}</h1>
          <div className="flex gap-4 mt-2 text-teal-100 text-sm">
            {personalInfo.email && <span>✉ {personalInfo.email}</span>}
            {personalInfo.phone && <span>☏ {personalInfo.phone}</span>}
            {personalInfo.location && <span>⌘ {personalInfo.location}</span>}
          </div>
        </header>

        <div className="p-6">
          {personalInfo.summary && (
            <section className="mb-6 bg-teal-50 p-4 rounded border-l-4 border-teal-500">
              <h2 className="text-teal-700 font-bold text-sm uppercase mb-1">Professional Summary</h2>
              <p className="text-sm text-gray-700">{personalInfo.summary}</p>
            </section>
          )}

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-5">
              {experience.length > 0 && (
                <section>
                  <h2 className="text-teal-700 font-bold uppercase text-sm border-b-2 border-teal-300 pb-1 mb-3">Clinical Experience</h2>
                  {experience.map((exp) => (
                    <div key={exp.id} className="mb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-sm">{exp.position}</h3>
                          <p className="text-sm text-teal-600">{exp.company}</p>
                        </div>
                        <span className="text-xs text-gray-500 bg-teal-50 px-2 py-1 rounded">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                      </div>
                      <ul className="mt-2 space-y-1">
                        {exp.bullets.filter(b => b.trim()).map((bullet, idx) => (
                          <li key={idx} className="text-xs text-gray-700 flex">
                            <span className="text-teal-500 mr-2">+</span>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              )}

              {projects.length > 0 && (
                <section>
                  <h2 className="text-teal-700 font-bold uppercase text-sm border-b-2 border-teal-300 pb-1 mb-3">Research & Projects</h2>
                  {projects.map((proj) => (
                    <div key={proj.id} className="mb-2">
                      <h3 className="font-bold text-sm">{proj.name}</h3>
                      <p className="text-xs text-gray-600">{proj.description}</p>
                    </div>
                  ))}
                </section>
              )}
            </div>

            <div className="space-y-5">
              {education.length > 0 && (
                <section className="bg-teal-50 rounded-lg p-4">
                  <h2 className="text-teal-700 font-bold uppercase text-xs mb-3">Education & Certifications</h2>
                  {education.map((edu) => (
                    <div key={edu.id} className="mb-3 pb-2 border-b border-teal-200 last:border-0">
                      <p className="font-bold text-sm">{edu.degree}</p>
                      <p className="text-xs text-gray-600">{edu.institution}</p>
                      <p className="text-xs text-teal-600">{edu.endDate}</p>
                    </div>
                  ))}
                </section>
              )}

              {skills.length > 0 && (
                <section className="bg-green-50 rounded-lg p-4">
                  <h2 className="text-teal-700 font-bold uppercase text-xs mb-3">Clinical Skills</h2>
                  {skills.map((skill) => (
                    <div key={skill.id} className="mb-2">
                      <p className="font-medium text-xs text-teal-800">{skill.category}</p>
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

  // Student Template - Education first, projects prominent
  if (template === 'student') {
    return (
      <div className="resume-preview bg-white text-black shadow-lg max-w-[8.5in] mx-auto" style={{ minHeight: '11in' }}>
        <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white p-6">
          <h1 className="text-2xl font-bold">{personalInfo.fullName || 'Your Name'}</h1>
          <div className="flex flex-wrap gap-3 mt-2 text-indigo-100 text-sm">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>•</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.linkedin && <span>•</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          </div>
        </header>

        <div className="p-6">
          {personalInfo.summary && (
            <section className="mb-5 text-center max-w-2xl mx-auto">
              <p className="text-sm text-gray-600 italic">{personalInfo.summary}</p>
            </section>
          )}

          {/* Education First for Students */}
          {education.length > 0 && (
            <section className="mb-5 bg-indigo-50 rounded-lg p-4">
              <h2 className="text-indigo-700 font-bold uppercase text-sm mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs">🎓</span>
                Education
              </h2>
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-bold">{edu.degree} in {edu.field}</span>
                    <span className="text-indigo-600"> — {edu.institution}</span>
                    {edu.gpa && <span className="ml-2 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs">GPA: {edu.gpa}</span>}
                  </div>
                  <span className="text-sm text-gray-500">{edu.endDate}</span>
                </div>
              ))}
            </section>
          )}

          <div className="grid grid-cols-2 gap-6">
            {/* Projects - Important for students */}
            {projects.length > 0 && (
              <section>
                <h2 className="text-purple-700 font-bold uppercase text-sm border-b-2 border-purple-300 pb-1 mb-3">Projects</h2>
                {projects.map((proj) => (
                  <div key={proj.id} className="mb-4 p-3 bg-purple-50 rounded-lg">
                    <h3 className="font-bold text-sm">{proj.name}</h3>
                    <div className="flex flex-wrap gap-1 my-1">
                      {proj.technologies.map((tech, idx) => (
                        <span key={idx} className="bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full text-xs">{tech}</span>
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
                  <h2 className="text-pink-700 font-bold uppercase text-sm border-b-2 border-pink-300 pb-1 mb-3">Experience</h2>
                  {experience.map((exp) => (
                    <div key={exp.id} className="mb-3">
                      <h3 className="font-bold text-sm">{exp.position}</h3>
                      <p className="text-xs text-pink-600">{exp.company} • {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
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
                  <h2 className="text-indigo-700 font-bold uppercase text-sm border-b-2 border-indigo-300 pb-1 mb-3">Skills</h2>
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

  // Entry Level Template - Skills focused, clean
  if (template === 'entry') {
    return (
      <div className="resume-preview bg-white text-black shadow-lg max-w-[8.5in] mx-auto" style={{ minHeight: '11in' }}>
        <header className="bg-green-600 text-white p-6">
          <h1 className="text-2xl font-bold">{personalInfo.fullName || 'Your Name'}</h1>
          <div className="flex gap-4 mt-2 text-green-100 text-sm">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>|</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>|</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
        </header>

        <div className="p-6">
          {personalInfo.summary && (
            <section className="mb-5 border-l-4 border-green-500 pl-4 bg-green-50 py-3">
              <h2 className="text-green-700 font-bold text-sm uppercase mb-1">Career Objective</h2>
              <p className="text-sm text-gray-700">{personalInfo.summary}</p>
            </section>
          )}

          {/* Skills First - Important for entry level */}
          {skills.length > 0 && (
            <section className="mb-5">
              <h2 className="text-green-700 font-bold uppercase text-sm border-b-2 border-green-300 pb-1 mb-3">Key Skills & Competencies</h2>
              <div className="grid grid-cols-2 gap-4">
                {skills.map((skill) => (
                  <div key={skill.id} className="bg-green-50 rounded p-3">
                    <p className="font-bold text-xs text-green-800 mb-2">{skill.category}</p>
                    <div className="flex flex-wrap gap-1">
                      {skill.items.map((item, idx) => (
                        <span key={idx} className="bg-green-200 text-green-700 px-2 py-1 rounded text-xs">{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div>
              {education.length > 0 && (
                <section className="mb-5">
                  <h2 className="text-green-700 font-bold uppercase text-sm border-b-2 border-green-300 pb-1 mb-3">Education</h2>
                  {education.map((edu) => (
                    <div key={edu.id} className="mb-3 p-3 border border-green-200 rounded">
                      <p className="font-bold text-sm">{edu.degree} in {edu.field}</p>
                      <p className="text-sm text-green-600">{edu.institution}</p>
                      <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                      {edu.gpa && <p className="text-xs text-green-700 mt-1">GPA: {edu.gpa}</p>}
                    </div>
                  ))}
                </section>
              )}

              {projects.length > 0 && (
                <section>
                  <h2 className="text-green-700 font-bold uppercase text-sm border-b-2 border-green-300 pb-1 mb-3">Projects</h2>
                  {projects.map((proj) => (
                    <div key={proj.id} className="mb-3">
                      <h3 className="font-bold text-sm">{proj.name}</h3>
                      <p className="text-xs text-green-600">{proj.technologies.join(' • ')}</p>
                      <p className="text-xs text-gray-600 mt-1">{proj.description}</p>
                    </div>
                  ))}
                </section>
              )}
            </div>

            <div>
              {experience.length > 0 && (
                <section>
                  <h2 className="text-green-700 font-bold uppercase text-sm border-b-2 border-green-300 pb-1 mb-3">Work Experience</h2>
                  {experience.map((exp) => (
                    <div key={exp.id} className="mb-4">
                      <h3 className="font-bold text-sm">{exp.position}</h3>
                      <p className="text-sm text-green-600">{exp.company}</p>
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
    <div className="resume-preview bg-white text-black p-8 shadow-lg max-w-[8.5in] mx-auto" style={{ minHeight: '11in' }}>
      <p className="text-center text-gray-500">Template not found</p>
    </div>
  );
};
