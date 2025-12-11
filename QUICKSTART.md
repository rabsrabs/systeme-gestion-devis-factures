# 🚀 Guide de Démarrage Rapide - Projet OMC

## Qu'est-ce que ce projet ?

**OMC** est un système complet de gestion des devis et factures pour une entreprise de prestations de service. Il permet de gérer l'ensemble du cycle commercial : clients, prestations, devis, factures, paiements et notifications.

## 📦 Contenu du projet

Le projet Git contient :

✅ **Backend Node.js/Express**
- API REST complète
- Authentification JWT
- 8 modèles de données (Sequelize ORM)
- Services métier organisés
- Middleware de sécurité

✅ **Frontend React**
- Interface utilisateur moderne
- Routing avec React Router
- Authentification
- Pages pour tous les modules

✅ **Base de données PostgreSQL**
- Schéma complet (11 tables)
- Migrations SQL
- Données de test (seeds)
- Vues et triggers

✅ **Documentation complète**
- MCD (Modèle Conceptuel de Données)
- MLD (Modèle Logique de Données)
- Diagrammes UML (cas d'utilisation, classes, séquences)
- Architecture système détaillée
- Guide de contribution

## 🎯 Démarrage en 5 minutes

### 1. Prérequis

```bash
# Vérifier Node.js (>= 18.x)
node --version

# Vérifier PostgreSQL (>= 14.x)
psql --version

# Vérifier npm
npm --version
```

### 2. Cloner le projet

```bash
git clone <url-du-repo>
cd omc-project
```

### 3. Configuration de la base de données

```bash
# Créer la base de données
createdb omc_db

# Ou via psql
psql -U postgres
CREATE DATABASE omc_db;
\q

# Exécuter les migrations
psql omc_db < database/migrations/001_initial_schema.sql

# Charger les données de test (optionnel)
psql omc_db < database/seeds/001_test_data.sql
```

### 4. Configuration du Backend

```bash
cd backend

# Installer les dépendances
npm install

# Copier et configurer les variables d'environnement
cp .env.example .env

# Éditer .env avec vos paramètres
nano .env
```

Configurer dans `.env` :
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=omc_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=change_this_secret_key_in_production
```

```bash
# Lancer le serveur backend
npm run dev
```

Le backend sera accessible sur `http://localhost:5000`

### 5. Configuration du Frontend

```bash
# Dans un nouveau terminal
cd frontend

# Installer les dépendances
npm install

# Lancer l'application
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 👤 Connexion de test

Si vous avez chargé les données de test :

```
Email: admin@omc.be
Mot de passe: password123
```

Autres utilisateurs disponibles :
- `jean.dupont@omc.be` (Gestionnaire)
- `marie.martin@omc.be` (Commercial)
- `pierre.leroy@omc.be` (Comptable)

## 📁 Structure du projet

```
omc-project/
├── backend/              # API Node.js/Express
│   ├── src/
│   │   ├── controllers/  # Contrôleurs
│   │   ├── services/     # Logique métier
│   │   ├── models/       # Modèles Sequelize
│   │   ├── routes/       # Routes API
│   │   ├── middleware/   # Middlewares
│   │   └── config/       # Configuration
│   ├── tests/            # Tests
│   └── package.json
│
├── frontend/             # Interface React
│   ├── public/
│   ├── src/
│   │   ├── components/   # Composants réutilisables
│   │   ├── pages/        # Pages
│   │   ├── services/     # Services API
│   │   ├── styles/       # CSS
│   │   └── utils/        # Utilitaires
│   └── package.json
│
├── database/             # Scripts SQL
│   ├── migrations/       # Migrations
│   └── seeds/            # Données de test
│
├── docs/                 # Documentation
│   ├── ARCHITECTURE.md   # Architecture détaillée
│   ├── EXIGENCES.docx    # Exigences fonctionnelles
│   ├── mcd/              # MCD (PDF)
│   ├── mld/              # MLD (PDF)
│   ├── architecture/     # Diagrammes architecture
│   └── uml/              # Diagrammes UML
│       ├── cas-utilisation.md
│       ├── diagramme-classes.md
│       └── sequence-creation-devis.md
│
├── README.md             # Documentation principale
├── CONTRIBUTING.md       # Guide de contribution
└── .gitignore
```

## 🔧 Commandes utiles

### Backend

```bash
# Développement avec auto-reload
npm run dev

# Production
npm start

# Tests
npm test

# Linter
npm run lint
```

### Frontend

```bash
# Développement
npm start

# Build production
npm run build

# Tests
npm test
```

### Base de données

```bash
# Se connecter à la BD
psql omc_db

# Lister les tables
\dt

# Voir le schéma d'une table
\d utilisateur

# Compter les enregistrements
SELECT COUNT(*) FROM devis;
```

## 📚 Fonctionnalités principales

### ✅ Gestion des utilisateurs
- Authentification JWT
- 4 rôles (Admin, Gestionnaire, Commercial, Comptable)
- Gestion des permissions

### ✅ Gestion des clients
- Informations complètes (société, TVA, adresses)
- Historique des devis et factures
- Recherche avancée

### ✅ Gestion des devis
- Création multi-lignes
- Sous-lignes techniques détaillées
- Documents joints (photos, PDF)
- Calcul automatique (HT, TVA, TTC)
- Génération PDF
- Statuts : brouillon, envoyé, accepté, refusé, expiré

### ✅ Gestion des factures
- Génération depuis devis accepté
- Gestion des acomptes
- Notes de crédit
- Envoi via réseau PEPPOL
- Suivi des paiements

### ✅ Gestion des paiements
- Enregistrement multi-modes
- Paiements partiels
- Mise à jour automatique des soldes

### ✅ Notifications
- Notifications automatiques
- Types : devis, factures, paiements
- Multi-canaux (système, email)

## 🎨 Modules à implémenter

Les fonctionnalités suivantes sont prêtes côté backend mais nécessitent l'implémentation frontend :

- [ ] CRUD complet clients
- [ ] CRUD complet devis avec lignes
- [ ] Génération de factures
- [ ] Enregistrement de paiements
- [ ] Dashboard avec statistiques
- [ ] Génération PDF
- [ ] Interface PEPPOL

## 🔐 Sécurité

- ✅ Authentification JWT
- ✅ Hachage bcrypt des mots de passe
- ✅ Protection CORS
- ✅ Validation des entrées
- ✅ Gestion des rôles et permissions
- ✅ Headers de sécurité (Helmet)

## 📊 Base de données

### Tables principales
- `utilisateur` : Employés du système
- `client` : Clients de l'entreprise
- `prestation_service` : Catalogue de prestations
- `devis` : Devis commerciaux
- `ligne_devis` : Lignes de devis
- `sous_ligne_devis` : Détails techniques
- `document_technique` : Pièces jointes
- `facture` : Factures émises
- `note_credit` : Notes de crédit
- `paiement` : Paiements reçus
- `notification` : Notifications

## 📖 Documentation détaillée

- **Architecture complète** : `docs/ARCHITECTURE.md`
- **Exigences fonctionnelles** : `docs/EXIGENCES.docx`
- **MCD** : `docs/mcd/MCD.pdf`
- **MLD** : `docs/mld/MLD.pdf`
- **Diagrammes UML** : `docs/uml/`
- **Guide API** : À créer (voir CONTRIBUTING.md)

## 🤝 Contribution

Consultez `CONTRIBUTING.md` pour :
- Standards de code
- Workflow Git
- Conventions de nommage
- Process de Pull Request

## 🐛 Problèmes courants

### Erreur de connexion PostgreSQL
```bash
# Vérifier que PostgreSQL est démarré
sudo service postgresql status

# Vérifier les paramètres de connexion dans .env
```

### Port déjà utilisé
```bash
# Backend (port 5000)
lsof -ti:5000 | xargs kill -9

# Frontend (port 3000)
lsof -ti:3000 | xargs kill -9
```

### Erreur d'authentification
```bash
# Vérifier que JWT_SECRET est défini dans .env
# Supprimer le token stocké dans localStorage
```

## 📞 Support

Pour toute question :
1. Consulter la documentation dans `/docs`
2. Ouvrir une issue sur GitHub
3. Contacter l'équipe de développement

## 🎓 Ressources d'apprentissage

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/tutorial/)
- [Sequelize ORM](https://sequelize.org/docs/v6/)

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**Bon développement ! 🚀**
