import React from 'react';
import { Langue } from '../services/directus';
import { HiTranslate } from 'react-icons/hi';
import IconWrapper from './IconWrapper';
import ReactCountryFlag from "react-country-flag";

interface LanguageSectionProps {
  langues: Langue[];
}

const LanguageSection: React.FC<LanguageSectionProps> = ({ langues }) => {
  const getNiveauColor = (niveau: string) => {
    const niveauLower = niveau.toLowerCase();
    if (niveauLower.includes('expert') || niveauLower.includes('natif') || niveauLower.includes('maternelle')) {
      return '#10b981'; // Vert - Expert
    } else if (niveauLower.includes('avancé') || niveauLower.includes('courant')) {
      return '#3b82f6'; // Bleu - Avancé
    } else if (niveauLower.includes('intermédiaire')) {
      return '#eab308'; // Jaune - Intermédiaire
    } else if (niveauLower.includes('élémentaire')) {
      return '#f59e0b'; // Orange - Élémentaire
    } else if (niveauLower.includes('débutant')) {
      return '#ef4444'; // Rouge - Débutant
    } else {
      return '#6b7280'; // Gris - Non défini
    }
  };

  const getCountryCode = (langue: string) => {
    const countryMap: Record<string, string> = {
      'français': 'FR',
      'anglais': 'GB',
      'espagnol': 'ES',
      'allemand': 'DE',
      'italien': 'IT',
      'portugais': 'PT',
      'japonais': 'JP',
      'chinois': 'CN',
      'arabe': 'SA',
      'russe': 'RU',
      'néerlandais': 'NL',
      'suédois': 'SE',
      'norvégien': 'NO',
      'danois': 'DK',
      'finnois': 'FI',
      'polonais': 'PL',
      'tchèque': 'CZ',
      'hongrois': 'HU',
      'roumain': 'RO',
      'bulgare': 'BG',
      'grec': 'GR',
      'turc': 'TR',
      'hébreu': 'IL',
      'hindi': 'IN',
      'coréen': 'KR',
      'thaï': 'TH',
      'vietnamien': 'VN',
      'indonésien': 'ID',
      'malais': 'MY',
      'philippin': 'PH'
    };
    
    return countryMap[langue.toLowerCase()] || null;
  };

  return (
    <section className="section-langues">
      <div className="section-langues-header">
        <div className="langues-header-content">
          <div className="langues-title-section">
            <h2 className="section-langues-title">
              Langues
            </h2>
            <span className="langues-count">
              {langues.length} langue{langues.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
      
      {langues.length === 0 ? (
        <div className="empty-state">
          <IconWrapper IconComponent={HiTranslate} size={64} />
          <p>Aucune langue ajoutée pour le moment.</p>
        </div>
      ) : (
        <div className="languages-grid">
          {langues.map((langue) => (
            <div key={langue.id} className="language-item">
              <div className="language-main">
                <div className="language-flag">
                  {getCountryCode(langue.Langue) ? (
                    <ReactCountryFlag 
                      countryCode={getCountryCode(langue.Langue)!} 
                      svg 
                      style={{ width: '3em', height: '3em' }}
                    />
                  ) : (
                    <IconWrapper IconComponent={HiTranslate} size={48} color="#6b7280" />
                  )}
                </div>
                <div className="language-info">
                  <span className="language-name">{langue.Langue}</span>
                </div>
              </div>
              
              <div className="language-level">
                <span 
                  className="level-badge"
                >
                  {langue.Niveau}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default LanguageSection;
