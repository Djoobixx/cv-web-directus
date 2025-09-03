import axios from 'axios';

// Configuration de base pour les appels API
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.jordan-matias.fr' 
  : 'http://localhost:8055';
const AUTH_TOKEN = 'LXfHL-ddg5zwMJJocdk7O9d0TYKmv2w9';

// Configuration axios avec token d'authentification
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Types pour vos collections Directus
export interface Entreprise {
  id: number;
  Nom: string;
  Description: string;
  Position: string | any;  // Peut être string ou objet géographique
  Logotype?: string;       // Logo optionnel
  Secteur?: string | any;  // Secteur d'activité - peut être string ou objet
}

export interface Emploi {
  id: number;
  Poste: string;
  Type: string;
  status: string;
  Entreprise?: Entreprise;  // ✅ Nom correct selon MySQL
  Debut?: string;
  Fin?: string;
  Description?: string;     // ✅ Champ manquant ajouté
}

export interface Langue {
  id: number;
  Langue: string;
  Niveau: string;
}

export interface Logiciel {
  id: number;
  Nom: string;           // ✅ Nom correct selon MySQL
  Niveau: number;        // ✅ Niveau numérique (1-5)
  Secteur: string[];     // ✅ Array JSON des secteurs
  Icones?: string;       // ✅ ID de l'icône (optionnel)
}

export interface Permis {
  id: number;
  Type: string;          // Ex: "Permis B", "Formation A1" 
  Obtention?: string;    // Date d'obtention
  date_created?: string;
  date_updated?: string;
}

export interface Profil {
  id: number;
  Nom: string;
  Prenom: string;
  Poste?: string;              // Type de poste recherché
  Resume?: string;             // Résumé/présentation personnelle
  Adresse?: string;            // Adresse postale
  Photo_de_profil?: string;    // ID du fichier photo
  Mail?: string;               // Email
  Telephone?: string;
  Site_web?: string;           // Site web (attention à la casse)
  Date_de_naissance?: string;  // Date de naissance
  
  // Flags de visibilité (boolean dans MySQL = tinyint)
  View_naissance?: boolean;    // Afficher date de naissance
  View_adresse?: boolean;      // Afficher adresse
  View_mail?: boolean;         // Afficher email
  View_telephone?: boolean;    // Afficher téléphone
  View_site_web?: boolean;     // Afficher site web
  
  // Relations (pour plus tard si besoin)
  Permis?: Permis[];           // Relation avec la collection Permis
}

export interface Acces {
  id: number;
  Token: string;
  Email_Entreprise: string;
  Nom_Entreprise: string;
  date_created?: string;
  Date_Expire: string;
  Visiter: boolean;
  Nombre_de_visite?: number;
  Derniere_visite?: string;
  Statut: 'active' | 'used' | 'expired' | 'revoked';
}

