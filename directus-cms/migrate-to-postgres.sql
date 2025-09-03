-- Script de migration MySQL vers PostgreSQL
-- À exécuter après avoir importé les données MySQL dans PostgreSQL

-- Conversion des types de données MySQL vers PostgreSQL
-- (Railway peut gérer cela automatiquement, mais au cas où)

-- Exemple de conversions courantes :
-- TINYINT(1) -> BOOLEAN
-- DATETIME -> TIMESTAMP
-- LONGTEXT -> TEXT
-- etc.

-- Note: Railway gère généralement ces conversions automatiquement
-- lors de l'import d'un dump MySQL dans PostgreSQL
