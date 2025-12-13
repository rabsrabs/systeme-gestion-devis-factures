# 📦 INSTALLATION COMPLÈTE - TOUTES LES PAGES FRONTEND

## ✅ Le ZIP contient maintenant 32 fichiers !

J'ai ajouté **TOUTES les pages frontend** qui manquaient !

---

## 📥 Étape 1 : Télécharger le ZIP

Téléchargez le fichier **projet-omc-complet.zip**

---

## 📂 Étape 2 : Où copier les fichiers

### 🎨 **FRONTEND** (dossier `frontend/src/`)

| Fichier téléchargé | Où le copier |
|-------------------|--------------|
| `App.js` | `frontend/src/App.js` |
| `App.css` | `frontend/src/App.css` |
| `Login.js` | `frontend/src/pages/Login.js` |
| `Login.css` | `frontend/src/styles/Login.css` |
| `Dashboard.js` | `frontend/src/pages/Dashboard.js` |
| `Dashboard.css` | `frontend/src/styles/Dashboard.css` |
| `Clients.js` | `frontend/src/pages/Clients.js` |
| `DevisPage.js` | `frontend/src/pages/Devis.js` ⚠️ **Renommer!** |
| `Factures.js` | `frontend/src/pages/Factures.js` |
| `Prestations.js` | `frontend/src/pages/Prestations.js` |
| `Layout.js` | `frontend/src/components/Layout.js` |
| `Layout.css` | `frontend/src/styles/Layout.css` |
| `Pages.css` | `frontend/src/styles/Pages.css` |
| `frontend-package.json` | `frontend/package.json` ⚠️ **Renommer!** |

### ⚙️ **BACKEND** (dossier `backend/`)

| Fichier téléchargé | Où le copier |
|-------------------|--------------|
| `backend-package.json` | `backend/package.json` ⚠️ **Renommer!** |
| `backend.env.example` | `backend/.env` ⚠️ **Renommer et modifier!** |
| `database.js` | `backend/src/config/database.js` |
| `auth.middleware.js` | `backend/src/middleware/auth.middleware.js` |
| `auth.controller.js` | `backend/src/controllers/auth.controller.js` |
| `devis.controller.js` | `backend/src/controllers/devis.controller.js` |
| `devis.routes.js` | `backend/src/routes/devis.routes.js` |
| `Client.js` | `backend/src/models/Client.js` |
| `Utilisateur.js` | `backend/src/models/Utilisateur.js` |
| `Devis.js` | `backend/src/models/Devis.js` |
| `Facture.js` | `backend/src/models/Facture.js` |
| `PrestationService.js` | `backend/src/models/PrestationService.js` |
| `LigneDevis.js` | `backend/src/models/LigneDevis.js` |

### 🗄️ **BASE DE DONNÉES**

| Fichier téléchargé | Où le copier |
|-------------------|--------------|
| `database-schema.sql` | `database/schema.sql` |

---

## 🚀 Étape 3 : Commandes d'installation

```bash
cd ~/Desktop/PRJ_BD_24_25_Groupe2délégué

# Créer les dossiers manquants
mkdir -p backend/src/controllers
mkdir -p backend/src/middleware
mkdir -p frontend/src/components
mkdir -p frontend/src/styles
mkdir -p database

# Décompresser le ZIP dans Downloads
cd ~/Downloads
unzip projet-omc-complet.zip -d omc-files

# Copier les fichiers BACKEND
cd ~/Desktop/PRJ_BD_24_25_Groupe2délégué
cp ~/Downloads/omc-files/backend-package.json backend/package.json
cp ~/Downloads/omc-files/backend.env.example backend/.env
cp ~/Downloads/omc-files/database.js backend/src/config/
cp ~/Downloads/omc-files/auth.middleware.js backend/src/middleware/
cp ~/Downloads/omc-files/auth.controller.js backend/src/controllers/
cp ~/Downloads/omc-files/devis.controller.js backend/src/controllers/
cp ~/Downloads/omc-files/devis.routes.js backend/src/routes/
cp ~/Downloads/omc-files/Client.js backend/src/models/
cp ~/Downloads/omc-files/Utilisateur.js backend/src/models/
cp ~/Downloads/omc-files/Devis.js backend/src/models/
cp ~/Downloads/omc-files/Facture.js backend/src/models/
cp ~/Downloads/omc-files/PrestationService.js backend/src/models/
cp ~/Downloads/omc-files/LigneDevis.js backend/src/models/

# Copier les fichiers FRONTEND
cp ~/Downloads/omc-files/frontend-package.json frontend/package.json
cp ~/Downloads/omc-files/App.js frontend/src/
cp ~/Downloads/omc-files/App.css frontend/src/
cp ~/Downloads/omc-files/Login.js frontend/src/pages/
cp ~/Downloads/omc-files/Dashboard.js frontend/src/pages/
cp ~/Downloads/omc-files/DevisPage.js frontend/src/pages/Devis.js
cp ~/Downloads/omc-files/Factures.js frontend/src/pages/
cp ~/Downloads/omc-files/Prestations.js frontend/src/pages/
cp ~/Downloads/omc-files/Clients.js frontend/src/pages/
cp ~/Downloads/omc-files/Layout.js frontend/src/components/
cp ~/Downloads/omc-files/Login.css frontend/src/styles/
cp ~/Downloads/omc-files/Dashboard.css frontend/src/styles/
cp ~/Downloads/omc-files/Layout.css frontend/src/styles/
cp ~/Downloads/omc-files/Pages.css frontend/src/styles/

# Copier la base de données
cp ~/Downloads/omc-files/database-schema.sql database/schema.sql
```

---

## ⚙️ Étape 4 : Configurer le .env

```bash
cd backend
nano .env

# Modifiez ces lignes avec VOS identifiants PostgreSQL :
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
```

---

## 🗄️ Étape 5 : Créer la base de données

```bash
createdb omc_db
psql omc_db < database/schema.sql
```

---

## 📦 Étape 6 : Installer les dépendances

```bash
# Backend
cd backend
npm install

# Frontend (nouveau terminal)
cd ../frontend
npm install
```

---

## 🚀 Étape 7 : Lancer l'application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

---

## 🎯 Étape 8 : Se connecter

1. Allez sur **http://localhost:3000**
2. Vous verrez la page de **LOGIN** ! 🎉
3. Inscrivez-vous en tant qu'admin ou client

---

## ✅ Pages disponibles

Une fois connecté :

- **📊 Dashboard** - Tableau de bord avec statistiques (vue Admin vs Client)
- **👥 Clients** - Gestion des clients (Admin only)
- **📝 Devis** - Gestion des devis avec statuts et conversion en facture
- **💰 Factures** - Suivi des factures
- **🔧 Prestations** - Gestion des prestations avec catégories et sous-catégories

---

## 🎉 C'EST TERMINÉ !

Votre projet répond maintenant à **TOUTES les exigences** :

✅ Design responsive  
✅ Catégories et sous-catégories  
✅ Statuts des devis  
✅ Conversion devis → facture  
✅ Modification des devis  
✅ Interface personnalisable  
✅ Vue Admin vs Client  
✅ API sécurisée  

---

**Bonne présentation ! 🚀**
