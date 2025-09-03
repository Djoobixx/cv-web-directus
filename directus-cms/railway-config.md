# Configuration Railway pour Directus

## Variables d'environnement à configurer dans Railway :

```env
# Base de données MySQL (Railway fournira ces valeurs)
DB_CLIENT=mysql2
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}

# Configuration Directus
KEY=your-secret-key-here
SECRET=your-secret-here

# URLs
PUBLIC_URL=https://api.jordan-matias.fr
CORS_ENABLED=true
CORS_ORIGIN=true

# Admin
ADMIN_EMAIL=admin@jordan-matias.fr
ADMIN_PASSWORD=your-admin-password
```

## Étapes de déploiement :

1. **Créer un compte Railway** : railway.app
2. **Connecter GitHub** et sélectionner votre repository
3. **Ajouter une base de données MySQL** dans Railway
4. **Configurer les variables d'environnement** ci-dessus
5. **Déployer** le projet

## Migration des données :

1. **Exporter** : `mysqldump -u root -p directus_cv > directus-backup.sql`
2. **Importer** dans Railway MySQL via l'interface ou CLI
