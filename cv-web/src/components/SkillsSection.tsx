import React, { useState, useMemo } from 'react';
import { Logiciel } from '../services/directus';
import { HiFilter } from 'react-icons/hi';
import IconWrapper from './IconWrapper';

interface SkillsSectionProps {
  logiciels: Logiciel[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ logiciels }) => {
  const [selectedSecteur, setSelectedSecteur] = useState<string>('Tous');

  // Récupérer tous les secteurs uniques
  const allSecteurs = useMemo(() => {
    const secteursSet = new Set<string>();
    logiciels.forEach(logiciel => {
      if (logiciel.Secteur) {
        logiciel.Secteur.forEach(secteur => secteursSet.add(secteur));
      }
    });
    return ['Tous', ...Array.from(secteursSet).sort()];
  }, [logiciels]);

  // Filtrer les logiciels selon le secteur sélectionné
  const filteredLogiciels = useMemo(() => {
    if (selectedSecteur === 'Tous') {
      return logiciels;
    }
    return logiciels.filter(logiciel => 
      logiciel.Secteur?.includes(selectedSecteur)
    );
  }, [logiciels, selectedSecteur]);

  const getNiveauColor = (niveau: number) => {
    switch (niveau) {
      case 5: return '#10b981'; // Expert - Vert
      case 4: return '#3b82f6'; // Avancé - Bleu
      case 3: return '#eab308'; // Intermédiaire - Jaune
      case 2: return '#f59e0b'; // Débutant+ - Orange
      case 1: return '#ef4444'; // Débutant - Rouge
      default: return '#9ca3af'; // Non défini - Gris
    }
  };

  const getNiveauLabel = (niveau: number) => {
    switch (niveau) {
      case 5: return 'Expert';
      case 4: return 'Avancé';
      case 3: return 'Intermédiaire';
      case 2: return 'Débutant+';
      case 1: return 'Débutant';
      default: return 'Non défini';
    }
  };

    return (
    <section className="section-logiciels">
      <div className="section-logiciels-header">
        <div className="logiciels-header-content">
          <div className="logiciels-title-section">
            <h2 className="section-logiciels-title">
              Logiciels
            </h2>
            <span className="logiciels-count">
              {filteredLogiciels.length} logiciel{filteredLogiciels.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
      
      {/* Filtres par secteur */}
      <div className="skills-filters">
        <div className="filter-buttons">
          {allSecteurs.map(secteur => (
            <button
              key={secteur}
              onClick={() => setSelectedSecteur(secteur)}
              className={`filter-btn ${selectedSecteur === secteur ? 'active' : ''}`}
            >
              {secteur}
              {selectedSecteur === secteur && (
                <span className="filter-count">
                  ({selectedSecteur === 'Tous' ? logiciels.length : filteredLogiciels.length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des logiciels filtrés */}
      <div className="skills-list">
        {filteredLogiciels.map((logiciel) => (
          <div key={logiciel.id} className="skill-item">
            <div className="skill-main">
              {logiciel.Icones && (
                <img 
                  src={`http://localhost:8055/assets/${logiciel.Icones}`}
                  alt={logiciel.Nom}
                  className="skill-icon"
                />
              )}
              <div className="skill-info">
                <span className="skill-name">{logiciel.Nom}</span>
                <div className="skill-sectors">
                  {logiciel.Secteur?.map(secteur => (
                    <span key={secteur} className="sector-badge">
                      {secteur}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="skill-level">
              
              <span 
                className="level-badge"
                style={{ backgroundColor: getNiveauColor(logiciel.Niveau) }}
              >
                {getNiveauLabel(logiciel.Niveau)}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {filteredLogiciels.length === 0 && logiciels.length > 0 && (
        <div className="empty-filter">
          <p>Aucun logiciel trouvé pour le secteur "{selectedSecteur}"</p>
          <button 
            onClick={() => setSelectedSecteur('Tous')}
            className="reset-filter-btn"
          >
            Voir tous les logiciels
          </button>
        </div>
      )}
      
      {logiciels.length === 0 && (
        <div className="empty-state">
          <p>Aucune compétence technique ajoutée pour le moment.</p>
        </div>
      )}
    </section>
  );
};

export default SkillsSection;
