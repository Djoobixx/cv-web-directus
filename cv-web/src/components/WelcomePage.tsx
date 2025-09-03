import React from 'react';

interface WelcomePageProps {
  onContinue: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onContinue }) => {
  return (
    <div className="welcome-page">
      <div className="welcome-container">
        <div className="welcome-content">
          <div className="welcome-header">
            <div className="welcome-icon">👋</div>
            <h1 className="welcome-title">Bienvenue sur mon CV Web</h1>
            <p className="welcome-subtitle">
              Découvrez mon parcours professionnel et mes compétences
            </p>
          </div>

          <div className="welcome-features">
            <div className="feature-item">
              <div className="feature-icon">💼</div>
              <h3>Expériences Professionnelles</h3>
              <p>Mon parcours et mes réalisations</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">🛠️</div>
              <h3>Compétences Techniques</h3>
              <p>Logiciels et technologies maîtrisées</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">🌍</div>
              <h3>Langues</h3>
              <p>Mes compétences linguistiques</p>
            </div>
          </div>

          <div className="welcome-actions">
            <button 
              className="continue-btn"
              onClick={onContinue}
            >
              <span>Demander un accès</span>
              <div className="btn-arrow">→</div>
            </button>
          </div>

          <div className="welcome-footer">
            <p>CV interactif et moderne</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
