import React, { useState } from 'react';
import TokenManagement from './TokenManagement';

const AdminLogin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Mot de passe administrateur (à changer en production)
  const ADMIN_PASSWORD = 'admin123'; // Changez ce mot de passe !

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Mot de passe incorrect');
      setPassword('');
    }
  };

  if (isAuthenticated) {
    return <TokenManagement />;
  }

  return (
    <div className="admin-login">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <h1>🔐 Administration</h1>
          <p>Accès réservé - Gestion des tokens d'accès</p>
        </div>

        <form className="admin-login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="password">Mot de passe administrateur</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez le mot de passe"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          <button type="submit" className="login-btn">
            🔑 Se connecter
          </button>
        </form>

        <div className="admin-login-footer">
          <p>Accès réservé à Jordan</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="back-btn"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
