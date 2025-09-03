# Configuration Directus sur Hostinger

## 1. Créer un sous-domaine

- **Nom** : `api.jordan-matias.fr`
- **Document Root** : `/public_html/api/`

## 2. Activer Node.js

- Dans hPanel → Node.js
- **Version** : Node.js 18 ou 20
- **Application Root** : `/public_html/api/`
- **Startup File** : `server.js`

## 3. Base de données MySQL

- **Nom** : `directus_cv`
- **Utilisateur** : `directus_user`
- **Mot de passe** : `votre_mot_de_passe`
- **Host** : `localhost`

## 4. Variables d'environnement

```env
DB_CLIENT=mysql2
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=directus_cv
DB_USER=directus_user
DB_PASSWORD=votre_mot_de_passe

KEY=your-secret-key-here
SECRET=your-secret-here
PUBLIC_URL=https://api.jordan-matias.fr
CORS_ENABLED=true
CORS_ORIGIN=true
ADMIN_EMAIL=admin@jordan-matias.fr
ADMIN_PASSWORD=your-admin-password
```

## 5. Structure des fichiers

```
public_html/
├── cv/                    ← Votre CV React
│   ├── index.html
│   ├── static/
│   └── ...
└── api/                   ← Directus
    ├── package.json
    ├── node_modules/
    ├── .env
    └── ...
```
