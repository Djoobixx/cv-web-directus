import React from 'react';
import { HiMail, HiPhone, HiLocationMarker, HiGlobeAlt, HiUser, HiCalendar, HiIdentification, HiMap } from 'react-icons/hi';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import IconWrapper from '../IconWrapper';
import InteractiveMap from '../InteractiveMap';
import { Profil, Permis, directusService } from '../../services/directus';

// Import des icônes personnalisées
import contactCustomIcon from '../../assets/icons/contact-custom.svg';
import permitCustomIcon from '../../assets/icons/permit-custom.svg';
import locationCustomIcon from '../../assets/icons/location-custom.svg';
import mailCustomIcon from '../../assets/icons/mail-custom.svg';
import phoneCustomIcon from '../../assets/icons/phone-custom.svg';
import webCustomIcon from '../../assets/icons/web-custom.svg';

interface ProfilePageProps {
  profileData?: Profil | null;
  permisData?: Permis[];
}

const ProfilePage: React.FC<ProfilePageProps> = ({ profileData, permisData = [] }) => {
  // Fonction pour calculer l'âge
  const calculateAge = (dateString: string): number => {
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Si aucune donnée profil, afficher un message
  if (!profileData) {
    return (
      <div className="profile-page">
        <div className="empty-state">
          <IconWrapper IconComponent={HiUser} size={64} color="#9ca3af" />
          <h2>Aucun profil configuré</h2>
          <p>Configurez votre profil dans Directus pour l'afficher ici.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Section Photo fixe à gauche */}
      <div className="profile-header">
        <div className="profile-photo">
          {profileData.Photo_de_profil ? (
            <img 
              src={directusService.getAssetUrl(profileData.Photo_de_profil)} 
              alt={`${profileData.Prenom} ${profileData.Nom}`}
              className="profile-image"
            />
          ) : (
            <div className="profile-placeholder">
              <IconWrapper IconComponent={HiUser} size={80} color="#6b7280" />
            </div>
          )}
        </div>
      </div>

      {/* Contenu scrollable à droite */}
      <div className="profile-content">
        {/* Informations personnelles en haut */}
        <div className="profile-info">
          {profileData.Poste && (
            <h1 className="profile-name-title">{profileData.Poste}</h1>
          )}
          <div className="profile-name-age">
            <p className="profile-job-title">{profileData.Prenom} {profileData.Nom}</p>
            {profileData.Date_de_naissance && profileData.View_naissance && (
              <p className="profile-age-info">{calculateAge(profileData.Date_de_naissance)} ans</p>
            )}
          </div>
        </div>

      {/* Section Résumé - Afficher si disponible */}
      {profileData.Resume && (
        <div className="profile-section">
          <div className="resume-content">
            <p style={{ whiteSpace: 'pre-line' }}>{profileData.Resume}</p>
          </div>
        </div>
      )}

      {/* Section Contact */}
      <div className="contact-section">
        <div className="contact-list">
          {/* Email - Afficher si disponible et autorisé */}
          {profileData.Mail && profileData.View_mail && (
            <div className="contact-item">
              <div className="contact-icon-container">
                <img src={mailCustomIcon} alt="Email" className="contact-icon" />
              </div>
              <a href={`mailto:${profileData.Mail}`} className="contact-link">
                {profileData.Mail}
              </a>
            </div>
          )}
          
          {/* Téléphone - Afficher si disponible et autorisé */}
          {profileData.Telephone && profileData.View_telephone && (
            <div className="contact-item">
              <div className="contact-icon-container">
                <img src={phoneCustomIcon} alt="Téléphone" className="contact-icon" />
              </div>
              <a href={`tel:${profileData.Telephone}`} className="contact-link">
                {profileData.Telephone}
              </a>
            </div>
          )}
          
          {/* Site Web - Afficher si disponible et autorisé */}
          {profileData.Site_web && profileData.View_site_web && (
            <div className="contact-item">
              <div className="contact-icon-container">
                <img src={webCustomIcon} alt="Site Web" className="contact-icon" />
              </div>
              <a href={profileData.Site_web} target="_blank" rel="noopener noreferrer" className="contact-link">
                {profileData.Site_web}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Section Réseaux Sociaux - Pour l'instant commenté car pas encore en DB */}
      {/* TODO: Ajouter les champs réseaux sociaux à la collection Profil */}
      {false && (
        <div className="profile-section">
          <h2 className="section-title">
            Réseaux Sociaux
          </h2>
          <div className="social-grid">
            <p>Réseaux sociaux à configurer dans Directus</p>
          </div>
        </div>
      )}

      {/* Section Permis */}
      {permisData && permisData.length > 0 && (
        <div className="profile-section">
          <div className="permits-section">
            <h2 className="section-title">
              Permis
            </h2>
            <div className="permits-list">
              {permisData.map((permis) => (
                <div key={permis.id} className="permit-item">
                  <span className="permit-name">{permis.Type}</span>
                  {permis.Obtention && (
                    <span className="permit-date">
                      Obtenu le {new Date(permis.Obtention).toLocaleDateString('fr-FR')}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section Adresse */}
      {profileData.Adresse && profileData.View_adresse && (
        <div className="profile-section location-section">
          <h2 className="section-title">
            Localisation
          </h2>
          <p> Voici mon adresse ! Avec la votre vous pouvez calculer le trajet le plus court entre nous.</p>
          <div className="address-section">
            <InteractiveMap userAddress={profileData.Adresse} />
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default ProfilePage;
