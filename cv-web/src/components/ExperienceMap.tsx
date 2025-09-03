import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import L from 'leaflet';
import { Emploi, Entreprise } from '../services/directus';
import { HiOfficeBuilding, HiCalendar, HiClock } from 'react-icons/hi';
import IconWrapper from './IconWrapper';
import CompanyModal from './CompanyModal';

// Import des icônes personnalisées
import dateCustomIcon from '../assets/icons/date-custom.svg';
import timeCustomIcon from '../assets/icons/time-custom.svg';

interface ExperienceMapProps {
  emplois: Emploi[];
}

// Créer une icône personnalisée pour les marqueurs d'entreprise
const createCompanyIcon = (isActive?: boolean) => {
  const iconHtml = `
    <div style="
      background: ${isActive ? '#000000' : '#ffffff'};
      color: ${isActive ? '#ffffff' : '#000000'};
      border: 3px solid #000000;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 600;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    ">
      🏢
    </div>
  `;
  
  return L.divIcon({
    html: iconHtml,
    className: 'custom-company-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

const ExperienceMap: React.FC<ExperienceMapProps> = ({ emplois }) => {
  const [selectedCompany, setSelectedCompany] = useState<Entreprise | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mapRef = useRef<any>(null);

  // Forcer le recalcul de la taille de la carte après le montage
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 100);
    
    return () => clearTimeout(timeout);
  }, []);

  // Recalculer la taille lors du redimensionnement de la fenêtre
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        setTimeout(() => {
          mapRef.current.invalidateSize();
        }, 50);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Fonction pour extraire les coordonnées d'un objet Position
  const extractCoordinates = (position: any): LatLngTuple | null => {
    if (!position) return null;

    // Si c'est déjà un string, on ne peut pas l'utiliser pour la carte
    if (typeof position === 'string') return null;

    // Si c'est un objet avec des coordonnées [longitude, latitude]
    if (position.coordinates && Array.isArray(position.coordinates) && position.coordinates.length >= 2) {
      const [longitude, latitude] = position.coordinates;
      return [latitude, longitude]; // Leaflet attend [lat, lng]
    }

    // Si c'est un objet avec lat/lng directs
    if (position.latitude && position.longitude) {
      return [position.latitude, position.longitude];
    }
    if (position.lat && position.lng) {
      return [position.lat, position.lng];
    }

    return null;
  };

  // Filtrer les emplois qui ont des coordonnées valides
  const emploisWithCoordinates = emplois
    .filter(emploi => emploi.status !== 'archived')
    .filter(emploi => emploi.Entreprise && extractCoordinates(emploi.Entreprise.Position))
    .sort((a, b) => {
      if (!a.Debut) return 1;
      if (!b.Debut) return -1;
      return new Date(b.Debut).getTime() - new Date(a.Debut).getTime();
    });

  // Calculer le centre de la carte
  const calculateMapCenter = (): LatLngTuple => {
    if (emploisWithCoordinates.length === 0) {
      return [46.603354, 1.888334]; // Centre de la France par défaut
    }

    const coordinates = emploisWithCoordinates
      .map(emploi => extractCoordinates(emploi.Entreprise?.Position))
      .filter(coord => coord !== null) as LatLngTuple[];

    if (coordinates.length === 0) {
      return [46.603354, 1.888334];
    }

    const avgLat = coordinates.reduce((sum, [lat]) => sum + lat, 0) / coordinates.length;
    const avgLng = coordinates.reduce((sum, [, lng]) => sum + lng, 0) / coordinates.length;

    return [avgLat, avgLng];
  };

  // Fonctions utilitaires
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

  if (emploisWithCoordinates.length === 0) {
    return (
      <div className="experience-map-empty">
        <div className="empty-state">
          <IconWrapper IconComponent={HiOfficeBuilding} size={64} />
          <h3>Aucune localisation disponible</h3>
          <p>Les entreprises doivent avoir des coordonnées géographiques pour être affichées sur la carte.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="experience-map-container">
      <div className="experience-map grayscale-map">
        <MapContainer
          ref={mapRef}
          center={calculateMapCenter()}
          zoom={6}
          className="leaflet-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {emploisWithCoordinates.map((emploi, index) => {
            const coordinates = extractCoordinates(emploi.Entreprise?.Position);
            if (!coordinates || !emploi.Entreprise) return null;

            const isCurrentJob = index === 0 && !emploi.Fin;

            return (
              <Marker
                key={emploi.id}
                position={coordinates}
                icon={createCompanyIcon(isCurrentJob)}
              >
                <Popup className="experience-popup">
                  <div className="popup-experience-content">
                    {/* Header */}
                    <div className="popup-header">
                      <h4 className="popup-job-title">{emploi.Poste}</h4>
                      <button 
                        className="popup-company-btn"
                        onClick={() => emploi.Entreprise && openCompanyModal(emploi.Entreprise)}
                      >
                        {emploi.Entreprise.Nom}
                      </button>
                    </div>

                    {/* Badges */}
                    <div className="popup-badges">
                      <span className={`popup-contract-badge ${getContractBadgeClass(emploi.Type)}`}>{emploi.Type}</span>
                      {isCurrentJob && (
                        <span className="popup-current-badge">En cours</span>
                      )}
                    </div>

                    {/* Dates */}
                    <div className="popup-dates">
                      <div className="popup-date-info">
                        <img src={dateCustomIcon} alt="Date" className="popup-date-icon" />
                        <span>
                          {emploi.Debut ? formatDate(emploi.Debut) : 'Date non définie'}
                          {emploi.Fin ? (
                            <> - {formatDate(emploi.Fin)}</>
                          ) : (
                            <> - Présent</>
                          )}
                        </span>
                      </div>
                      
                      {emploi.Debut && (
                        <div className="popup-duration">
                          <img src={timeCustomIcon} alt="Durée" className="popup-duration-icon" />
                          <span>{calculateDuration(emploi.Debut, emploi.Fin)}</span>
                        </div>
                      )}
                    </div>

                    {/* Description courte */}
                    {emploi.Description && (
                      <div className="popup-description">
                        <p>{emploi.Description.substring(0, 120)}...</p>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
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

export default ExperienceMap;
