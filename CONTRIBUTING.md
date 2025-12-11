# Guide de Contribution - Projet OMC

Merci de votre intérêt pour contribuer au projet OMC ! Ce document présente les directives pour contribuer efficacement.

## Table des matières

1. [Code de conduite](#code-de-conduite)
2. [Comment contribuer](#comment-contribuer)
3. [Standards de code](#standards-de-code)
4. [Workflow Git](#workflow-git)
5. [Tests](#tests)
6. [Documentation](#documentation)

## Code de conduite

- Respecter tous les contributeurs
- Communiquer de manière constructive
- Accepter les critiques constructives
- Se concentrer sur ce qui est meilleur pour le projet

## Comment contribuer

### Rapporter un bug

1. Vérifier que le bug n'a pas déjà été rapporté
2. Créer une issue avec le template suivant:

```markdown
**Description du bug**
Description claire et concise du problème.

**Étapes pour reproduire**
1. Aller à '...'
2. Cliquer sur '...'
3. Voir l'erreur

**Comportement attendu**
Ce qui devrait se passer normalement.

**Captures d'écran**
Si applicable, ajouter des captures d'écran.

**Environnement**
- OS: [e.g. Windows 11, macOS 14]
- Navigateur: [e.g. Chrome 120, Firefox 121]
- Version Node: [e.g. 18.19.0]
```

### Proposer une fonctionnalité

1. Créer une issue "Feature Request"
2. Décrire:
   - Le problème que cela résout
   - La solution proposée
   - Les alternatives considérées
3. Attendre les retours avant de commencer le développement

### Soumettre une Pull Request

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commiter les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Standards de code

### Backend (Node.js)

#### Style de code
```javascript
// Utiliser camelCase pour les variables et fonctions
const monUtilisateur = getUserById(id);

// Utiliser PascalCase pour les classes
class ServiceClient {
  // ...
}

// Constantes en UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;

// Fonctions asynchrones avec async/await
async function creerDevis(donnees) {
  try {
    const devis = await Devis.create(donnees);
    return devis;
  } catch (error) {
    throw new Error(`Erreur création devis: ${error.message}`);
  }
}
```

#### Structure des fichiers
```
backend/src/
├── controllers/    # Logique de contrôle des routes
├── services/       # Logique métier
├── models/         # Modèles Sequelize
├── routes/         # Définition des routes
├── middleware/     # Middlewares Express
├── config/         # Configuration
└── utils/          # Utilitaires
```

### Frontend (React)

#### Style de code
```javascript
// Composants fonctionnels avec hooks
import React, { useState, useEffect } from 'react';

function MonComposant({ prop1, prop2 }) {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Effet secondaire
  }, []);

  return (
    <div className="mon-composant">
      {/* Contenu */}
    </div>
  );
}

export default MonComposant;
```

#### Structure des composants
```
frontend/src/
├── components/     # Composants réutilisables
│   ├── Button.js
│   ├── Card.js
│   └── Modal.js
├── pages/          # Pages/Vues
│   ├── Dashboard.js
│   ├── Clients.js
│   └── Devis.js
├── services/       # Services API
├── utils/          # Utilitaires
└── styles/         # Styles CSS
```

### Base de données

#### Conventions de nommage
- Tables: `snake_case` minuscules (ex: `ligne_devis`)
- Colonnes: `snake_case` minuscules (ex: `date_creation`)
- Clés primaires: `id_<nom_table>` (ex: `id_devis`)
- Clés étrangères: `id_<nom_table_referencee>` (ex: `id_client`)

#### Migrations
```sql
-- Toujours inclure un commentaire de description
-- Migration: Ajout colonne remise dans table devis
-- Date: 2024-01-15

ALTER TABLE devis ADD COLUMN remise DECIMAL(10,2) DEFAULT 0.00;
```

## Workflow Git

### Branches

- `main`: Branche principale stable
- `develop`: Branche de développement
- `feature/*`: Nouvelles fonctionnalités
- `bugfix/*`: Corrections de bugs
- `hotfix/*`: Corrections urgentes en production

### Commits

Format des messages de commit:
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage
- `refactor`: Refactoring
- `test`: Tests
- `chore`: Tâches diverses

Exemples:
```
feat(devis): ajouter validation des montants

Ajouter une validation pour s'assurer que les montants
sont positifs avant la création d'un devis.

Closes #123
```

```
fix(auth): corriger expiration du token JWT

Le token expirait après 1h au lieu de 24h.
Correction de la configuration dans auth.service.js.

Fixes #456
```

### Pull Requests

Template de PR:
```markdown
## Description
Brève description des changements.

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Checklist
- [ ] Mon code suit le style du projet
- [ ] J'ai commenté le code complexe
- [ ] J'ai mis à jour la documentation
- [ ] J'ai ajouté des tests
- [ ] Les tests existants passent
- [ ] J'ai testé localement

## Tests effectués
Description des tests manuels effectués.

## Captures d'écran
Si applicable.
```

## Tests

### Backend

```bash
# Lancer tous les tests
npm test

# Tests avec couverture
npm run test:coverage

# Tests en mode watch
npm run test:watch
```

Exemple de test:
```javascript
describe('ServiceDevis', () => {
  it('devrait créer un devis valide', async () => {
    const donnees = {
      id_client: 1,
      id_utilisateur: 1,
      // ...
    };
    
    const devis = await serviceDevis.creer(donnees);
    
    expect(devis).toBeDefined();
    expect(devis.id_devis).toBeGreaterThan(0);
  });
});
```

### Frontend

```bash
# Lancer les tests
npm test
```

## Documentation

### Code

- Commenter les fonctions complexes
- Utiliser JSDoc pour les fonctions publiques
- Documenter les API endpoints

Exemple JSDoc:
```javascript
/**
 * Crée un nouveau devis
 * @param {Object} donnees - Données du devis
 * @param {number} donnees.id_client - ID du client
 * @param {number} donnees.id_utilisateur - ID de l'utilisateur créateur
 * @returns {Promise<Object>} Le devis créé
 * @throws {Error} Si les données sont invalides
 */
async function creerDevis(donnees) {
  // ...
}
```

### API

Documenter les endpoints dans `docs/API.md`:
```markdown
### POST /api/devis

Crée un nouveau devis.

**Headers**
- Authorization: Bearer <token>

**Body**
```json
{
  "id_client": 1,
  "date_validite": "2024-02-15",
  "lignes": [...]
}
```

**Response 201**
```json
{
  "success": true,
  "data": {
    "id_devis": 123,
    ...
  }
}
```

## Questions ?

Si vous avez des questions, n'hésitez pas à:
- Ouvrir une issue
- Contacter l'équipe sur le canal de discussion
- Consulter la documentation dans `/docs`

Merci de contribuer au projet OMC ! 🚀