// Services pour récupérer les données
export const directusService = {
  // Récupérer toutes les entreprises
  getEntreprises: async (): Promise<Entreprise[]> => {
    try {
      const response = await apiClient.get('/items/Entreprises');
      return response.data.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des entreprises:', error);
      return [];
    }
  },

  // Récupérer tous les emplois avec leurs entreprises
  getEmplois: async (): Promise<Emploi[]> => {
    try {
      const response = await apiClient.get('/items/Emplois?fields=*,Entreprise.*');
      return response.data.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des emplois:', error);
      return [];
    }
  },

  // Récupérer toutes les langues
  getLangues: async (): Promise<Langue[]> => {
    try {
      const response = await apiClient.get('/items/Langues');
      return response.data.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des langues:', error);
      return [];
    }
  },

  // Récupérer tous les logiciels
  getLogiciels: async (): Promise<Logiciel[]> => {
    try {
      const response = await apiClient.get('/items/Logiciels');
      return response.data.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des logiciels:', error);
      return [];
    }
  },

  // Récupérer le profil (Singleton)
  getProfil: async (): Promise<Profil | null> => {
    try {
      const response = await apiClient.get('/items/Profil');
      console.log('Réponse API Profil:', response.data);
      
      // Pour une collection normale, Directus retourne un array
      const profilData = response.data.data;
      if (Array.isArray(profilData) && profilData.length > 0) {
        return profilData[0]; // Prendre le premier élément
      } else if (profilData && !Array.isArray(profilData)) {
        return profilData; // Si c'est directement un objet (Singleton)
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      // Type guard pour axios error
      if (error && typeof error === 'object' && 'response' in error) {
        console.error('Détails de l\'erreur:', (error as any).response?.data);
      }
      return null;
    }
  },

  // Récupérer tous les permis
  getPermis: async (): Promise<Permis[]> => {
    try {
      const response = await apiClient.get('/items/Permis');
      return response.data.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des permis:', error);
      return [];
    }
  },

  // Récupérer les assets (images)
  getAssetUrl: (fileId: string): string => {
    return `${API_BASE_URL}/assets/${fileId}`;
  },

  // === GESTION DES TOKENS D'ACCÈS ===
  
  // Créer un nouveau token d'accès
  createAccessToken: async (candidateEmail: string, companyName: string, daysValid: number = 7): Promise<Acces> => {
    try {
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + daysValid);

      const response = await apiClient.post('/items/Acces', {
        Token: token,
        Email_Entreprise: candidateEmail,
        Nom_Entreprise: companyName,
        Date_Expire: expiresAt.toISOString(),
        Visiter: false,
        Nombre_de_visite: 0,
        Statut: 'active'
      });

      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la création du token:', error);
      throw error;
    }
  },

  // Vérifier un token
  verifyAccessToken: async (token: string): Promise<{ valid: boolean; tokenData?: Acces; reason?: string }> => {
    try {
      const response = await apiClient.get('/items/Acces', {
        params: {
          filter: {
            Token: { _eq: token }
          }
        }
      });

      const tokens = response.data.data;
      
      if (!tokens || tokens.length === 0) {
        return { valid: false, reason: 'Token introuvable' };
      }

      const tokenData = tokens[0];

      if (tokenData.Statut === 'revoked') {
        return { valid: false, reason: 'Token révoqué' };
      }

      if (new Date() > new Date(tokenData.Date_Expire)) {
        // Marquer comme expiré
        await directusService.updateTokenStatus(tokenData.id, 'expired');
        return { valid: false, reason: 'Token expiré' };
      }

      // Si c'est la première visite, marquer comme "used" pour le suivi
      if (tokenData.Statut === 'active') {
        await directusService.updateTokenStatus(tokenData.id, 'used');
      }

      // Incrémenter le compteur d'accès et mettre à jour la dernière visite
      await directusService.incrementAccessCount(tokenData.id);

        return { valid: true, tokenData };
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      return { valid: false, reason: 'Erreur de vérification' };
    }
  },

  // Mettre à jour le statut d'un token
  updateTokenStatus: async (tokenId: number, status: string): Promise<void> => {
    try {
      await apiClient.patch(`/items/Acces/${tokenId}`, {
        Statut: status,
        Derniere_visite: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  },

  // Incrémenter le compteur d'accès
  incrementAccessCount: async (tokenId: number): Promise<void> => {
    try {
      const response = await apiClient.get(`/items/Acces/${tokenId}`);
      const currentCount = response.data.data.Nombre_de_visite || 0;
      
      await apiClient.patch(`/items/Acces/${tokenId}`, {
        Nombre_de_visite: currentCount + 1,
        Derniere_visite: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erreur lors de l\'incrémentation du compteur:', error);
    }
  },

  // Récupérer tous les tokens (pour l'administration)
  getAllTokens: async (): Promise<Acces[]> => {
    try {
      const response = await apiClient.get('/items/Acces', {
        params: {
          sort: ['-created_at']
        }
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des tokens:', error);
      return [];
    }
  },

  // Révoquer un token
  revokeToken: async (tokenId: number): Promise<void> => {
    try {
      await apiClient.patch(`/items/Acces/${tokenId}`, {
        Statut: 'revoked'
      });
    } catch (error) {
      console.error('Erreur lors de la révocation du token:', error);
    }
  }
};
