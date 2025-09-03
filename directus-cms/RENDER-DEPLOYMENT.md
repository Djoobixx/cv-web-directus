# 🚀 Déploiement Directus sur Render (GRATUIT)

## 📋 **Étapes de déploiement**

### **1. Créer un compte Render**

1. **Allez sur** : [render.com](https://render.com)
2. **Inscrivez-vous** avec GitHub (recommandé)
3. **Connectez votre repository** GitHub

### **2. Créer la base de données PostgreSQL**

1. **Dashboard Render** → **New** → **PostgreSQL**
2. **Nom** : `directus-db`
3. **Plan** : **Free** (gratuit)
4. **Database Name** : `directus_cv`
5. **Cliquez** : **Create Database**

### **3. Déployer Directus**

1. **Dashboard Render** → **New** → **Web Service**
2. **Connect Repository** : Sélectionnez votre repo
3. **Root Directory** : `directus-cms`
4. **Environment** : `Node`
5. **Build Command** : `npm install`
6. **Start Command** : `npx directus start`
7. **Plan** : **Free**

### **4. Configuration des variables d'environnement**

Dans **Environment Variables** de votre service web :

```env
DB_CLIENT=postgres
DB_HOST=[HOST_DE_VOTRE_DB]
DB_PORT=[PORT_DE_VOTRE_DB]
DB_DATABASE=directus_cv
DB_USER=[USER_DE_VOTRE_DB]
DB_PASSWORD=[PASSWORD_DE_VOTRE_DB]

KEY=your-secret-key-here-32-chars
SECRET=your-secret-here-32-chars
PUBLIC_URL=https://votre-app.onrender.com
CORS_ENABLED=true
CORS_ORIGIN=true
ADMIN_EMAIL=admin@jordan-matias.fr
ADMIN_PASSWORD=your-admin-password
NODE_ENV=production
```

### **5. Migration des données MySQL vers PostgreSQL**

#### **A. Exporter depuis MySQL**

```bash
mysqldump -u root -p directus_cv > directus-backup.sql
```

#### **B. Convertir pour PostgreSQL**

1. **Installez** : `npm install -g mysql-to-postgres`
2. **Convertissez** :

```bash
mysql-to-postgres directus-backup.sql > directus-postgres.sql
```

#### **C. Importer dans PostgreSQL**

```bash
psql -h [HOST] -U [USER] -d directus_cv < directus-postgres.sql
```

### **6. Configuration du domaine personnalisé**

1. **Settings** → **Custom Domains**
2. **Ajoutez** : `api.jordan-matias.fr`
3. **Configurez** le DNS chez votre registrar :
   ```
   Type: CNAME
   Name: api
   Value: votre-app.onrender.com
   ```

## 🎯 **Avantages Render**

- ✅ **Gratuit** pour les petits projets
- ✅ **PostgreSQL** inclus
- ✅ **SSL automatique**
- ✅ **Déploiement automatique** depuis GitHub
- ✅ **Logs en temps réel**
- ✅ **Redémarrage automatique**

## ⚠️ **Limitations du plan gratuit**

- **Sleep** après 15 min d'inactivité
- **Limite** de 750h/mois
- **Pas de** domaine personnalisé (sauf avec upgrade)

## 🔧 **Alternative : Railway (aussi gratuit)**

Si Render ne vous convient pas, Railway offre :

- **Pas de sleep**
- **Domaine personnalisé** gratuit
- **PostgreSQL** gratuit

**Voulez-vous que je vous guide pour Railway à la place ?** 🚀
