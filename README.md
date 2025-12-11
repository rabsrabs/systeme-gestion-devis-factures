# Système de Gestion OMC - Devis et Factures

## 📋 Description

Système de gestion complet pour les opérations internes d'une entreprise spécialisée dans les prestations de service. L'application permet la gestion des clients, prestations, devis, factures, paiements et notifications.

## 🏗️ Architecture

Le projet suit une architecture en 3 couches :

1. **Couche Présentation** - Interface OMC (Frontend)
2. **Couche Métier** - Serveur applicatif / Services (Backend)
3. **Couche Données** - Base de données PostgreSQL

### Intégration externe
- **API PEPPOL** : Plateforme d'envoi de factures B2B

## 🗂️ Structure du projet

```
omc-project/
├── docs/                    # Documentation complète
│   ├── mcd/                 # Modèle Conceptuel de Données
│   ├── mld/                 # Modèle Logique de Données
│   ├── architecture/        # Diagrammes d'architecture
│   └── uml/                 # Diagrammes UML
├── backend/                 # Serveur Node.js/Express
│   ├── src/
│   │   ├── controllers/     # Contrôleurs
│   │   ├── services/        # Logique métier
│   │   ├── models/          # Modèles de données
│   │   ├── routes/          # Routes API
│   │   ├── middleware/      # Middlewares
│   │   ├── config/          # Configuration
│   │   └── utils/           # Utilitaires
│   └── tests/               # Tests unitaires et d'intégration
├── frontend/                # Interface utilisateur
│   ├── public/              # Fichiers statiques
│   └── src/
│       ├── components/      # Composants réutilisables
│       ├── pages/           # Pages/Écrans
│       ├── services/        # Services API
│       ├── styles/          # Styles CSS
│       └── utils/           # Utilitaires frontend
├── database/                # Scripts de base de données
│   ├── migrations/          # Migrations
│   └── seeds/               # Données de test
└── scripts/                 # Scripts utilitaires
```

## 🚀 Démarrage rapide

### Prérequis

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm ou yarn

### Installation

1. Cloner le projet :
```bash
git clone <url-du-repo>
cd omc-project
```

2. Installer les dépendances backend :
```bash
cd backend
npm install
```

3. Installer les dépendances frontend :
```bash
cd ../frontend
npm install
```

4. Configurer la base de données :
```bash
# Créer la base de données PostgreSQL
createdb omc_db

# Exécuter les migrations
cd ../database
psql omc_db < migrations/001_initial_schema.sql
```

5. Configurer les variables d'environnement :
```bash
# Backend
cp backend/.env.example backend/.env
# Éditer backend/.env avec vos paramètres

# Frontend
cp frontend/.env.example frontend/.env
# Éditer frontend/.env avec vos paramètres
```

### Lancement

1. Démarrer le backend :
```bash
cd backend
npm run dev
```

2. Démarrer le frontend (dans un autre terminal) :
```bash
cd frontend
npm start
```

3. Accéder à l'application : `http://localhost:3000`

## 📚 Documentation

- [Exigences fonctionnelles](docs/EXIGENCES.md)
- [Architecture système](docs/architecture/ARCHITECTURE.md)
- [Modèle Conceptuel de Données](docs/mcd/MCD.md)
- [Modèle Logique de Données](docs/mld/MLD.md)
- [Diagrammes UML](docs/uml/README.md)
- [Guide API](docs/API.md)

## 🧪 Tests

```bash
# Tests backend
cd backend
npm test

# Tests avec couverture
npm run test:coverage
```

## 🔒 Sécurité

- Authentification JWT
- Hachage bcrypt des mots de passe
- Protection CORS
- Validation des entrées
- Gestion des rôles et permissions

## 📦 Technologies utilisées

### Backend
- Node.js + Express
- PostgreSQL
- Sequelize ORM
- JWT pour l'authentification
- bcrypt pour le hachage

### Frontend
- React.js
- Axios pour les appels API
- CSS moderne

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez [CONTRIBUTING.md](CONTRIBUTING.md) pour plus de détails.

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Équipe

Développé dans le cadre d'un projet académique.

## 📞 Support

Pour toute question ou problème, ouvrez une issue sur le dépôt GitHub.
