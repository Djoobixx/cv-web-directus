import React from 'react';
import { 
  // Navigation et interface
  HiUser, HiBriefcase, HiStar, HiCode, HiClock, HiTranslate,
  // Contact et social
  HiMail, HiPhone, HiLocationMarker, HiGlobeAlt,
  // Compétences techniques
  HiDesktopComputer, HiDatabase, HiChip, HiCloud,
  // Documents et liens
  HiDocumentDownload, HiExternalLink, HiEye,
  // Status et états
  HiCheckCircle, HiExclamationCircle, HiInformationCircle
} from 'react-icons/hi';
import IconWrapper from './IconWrapper';

// Composant de démonstration des icônes disponibles
const IconShowcase: React.FC = () => {
  const iconCategories = [
    {
      title: 'Navigation',
      icons: [
        { component: HiUser, name: 'Profil', usage: 'Navigation vers profil' },
        { component: HiBriefcase, name: 'Expériences', usage: 'Navigation vers expériences' },
        { component: HiStar, name: 'Compétences', usage: 'Navigation vers compétences' }
      ]
    },
    {
      title: 'Sections du CV',
      icons: [
        { component: HiCode, name: 'Code', usage: 'Compétences techniques' },
        { component: HiClock, name: 'Temps', usage: 'Expérience professionnelle' },
        { component: HiTranslate, name: 'Langues', usage: 'Section langues' }
      ]
    },
    {
      title: 'Contact et Localisation',
      icons: [
        { component: HiMail, name: 'Email', usage: 'Adresse email' },
        { component: HiPhone, name: 'Téléphone', usage: 'Numéro de téléphone' },
        { component: HiLocationMarker, name: 'Localisation', usage: 'Adresse physique' },
        { component: HiGlobeAlt, name: 'Site web', usage: 'Site personnel ou portfolio' }
      ]
    },
    {
      title: 'Compétences Techniques',
      icons: [
        { component: HiDesktopComputer, name: 'Ordinateur', usage: 'Développement frontend' },
        { component: HiDatabase, name: 'Base de données', usage: 'Backend et BDD' },
        { component: HiChip, name: 'Processeur', usage: 'Intelligence artificielle' },
        { component: HiCloud, name: 'Cloud', usage: 'Services cloud' }
      ]
    },
    {
      title: 'Actions et États',
      icons: [
        { component: HiDocumentDownload, name: 'Télécharger', usage: 'Télécharger PDF du CV' },
        { component: HiExternalLink, name: 'Lien externe', usage: 'Liens vers projets' },
        { component: HiEye, name: 'Voir', usage: 'Voir les détails' },
        { component: HiCheckCircle, name: 'Validé', usage: 'Compétence maîtrisée' },
        { component: HiExclamationCircle, name: 'Attention', usage: 'Information importante' },
        { component: HiInformationCircle, name: 'Info', usage: 'Information complémentaire' }
      ]
    }
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1024px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#1f2937' }}>
        Guide des Icônes React Icons
      </h1>
      
      {iconCategories.map((category) => (
        <div key={category.title} style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#2563eb',
            borderBottom: '2px solid #e5e7eb',
            paddingBottom: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            {category.title}
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1rem'
          }}>
            {category.icons.map((icon) => {
              const IconComponent = icon.component;
              return (
                <div 
                  key={icon.name}
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    backgroundColor: '#f9fafb'
                  }}
                >
                  <IconWrapper IconComponent={IconComponent} size={24} color="#2563eb" />
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0, color: '#1f2937' }}>
                      {icon.name}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                      {icon.usage}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      <div style={{ 
        marginTop: '3rem', 
        padding: '1.5rem',
        backgroundColor: '#dbeafe',
        borderRadius: '0.75rem',
        border: '1px solid #93c5fd'
      }}>
        <h3 style={{ color: '#1e40af', marginBottom: '1rem' }}>💡 Comment utiliser ces icônes</h3>
        <ol style={{ color: '#1e40af', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
          <li>Importez les icônes depuis 'react-icons/hi'</li>
          <li>Utilisez-les comme des composants React classiques</li>
          <li>Personnalisez la taille avec la prop 'size'</li>
          <li>Changez la couleur avec la prop 'color' ou via CSS</li>
          <li>Ajoutez des classes CSS pour des animations</li>
        </ol>
        
        <pre style={{ 
          backgroundColor: '#1e293b',
          color: '#e2e8f0',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginTop: '1rem',
          overflow: 'auto'
        }}>
{`import { HiMail, HiPhone } from 'react-icons/hi';

// Usage basique
<HiMail />

// Avec personnalisation
<HiMail size={24} color="#2563eb" />

// Avec className pour animations
<HiMail className="hover:scale-110" />`}
        </pre>
      </div>
    </div>
  );
};

export default IconShowcase;
