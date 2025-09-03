import React, { useState } from 'react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Créer le lien mailto avec les informations
    const subject = encodeURIComponent('Demande d\'accès au CV - Jordan');
    const body = encodeURIComponent(`
Bonjour Jordan,

Je souhaite accéder à votre CV interactif.

Informations :
- Nom : ${formData.name}
- Email : ${formData.email}
- Entreprise : ${formData.company}
- Message : ${formData.message}

Cordialement
    `);
    
    const mailtoLink = `mailto:jordan@example.com?subject=${subject}&body=${body}`;
    window.open(mailtoLink);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1>Demande d'accès</h1>
          <p>Pour accéder à mon CV interactif, veuillez me contacter</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <h2>📧 Contactez-moi</h2>
            <p>Je vous enverrai un lien d'accès personnalisé dans les plus brefs délais.</p>
            
            <div className="contact-methods">
              <div className="contact-method">
                <strong>📧 Email :</strong> jordan@example.com
              </div>
              <div className="contact-method">
                <strong>📱 Téléphone :</strong> +33 6 XX XX XX XX
              </div>
              <div className="contact-method">
                <strong>💼 LinkedIn :</strong> linkedin.com/in/jordan
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <h3>Ou remplissez ce formulaire :</h3>
            
            <div className="form-group">
              <label htmlFor="name">Nom complet *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Votre nom complet"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email professionnel *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="votre.email@entreprise.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="company">Entreprise *</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                placeholder="Nom de votre entreprise"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message (optionnel)</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Dites-moi en quelques mots pourquoi vous souhaitez accéder à mon CV..."
              />
            </div>

            <button type="submit" className="submit-btn">
              📧 Envoyer la demande
            </button>
          </form>
        </div>

        <div className="contact-footer">
          <p>Je vous répondrai dans les 24h avec un lien d'accès personnalisé</p>
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

export default ContactPage;
