#!/bin/bash

# Script de déploiement Directus sur VPS
# À exécuter dans le dossier de votre application

echo "🚀 Déploiement de Directus sur VPS..."

# Créer le dossier de l'application
sudo mkdir -p /var/www/directus
sudo chown -R $USER:$USER /var/www/directus

# Aller dans le dossier
cd /var/www/directus

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp vps-env.txt .env

# Importer la base de données
mysql -u directus_user -p directus_cv < directus-backup.sql

# Démarrer avec PM2
pm2 start server.js --name "directus-api"

# Sauvegarder la configuration PM2
pm2 save

# Configurer PM2 pour démarrer au boot
pm2 startup

echo "✅ Déploiement terminé !"
echo "🌐 Votre API est disponible sur : https://api.jordan-matias.fr"
echo "📊 Gérer avec : pm2 status, pm2 logs, pm2 restart"
