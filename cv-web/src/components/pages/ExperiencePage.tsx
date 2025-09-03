import React, { useState } from 'react';
import { Emploi, Entreprise } from '../../services/directus';
import { HiClock, HiBriefcase, HiCalendar, HiViewList, HiMap } from 'react-icons/hi';
import IconWrapper from '../IconWrapper';
import CompanyModal from '../CompanyModal';
import ExperienceMap from '../ExperienceMap';

// Import des icônes personnalisées
import timelineCustomIcon from '../../assets/icons/timeline-custom.svg';
import locationCustomIcon from '../../assets/icons/location-custom.svg';
import timeCustomIcon from '../../assets/icons/time-custom.svg';
import dateCustomIcon from '../../assets/icons/date-custom.svg';
import workCustomIcon from '../../assets/icons/work-custom.svg';

interface ExperiencePageProps {
  emplois: Emploi[];
}

type ViewMode = 'list' | 'map';

const ExperiencePage: React.FC<ExperiencePageProps> = ({ emplois }) => {
  // État pour le modal d'entreprise
  const [selectedCompany, setSelectedCompany] = useState<Entreprise | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // État pour la vue active (liste ou carte)
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Fonction pour ouvrir le modal d'entreprise
  const openCompanyModal = (company: Entreprise) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  // Fonction pour fermer le modal
  const closeCompanyModal = () => {
    setIsModalOpen(false);
    setSelectedCompany(null);
  };

  // Trier les emplois par date de début (plus récent en premier)
  const sortedEmplois = emplois
    .filter(emploi => emploi.status !== 'archived')
    .sort((a, b) => {
      if (!a.Debut) return 1;
      if (!b.Debut) return -1;
      return new Date(b.Debut).getTime() - new Date(a.Debut).getTime();
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long'
    });
  };

  const calculateDuration = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    
    if (months < 12) {
      return `${months} mois`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      return remainingMonths > 0 ? `${years} an${years > 1 ? 's' : ''} ${remainingMonths} mois` : `${years} an${years > 1 ? 's' : ''}`;
    }
  };

  const getContractTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'CDI': '#10b981',
      'CDD': '#3b82f6', 
      'Stage': '#f59e0b',
      'Freelance': '#8b5cf6',
      'Alternance': '#ef4444',
      'Interim': '#6b7280'
    };
    return colors[type] || '#6b7280';
  };

  // Fonction pour déterminer la classe CSS du type de contrat
  const getContractBadgeClass = (contractType: string) => {
    const type = contractType.toLowerCase();
    if (type.includes('cdi')) return 'contract-badge-cdi';
    if (type.includes('cdd')) return 'contract-badge-cdd';
    if (type.includes('stage')) return 'contract-badge-stage';
    if (type.includes('freelance') || type.includes('indépendant')) return 'contract-badge-freelance';
    if (type.includes('alternance') || type.includes('apprentissage')) return 'contract-badge-alternance';
    if (type.includes('intérim') || type.includes('interim')) return 'contract-badge-interim';
    return 'contract-badge-default'; // Couleur par défaut
  };

  if (sortedEmplois.length === 0) {
    return (
      <div className="experience-page">
        <div className="page-header">
          <div className="section-title-with-count">
            <h1 className="section-title">
              Expériences professionnelles
            </h1>
            <span className="experience-count">
              0 expérience
            </span>
          </div>
        </div>
        <div className="empty-state">
          <p>Aucune expérience professionnelle ajoutée pour le moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="experience-page">
      <div className="page-header">
        <div className="experience-header-content">
          <div className="experience-title-section">
            <h1 className="experience-title">
              Expériences professionnelles
            </h1>
            <span className="experience-count">
              {sortedEmplois.length} expérience{sortedEmplois.length > 1 ? 's' : ''}
            </span>
          </div>
          
          {/* Toggle entre vue liste et vue carte */}
          <div className="experience-view-toggle">
            <button
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <img src={timelineCustomIcon} alt="Timeline" className="toggle-icon" />
              Timeline
            </button>
            <button
              className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
              onClick={() => setViewMode('map')}
            >
              <img src={locationCustomIcon} alt="Carte" className="toggle-icon" />
              Carte
            </button>
          </div>
        </div>
      </div>

      <div className="experience-content">

      {/* Contenu selon la vue sélectionnée */}
      {viewMode === 'list' ? (
        <div className="timeline">
          {sortedEmplois.map((emploi, index) => (
            <div key={emploi.id} className={`timeline-item ${index === 0 ? 'current' : ''}`}>
              <div className="timeline-marker">
                <div className="timeline-dot">
                  <img src={workCustomIcon} alt="Travail" className="timeline-dot-icon" />
                </div>
                {index < sortedEmplois.length - 1 && <div className="timeline-line"></div>}
              </div>
              
              <div className="timeline-content">
                <div className="experience-card">
                  {/* En-tête de la card */}
                  <div className="card-header">
                    <div className="job-main-info">
                      <h3 className="job-title">{emploi.Poste}</h3>
                      {emploi.Entreprise ? (
                        <div className="company-info-left">
                          <button 
                            className="company-name-btn"
                            onClick={() => emploi.Entreprise && openCompanyModal(emploi.Entreprise)}
                            title={`Voir les détails de ${emploi.Entreprise.Nom}`}
                          >
                            {emploi.Entreprise.Nom}
                          </button>
                        </div>
                      ) : null}
                    </div>
                    
                    <div className="job-badges">
                      <span className={`contract-badge ${getContractBadgeClass(emploi.Type)}`}>
                        {emploi.Type}
                      </span>
                      {index === 0 && !emploi.Fin && (
                        <span className="current-badge">En cours</span>
                      )}
                    </div>
                  </div>

                  {/* Dates et durée */}
                  <div className="card-dates">
                    <div className="date-info">
                      <img src={dateCustomIcon} alt="Date" className="date-icon" />
                      <span className="date-range">
                        {emploi.Debut ? formatDate(emploi.Debut) : 'Date non définie'}
                        {emploi.Fin ? (
                          <> - {formatDate(emploi.Fin)}</>
                        ) : (
                          <> - Présent</>
                        )}
                      </span>
                    </div>
                    
                    {emploi.Debut && (
                      <div className="duration">
                        <img src={timeCustomIcon} alt="Durée" className="duration-icon" />
                        <span>{calculateDuration(emploi.Debut, emploi.Fin)}</span>
                      </div>
                    )}
                  </div>

                  {/* Description du poste */}
                  {emploi.Description && (
                    <div className="card-description">
                      <h4>Missions et responsabilités</h4>
                      <p style={{ whiteSpace: 'pre-line' }}>{emploi.Description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ExperienceMap emplois={sortedEmplois} />
      )}
      </div>

      {/* Modal pour les détails de l'entreprise */}
      <CompanyModal
        company={selectedCompany}
        isOpen={isModalOpen}
        onClose={closeCompanyModal}
      />
    </div>
  );
};

export default ExperiencePage;
