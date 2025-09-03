import React from 'react';
import IconWrapper from './IconWrapper';

// Import des icônes personnalisées
import profileIcon from '../assets/icons/profile-custom.svg';
import experienceIcon from '../assets/icons/experience-custom.svg';
import skillsIcon from '../assets/icons/skills-custom.svg';

interface FloatingNavBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const FloatingNavBar: React.FC<FloatingNavBarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'profil', label: 'Profil', icon: profileIcon },
    { id: 'experiences', label: 'Expériences', icon: experienceIcon },
    { id: 'competences', label: 'Compétences', icon: skillsIcon },
  ];

  return (
    <div className="floating-navbar">
      <div className="navbar-content">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="tab-icon">
              <img src={tab.icon} alt={tab.label} className="custom-icon" />
            </span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FloatingNavBar;
