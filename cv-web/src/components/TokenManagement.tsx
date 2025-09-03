import React, { useEffect, useState } from 'react';
import { directusService, Acces } from '../services/directus';

const TokenManagement: React.FC = () => {
  const [tokens, setTokens] = useState<Acces[]>([]);
  const [loading, setLoading] = useState(true);
  const [newToken, setNewToken] = useState({
    candidateEmail: '',
    companyName: '',
    daysValid: 7
  });
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    try {
      const tokensData = await directusService.getAllTokens();
      setTokens(tokensData);
    } catch (error) {
      console.error('Erreur lors du chargement des tokens:', error);
    } finally {
      setLoading(false);
    }
  };

  const createToken = async () => {
    if (!newToken.candidateEmail || !newToken.companyName) {
      window.alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const token = await directusService.createAccessToken(
        newToken.candidateEmail,
        newToken.companyName,
        newToken.daysValid
      );
      
      setTokens([token, ...tokens]);
      setNewToken({ candidateEmail: '', companyName: '', daysValid: 7 });
      setShowCreateForm(false);
      
      // Générer le lien d'accès
      const accessLink = `${window.location.origin}?token=${token.Token}`;
      
      // Copier le lien dans le presse-papiers
      try {
        await navigator.clipboard.writeText(accessLink);
        window.alert(`✅ Token créé avec succès !\n\nLien d'accès copié dans le presse-papiers :\n${accessLink}`);
      } catch (clipboardError) {
        window.alert(`✅ Token créé avec succès !\n\nLien d'accès :\n${accessLink}`);
      }
    } catch (error) {
      console.error('Erreur lors de la création du token:', error);
      window.alert('❌ Erreur lors de la création du token');
    }
  };

  const revokeToken = async (tokenId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir révoquer ce token ?')) {
      return;
    }

    try {
      await directusService.revokeToken(tokenId);
      setTokens(tokens.map(t => 
        t.id === tokenId ? { ...t, Statut: 'revoked' } : t
      ));
      window.alert('✅ Token révoqué avec succès');
    } catch (error) {
      console.error('Erreur lors de la révocation:', error);
      window.alert('❌ Erreur lors de la révocation du token');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'used': return '#f59e0b';
      case 'expired': return '#ef4444';
      case 'revoked': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'used': return 'Utilisé';
      case 'expired': return 'Expiré';
      case 'revoked': return 'Révoqué';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="token-management">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Chargement des tokens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="token-management">
      <div className="token-management-header">
        <h1>🔐 Gestion des accès CV</h1>
        <p>Créez et gérez les tokens d'accès pour partager votre CV de manière sécurisée.</p>
      </div>
      
      <div className="token-actions">
        <button 
          className="create-token-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? '❌ Annuler' : '➕ Créer un nouvel accès'}
        </button>
      </div>

      {showCreateForm && (
        <div className="create-token-form">
          <h2>Créer un nouvel accès</h2>
          <div className="form-group">
            <label>Email du recruteur *</label>
            <input
              type="email"
              placeholder="recruteur@entreprise.com"
              value={newToken.candidateEmail}
              onChange={(e) => setNewToken({...newToken, candidateEmail: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Nom de l'entreprise *</label>
            <input
              type="text"
              placeholder="Nom de l'entreprise"
              value={newToken.companyName}
              onChange={(e) => setNewToken({...newToken, companyName: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Durée de validité (jours)</label>
            <input
              type="number"
              min="1"
              max="365"
              value={newToken.daysValid}
              onChange={(e) => setNewToken({...newToken, daysValid: parseInt(e.target.value) || 7})}
            />
          </div>
          <div className="form-actions">
            <button onClick={createToken} className="submit-btn">
              🚀 Créer l'accès
            </button>
          </div>
        </div>
      )}

      <div className="tokens-list">
        <h2>📋 Tokens existants ({tokens.length})</h2>
        {tokens.length === 0 ? (
          <div className="empty-state">
            <p>Aucun token créé pour le moment.</p>
          </div>
        ) : (
          <div className="tokens-grid">
            {tokens.map(token => (
              <div key={token.id} className="token-card">
                <div className="token-header">
                  <h3>{token.Nom_Entreprise}</h3>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(token.Statut) }}
                  >
                    {getStatusText(token.Statut)}
                  </span>
                </div>
                
                <div className="token-details">
                  <p><strong>📧 Email:</strong> {token.Email_Entreprise}</p>
                  <p><strong>📅 Créé:</strong> {new Date(token.date_created || '').toLocaleDateString('fr-FR')}</p>
                  <p><strong>⏰ Expire:</strong> {new Date(token.Date_Expire).toLocaleDateString('fr-FR')}</p>
                  <p><strong>📊 Accès:</strong> {token.Nombre_de_visite || 0} fois</p>
                  {token.Derniere_visite && (
                    <p><strong>🕒 Dernier accès:</strong> {new Date(token.Derniere_visite).toLocaleString('fr-FR')}</p>
                  )}
                </div>

                <div className="token-actions">
                  {token.Statut === 'active' && (
                    <button 
                      onClick={() => revokeToken(token.id)}
                      className="revoke-btn"
                    >
                      🚫 Révoquer
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      const link = `${window.location.origin}?token=${token.Token}`;
                      navigator.clipboard.writeText(link);
                      window.alert('Lien copié dans le presse-papiers !');
                    }}
                    className="copy-link-btn"
                  >
                    📋 Copier le lien
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenManagement;
