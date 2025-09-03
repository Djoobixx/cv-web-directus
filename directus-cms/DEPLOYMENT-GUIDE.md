# Guide de déploiement Hostinger

## ✅ Étapes terminées

- [x] Base de données créée : `u613084889_directus`
- [x] Export des données : `directus-backup.sql`
- [x] Package créé : `directus-hostinger.tar.gz`

## 🚀 Étapes de déploiement

### 1. Créer le sous-domaine

- **hPanel** → Domaines → Gérer
- **Créer** : `api.jordan-matias.fr`
- **Document Root** : `/public_html/api/`

### 2. Activer Node.js

- **hPanel** → Node.js
- **Version** : Node.js 18 ou 20
- **Application Root** : `/public_html/api/`
- **Startup File** : `server.js`

### 3. Importer la base de données

- **hPanel** → phpMyAdmin
- **Sélectionner** : `u613084889_directus`
- **Importer** : `directus-backup.sql`

### 4. Uploader Directus

- **Extraire** : `directus-hostinger.tar.gz` dans `/public_html/api/`
- **Renommer** : `hostinger-env.txt` → `.env`
- **Modifier** : Mot de passe dans `.env`

### 5. Installer les dépendances

- **Terminal Hostinger** ou **SSH**
- **Commande** : `npm install`

### 6. Démarrer l'application

- **Node.js** se lancera automatiquement
- **URL** : `https://api.jordan-matias.fr`

## 🔧 Configuration finale

### Variables d'environnement (.env)

```env
DB_CLIENT=mysql2
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=u613084889_directus
DB_USER=u613084889_directus
DB_PASSWORD=votre_mot_de_passe_hostinger

KEY=your-secret-key-here
SECRET=your-secret-here
PUBLIC_URL=https://api.jordan-matias.fr
CORS_ENABLED=true
CORS_ORIGIN=true
ADMIN_EMAIL=admin@jordan-matias.fr
ADMIN_PASSWORD=your-admin-password
PORT=3000
```

## 📁 Structure finale

```
public_html/
├── cv/                    ← Votre CV React
└── api/                   ← Directus
    ├── server.js
    ├── package.json
    ├── .env
    └── ...
```

## 🌐 URLs finales

- **CV** : `https://jordan-matias.fr`
- **API** : `https://api.jordan-matias.fr`
- **Admin** : `https://api.jordan-matias.fr/admin`
