-- Configuration de la base de données sur VPS
-- À exécuter en MySQL

-- Créer la base de données
CREATE DATABASE directus_cv CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Créer un utilisateur pour Directus
CREATE USER 'directus_user'@'localhost' IDENTIFIED BY 'votre_mot_de_passe_fort';

-- Donner tous les privilèges
GRANT ALL PRIVILEGES ON directus_cv.* TO 'directus_user'@'localhost';

-- Appliquer les changements
FLUSH PRIVILEGES;

-- Vérifier
SHOW DATABASES;
SELECT User, Host FROM mysql.user WHERE User = 'directus_user';
