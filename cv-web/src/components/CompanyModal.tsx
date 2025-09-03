import React from 'react';
import { Entreprise } from '../services/directus';
import { HiX, HiOfficeBuilding, HiLocationMarker, HiTag } from 'react-icons/hi';
import IconWrapper from './IconWrapper';

interface CompanyModalProps {
  company: Entreprise | null;
  isOpen: boolean;
  onClose: () => void;
}

const CompanyModal: React.FC<CompanyModalProps> = ({ company, isOpen, onClose }) => {
  if (!isOpen || !company) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getAssetUrl = (fileId?: string): string | undefined => {
    if (!fileId) return undefined;
    return `http://localhost:8055/assets/${fileId}`;
  };

  const formatPosition = (position: any): string => {
    if (typeof position === 'string') {
      return position;
    }
    
    if (typeof position === 'object' && position !== null) {
      // Si c'est un objet géographique avec coordinates [longitude, latitude]
      if (position.coordinates && Array.isArray(position.coordinates) && position.coordinates.length >= 2) {
        const [longitude, latitude] = position.coordinates;
        return `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`;
      }
      
      // Si l'objet a une propriété name ou city
      if (position.name) return position.name;
      if (position.city) return position.city;
      if (position.address) return position.address;
      
      // Fallback : convertir en JSON (mais nettoyer)
      return 'Localisation disponible';
    }
    
    return 'Localisation non disponible';
  };

  const formatSecteur = (secteur: any): string => {
    if (typeof secteur === 'string') {
      return secteur;
    }
    
    if (typeof secteur === 'object' && secteur !== null) {
      // Si l'objet a une propriété name ou label
      if (secteur.name) return secteur.name;
      if (secteur.label) return secteur.label;
      if (secteur.title) return secteur.title;
      
      // Si c'est un tableau, on prend le premier élément
      if (Array.isArray(secteur) && secteur.length > 0) {
        return formatSecteur(secteur[0]);
      }
      
      return 'Secteur disponible';
    }
    
    return 'Secteur non disponible';
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content company-modal">
        {/* Header avec bouton fermer */}
        <div className="modal-header">
          <div className="company-header">
        <div className="company-logo-section">
              {company.Logotype ? (
                <img 
                  src={getAssetUrl(company.Logotype)} 
                  alt={`Logo ${company.Nom}`}
                  className="company-logo"
                />
              ) : (
                <div className="company-logo-placeholder">
                  <IconWrapper IconComponent={HiOfficeBuilding} size={48} />
                </div>
              )}
            </div>
            <h3 className="company-name">{company.Nom}</h3>
            </div>
          <button 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Fermer"
          >
            <IconWrapper IconComponent={HiX} size={24} />
          </button>
        </div>

        {/* Corps du modal */}
        <div className="modal-body">
          {/* Section principale avec logo et nom */}
          <div className="company-main">
            

            
              
              
              {/* Position/Localisation */}
              {company.Position && (
                <div className="company-detail">
                  <IconWrapper IconComponent={HiLocationMarker} size={24} />
                  <span>{formatPosition(company.Position)}</span>
                </div>
              )}

              {/* Secteur d'activité */}
              {company.Secteur && (
                <div className="company-detail">
                  <IconWrapper IconComponent={HiTag} size={24} />
                  <span className="company-sector">{formatSecteur(company.Secteur)}</span>
                </div>
              )}
          </div>

          {/* Description */}
          {company.Description && (
            <div className="company-description">
              <h4>À propos de l'entreprise</h4>
              <p>{company.Description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyModal;
