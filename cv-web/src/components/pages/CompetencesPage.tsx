import React from 'react';
import { Logiciel, Langue } from '../../services/directus';
import SkillsSection from '../SkillsSection';
import LanguageSection from '../LanguageSection';

interface CompetencesPageProps {
  logiciels: Logiciel[];
  langues: Langue[];
}

const CompetencesPage: React.FC<CompetencesPageProps> = ({ logiciels, langues }) => {
  return (
    <div className="competences-page">
      <div className="competences-content">
        <SkillsSection logiciels={logiciels} />
        <LanguageSection langues={langues} />
      </div>
    </div>
  );
};

export default CompetencesPage;
