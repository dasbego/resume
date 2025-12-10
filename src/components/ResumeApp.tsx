import { LanguageProvider } from '@/contexts/LanguageContext';
import Hero from './Hero';
import ResumeContent from './ResumeContent';
import type { CV } from '@/cv.d';

interface ResumeAppProps {
  cvEs: CV;
  cvEn: CV;
}

export default function ResumeApp({ cvEs, cvEn }: ResumeAppProps) {
  return (
    <LanguageProvider>
      <Hero cvEs={cvEs} cvEn={cvEn} />
      <ResumeContent cvEs={cvEs} cvEn={cvEn} />
    </LanguageProvider>
  );
}

