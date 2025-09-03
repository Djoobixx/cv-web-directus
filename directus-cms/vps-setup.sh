#!/bin/bash

# Script d'installation pour VPS Hostinger
# À exécuter en SSH sur votre VPS

echo "🚀 Installation de Node.js sur VPS Hostinger..."

# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Node.js 20 (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier l'installation
node --version
npm --version

# Installer PM2 pour gérer les processus
sudo npm install -g pm2

# Installer MySQL (si pas déjà installé)
sudo apt install mysql-server -y

# Sécuriser MySQL
sudo mysql_secure_installation

echo "✅ Installation terminée !"
echo "📋 Prochaines étapes :"
echo "1. Créer la base de données MySQL"
echo "2. Uploader Directus"
echo "3. Configurer les variables d'environnement"
echo "4. Démarrer avec PM2"
