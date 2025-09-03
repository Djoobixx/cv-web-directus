import React, { useEffect, useState } from 'react';
import { directusService, Entreprise, Emploi, Langue, Logiciel, Profil, Permis } from '../services/directus';
import Header from '../components/Header';
import FloatingNavBar from '../components/FloatingNavBar';
import ProfilePage from './pages/ProfilePage';
import ExperiencePage from './pages/ExperiencePage';
import CompetencesPage from './pages/CompetencesPage';

const CV: React.FC = () => {
  const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
  const [emplois, setEmplois] = useState<Emploi[]>([]);
  const [langues, setLangues] = useState<Langue[]>([]);
  const [logiciels, setLogiciels] = useState<Logiciel[]>([]);
  const [profil, setProfil] = useState<Profil | null>(null);
  const [permis, setPermis] = useState<Permis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profil');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [entreprisesData, emploisData, languesData, logicielsData, profilData, permisData] = await Promise.all([
          directusService.getEntreprises(),
          directusService.getEmplois(),
          directusService.getLangues(),
          directusService.getLogiciels(),
          directusService.getProfil(),
          directusService.getPermis(),
        ]);

        setEntreprises(entreprisesData);
        setEmplois(emploisData);
        setLangues(languesData);
        setLogiciels(logicielsData);
        setProfil(profilData);
        setPermis(permisData);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div>Chargement du CV...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <div>{error}</div>
      </div>
    );
  }

  // Fonction pour rendre le contenu selon l'onglet actif
  const renderActiveContent = () => {
    switch (activeTab) {
      case 'profil':
        return <ProfilePage profileData={profil} permisData={permis} />;
      case 'experiences':
        return <ExperiencePage emplois={emplois} />;
      case 'competences':
        return <CompetencesPage logiciels={logiciels} langues={langues} />;
      default:
        return <ProfilePage profileData={profil} permisData={permis} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div className="container">
        
        {/* Navigation flottante */}
        <FloatingNavBar activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* Contenu principal */}
        <div className="main-content">
          {renderActiveContent()}
        </div>
      </div>
    </div>
  );
};

export default CV;
