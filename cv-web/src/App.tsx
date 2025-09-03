import React from 'react';
import AccessGuard from './components/AccessGuard';
import CV from './components/CV';
import AdminLogin from './components/AdminLogin';
import ContactPage from './components/ContactPage';
import './styles/modern-cv.css';

function App() {
  const currentPath = window.location.pathname;
  
  // Vérifier les différentes routes
  if (currentPath === '/admin') {
    return (
      <div className="App">
        <AdminLogin />
      </div>
    );
  }
  
  if (currentPath === '/contact') {
    return (
      <div className="App">
        <ContactPage />
      </div>
    );
  }

  // Route par défaut (/) - Page d'accueil avec protection
  return (
    <div className="App">
      <AccessGuard>
        <CV />
      </AccessGuard>
    </div>
  );
}

export default App;
