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

export default function ResumeContent({ cvEs, cvEn }: ResumeContentProps) {
  const { language } = useLanguage();
  const cv = language === 'en' ? cvEn : cvEs;
  const titles = sectionTitles[language];

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return language === 'en' ? 'Present' : 'Actual';
    const date = new Date(dateStr);
    return date.getFullYear().toString();
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
          {cv.education.map((edu, index) => (
            <li key={index}>
              <article>
                <header>
                  <div>
                    <h3>{edu.institution}</h3>
                  </div>
                </header>
                <footer>
                  <p>{edu.area}</p>
                </footer>
              </article>
            </li>
          ))}
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

      {/* Skills Section */}
      <section data-section="skills">
        <h2>{titles.skills}</h2>
        <ul>
          {cv.skills.map((skill) => (
            <li key={skill.name}>
              <span>{skill.name}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

