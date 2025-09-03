import React, { useEffect, useState } from 'react';
import { directusService, Acces } from '../services/directus';
import lockImage from '../assets/img/lock-acces-face.png';
import mailCustomIcon from '../assets/icons/mail-custom.svg';
import phoneCustomIcon from '../assets/icons/phone-custom.svg';
import dangerCustomIcon from '../assets/icons/danger-custom.svg';

interface AccessGuardProps {
  children: React.ReactNode;
}

const AccessGuard: React.FC<AccessGuardProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenData, setTokenData] = useState<Acces | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (!token) {
        // Pas de token = accès refusé directement
        setError('Token d\'accès requis');
        setLoading(false);
        return;
      }

      try {
        const result = await directusService.verifyAccessToken(token);
        
        if (result.valid && result.tokenData) {
          setIsAuthenticated(true);
          setTokenData(result.tokenData);
        } else {
          setError(result.reason || 'Accès refusé');
        }
      } catch (error) {
        setError('Erreur de vérification');
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, []);





  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>Vérification de l'accès...</h2>
          <p>Veuillez patienter pendant que nous vérifions vos droits d'accès.</p>
        </div>
      </div>
    );
  }



  if (error) {
    return (
      <div className="access-denied">
        <div className="access-denied-content">
          <div className="access-denied-icon">
            <img src={lockImage} alt="Accès refusé" />
          </div>
          <h1>Accès refusé</h1>
          <p className="error-message">
            <img src={dangerCustomIcon} alt="Erreur" className="error-icon" />
            {error}
          </p>
          <p className="contact-info">
            Oops ! Il semble que vous ayez oublié votre clé magique 🔑<br/>
            Pas de panique, contactez-moi et je vous enverrai un accès VIP à mon CV !
          </p>
          <div className="contact-section">
            <div className="contact-list">
              <div className="contact-item">
                <div className="contact-icon-container">
                  <img src={mailCustomIcon} alt="Email" className="contact-icon" />
                </div>
                <a href="mailto:jordan.matiassoares@gmail.com" className="contact-link">
                  jordan.matiassoares@gmail.com
                </a>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon-container">
                  <img src={phoneCustomIcon} alt="Téléphone" className="contact-icon" />
                </div>
                <a href="tel:0646093542" className="contact-link">
                  06 46 09 35 42
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthenticated && tokenData) {
    return (
      <div>
        {children}
      </div>
    );
  }

  return null;
};

export default AccessGuard;
