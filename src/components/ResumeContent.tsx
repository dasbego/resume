import { useLanguage } from '@/contexts/LanguageContext';
import './ResumeContent.css';
import type { CV } from '@/cv.d';

interface ResumeContentProps {
  cvEs: CV;
  cvEn: CV;
}

const sectionTitles = {
  en: {
    about: 'About',
    experience: 'Work Experience',
    education: 'Education',
    projects: 'Projects',
    skills: 'Skills',
  },
  es: {
    about: 'Sobre mí',
    experience: 'Experiencia laboral',
    education: 'Educación',
    projects: 'Proyectos',
    skills: 'Habilidades',
  },
};

const skillGroups = {
  en: [
    { label: 'Languages', skills: ['TypeScript', 'JavaScript', 'HTML5', 'CSS3'] },
    { label: 'Frameworks & Tools', skills: ['React', 'Next.js', 'Astro', 'AngularJS', 'Vite', 'Webpack', 'Redux', 'Node.js'] },
    { label: 'Testing & UI', skills: ['Jest', 'Playwright', 'Storybook', 'Chakra UI', 'Tailwind CSS', 'Figma'] },
    { label: 'Analytics & Observability', skills: ['Snowplow', 'Adobe Analytics', 'Grafana', 'Datadog RUM'] },
    { label: 'Compliance & Consent', skills: ['OneTrust', 'CCPA & GDPR Compliance'] },
    { label: 'DevOps & Infrastructure', skills: ['GitLab CI/CD', 'Jenkins', 'Docker', 'Feature Flags', 'A/B Testing', 'Git'] },
    { label: 'Backend & Data', skills: ['Supabase', 'PostgreSQL', 'REST APIs', 'WebRTC'] },
    { label: 'AI', skills: ['AI/LLM Integration'] },
  ],
  es: [
    { label: 'Lenguajes', skills: ['TypeScript', 'JavaScript', 'HTML5', 'CSS3'] },
    { label: 'Frameworks y Herramientas', skills: ['React', 'Next.js', 'Astro', 'AngularJS', 'Vite', 'Webpack', 'Redux', 'Node.js'] },
    { label: 'Testing y UI', skills: ['Jest', 'Playwright', 'Storybook', 'Chakra UI', 'Tailwind CSS', 'Figma'] },
    { label: 'Analytics y Observabilidad', skills: ['Snowplow', 'Adobe Analytics', 'Grafana', 'Datadog RUM'] },
    { label: 'Compliance y Consentimiento', skills: ['OneTrust', 'CCPA & GDPR Compliance'] },
    { label: 'DevOps e Infraestructura', skills: ['GitLab CI/CD', 'Jenkins', 'Docker', 'Feature Flags', 'A/B Testing', 'Git'] },
    { label: 'Backend y Datos', skills: ['Supabase', 'PostgreSQL', 'REST APIs', 'WebRTC'] },
    { label: 'IA', skills: ['AI/LLM Integration'] },
  ],
};

export default function ResumeContent({ cvEs, cvEn }: ResumeContentProps) {
  const { language } = useLanguage();
  const cv = language === 'en' ? cvEn : cvEs;
  const titles = sectionTitles[language];

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return language === 'en' ? 'Present' : 'Actual';
    const [year, month] = dateStr.split('-').map(Number);
    const monthNames = language === 'en'
      ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      : ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${monthNames[month - 1]} ${year}`;
  };

  return (
    <>
      {/* About Section */}
      <section data-section="about">
        <h2>{titles.about}</h2>
        <p>{cv.basics.summary}</p>
      </section>

      {/* Experience Section */}
      <section data-section="experience">
        <h2>{titles.experience}</h2>
        <ul>
          {cv.work.map((job) => {
            const startYear = formatDate(job.startDate);
            const endYear = formatDate(job.endDate);
            const years = `${startYear} - ${endYear}`;

            return (
              <li key={`${job.name}-${job.startDate}`}>
                <article>
                  <header>
                    <div>
                      <h3>{job.name}</h3>
                      <h4>{job.position}</h4>
                    </div>
                    <time>{years}</time>
                  </header>
                  <footer>
                    <p>{job.summary}</p>
                  </footer>
                </article>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Education Section */}
      <section data-section="education">
        <h2>{titles.education}</h2>
        <ul>
          {cv.education.map((edu, index) => {
            const eduYears = edu.startDate && edu.endDate
              ? `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`
              : '';
            return (
            <li key={index}>
              <article>
                <header>
                  <div>
                    <h3>{edu.institution}</h3>
                  </div>
                  {eduYears && <time>{eduYears}</time>}
                </header>
                <footer>
                  <p>{edu.area}</p>
                </footer>
              </article>
            </li>
          );
          })}
        </ul>
      </section>

      {/* Projects Section */}
      <section data-section="projects">
        <h2>{titles.projects}</h2>
        <ul>
          {cv.projects.map((project) => (
            <li key={project.name}>
              <article>
                <header>
                  <h3>
                    <a
                      href={project.url}
                      title={language === 'en' ? `View project ${project.name}` : `Ver el proyecto ${project.name}`}
                    >
                      {project.name}
                    </a>
                    {project.isActive && <span>•</span>}
                  </h3>
                  <p>{project.description}</p>
                </header>
                <footer>
                  {project.highlights.map((highlight, idx) => (
                    <span key={idx}>{highlight}</span>
                  ))}
                </footer>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* Skills Section — badges (screen) */}
      <section data-section="skills" class="no-print">
        <h2>{titles.skills}</h2>
        <ul>
          {cv.skills.map((skill) => (
            <li key={skill.name}>
              <span>{skill.name}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Skills Section — grouped text (print only) */}
      <section data-section="skills-print" class="print">
        <h2>{titles.skills}</h2>
        <dl>
          {skillGroups[language].map((group) => (
            <div key={group.label} class="skill-group">
              <dt>{group.label}:</dt>
              <dd>{group.skills.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}

