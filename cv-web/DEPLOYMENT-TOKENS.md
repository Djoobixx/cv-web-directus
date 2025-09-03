# 🚀 Déploiement CV avec système de tokens

## ✅ Fichiers prêts

- [x] CV avec protection par tokens
- [x] Build créé : `build/`
- [x] Export base de données : `directus-backup.sql`
- [x] Configuration Directus : `directus-cms/`

## 🎯 Plan de déploiement

### **Étape 1 : Déployer le CV (Hostinger)**

1. **Uploadez** le contenu de `build/` dans `public_html/`
2. **URL** : `https://jordan-matias.fr`
3. **Résultat** : Page "Accès refusé" (normal, pas de token)

### **Étape 2 : Déployer Directus (Railway - Gratuit)**

1. **Allez sur** : `railway.app`
2. **Connectez-vous** avec GitHub
3. **Déployez** Directus depuis GitHub
4. **URL** : `https://api.jordan-matias.fr`

### **Étape 3 : Configuration finale**

1. **Modifiez** l'URL API dans le code
2. **Testez** la création de tokens
3. **Envoyez** des liens avec tokens aux recruteurs

## 🔐 Workflow avec tokens

### **Pour vous (créer un token) :**

1. **Allez sur** : `https://api.jordan-matias.fr/admin`
2. **Créez** un token pour un recruteur
3. **Copiez** le lien généré
4. **Envoyez** le lien au recruteur

### **Pour le recruteur :**

1. **Reçoit** le lien : `https://jordan-matias.fr?token=abc123`
2. **Clique** sur le lien
3. **Voit** votre CV complet
4. **Vous** savez qu'il a consulté

## 📊 Avantages

- ✅ **Contrôle total** : Qui peut voir votre CV
- ✅ **Traçabilité** : Statistiques de consultation
- ✅ **Professionnalisme** : Impression positive
- ✅ **Sécurité** : Impossible de partager sans permission

## 🌐 URLs finales

- **CV** : `https://jordan-matias.fr`
- **Admin** : `https://api.jordan-matias.fr/admin`
- **Avec token** : `https://jordan-matias.fr?token=abc123`
