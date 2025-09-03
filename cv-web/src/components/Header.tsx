import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Photo de profil */}
        <div style={{ 
          width: '120px', 
          height: '120px', 
          background: 'white', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#2563eb',
          fontSize: '2.5rem',
          fontWeight: 'bold'
        }}>
          JM
        </div>
        
        {/* Informations personnelles */}
        <div style={{ flex: 1 }}>
          <h1>Jordan Matias Soares</h1>
          <h2>Développeur Full Stack</h2>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.875rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📧</span>
              <span>jordan.matiassoares@gmail.com</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🌐</span>
              <span>Portfolio</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📱</span>
              <span>LinkedIn</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Description */}
      <div style={{ marginTop: '1.5rem' }}>
        <p style={{ color: '#dbeafe', maxWidth: '48rem' }}>
          Développeur passionné avec une expertise en technologies modernes. 
          Spécialisé dans la création d'applications web performantes et intuitives.
        </p>
      </div>
    </header>
  );
};

export default Header;
