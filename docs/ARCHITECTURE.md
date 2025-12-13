# Architecture Système - OMC

## Vue d'ensemble

Le système OMC est organisé selon une **architecture en 3 couches** pour assurer la séparation des responsabilités et la maintenabilité.

```
┌─────────────────────────────────────────────┐
│         COUCHE PRÉSENTATION                 │
│         Interface OMC (Frontend)            │
│         React.js                            │
└─────────────────┬───────────────────────────┘
                  │ HTTP/REST
┌─────────────────▼───────────────────────────┐
│         COUCHE MÉTIER                       │
│         Serveur Applicatif (Backend)        │
│         Node.js + Express                   │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │ ServiceAuthentification              │  │
│  │ ServiceClients                       │  │
│  │ ServiceDevis                         │  │
│  │ ServiceFactures                      │  │
│  │ ServicePaiements                     │  │
│  │ ServicePrestations                   │  │
│  │ ServiceNotifications                 │  │
│  │ ServicePeppol                        │  │
│  └──────────────────────────────────────┘  │
└─────────────────┬───────────────────────────┘
                  │ SQL
┌─────────────────▼───────────────────────────┐
│         COUCHE DONNÉES                      │
│         Base de données PostgreSQL          │
└─────────────────────────────────────────────┘
```

## Couche 1: Présentation (Frontend)

### Technologies
- **React 18**: Bibliothèque UI moderne
- **React Router**: Navigation entre pages
- **Axios**: Communication avec l'API
- **CSS modules**: Styles modulaires

### Structure
```
frontend/src/
├── components/      # Composants réutilisables
│   ├── Layout.js    # Layout principal
│   ├── Navbar.js    # Barre de navigation
│   ├── Sidebar.js   # Menu latéral
│   └── ...
├── pages/           # Pages de l'application
│   ├── Login.js
│   ├── Dashboard.js
│   ├── Clients.js
│   ├── Devis.js
│   ├── Factures.js
│   └── ...
├── services/        # Services API
│   ├── api.js       # Configuration Axios
│   ├── auth.js      # Authentification
│   ├── clients.js   # Gestion clients
│   └── ...
├── utils/           # Utilitaires
│   ├── AuthContext.js
│   └── helpers.js
└── styles/          # Styles globaux
```

### Écrans principaux

1. **Écran de connexion**
   - Saisie email/mot de passe
   - Validation côté client
   - Stockage du token JWT

2. **Dashboard**
   - Vue d'ensemble des KPIs
   - Devis récents
   - Factures en attente
   - Notifications

3. **Écran Clients**
   - Liste paginée des clients
   - Recherche et filtres
   - Formulaire création/modification

4. **Écran Devis**
   - Liste des devis avec statuts
   - Création de devis multi-lignes
   - Ajout de sous-lignes techniques
   - Upload de documents
   - Génération PDF

5. **Écran Factures**
   - Liste des factures
   - Génération depuis devis
   - Gestion des paiements
   - Envoi PEPPOL

## Couche 2: Métier (Backend)

### Technologies
- **Node.js 18+**: Runtime JavaScript
- **Express 4**: Framework web
- **Sequelize**: ORM pour PostgreSQL
- **JWT**: Authentification
- **bcrypt**: Hachage des mots de passe

### Structure
```
backend/src/
├── controllers/     # Contrôleurs (gestion requêtes)
├── services/        # Logique métier
├── models/          # Modèles de données
├── routes/          # Routes API
├── middleware/      # Middlewares
│   ├── auth.js      # Authentification
│   ├── validation.js
│   └── errorHandler.js
├── config/          # Configuration
│   └── database.js
└── utils/           # Utilitaires
    ├── pdfGenerator.js
    ├── emailSender.js
    └── peppolClient.js
```

### Services principaux

#### ServiceAuthentification
```javascript
- login(email, password)
- register(userData)
- verifierToken(token)
- getProfile(userId)
```

#### ServiceClients
```javascript
- getAll(filters)
- getById(id)
- create(clientData)
- update(id, clientData)
- delete(id)
- search(query)
```

#### ServiceDevis
```javascript
- getAll(filters)
- getById(id)
- create(devisData)
- update(id, devisData)
- delete(id)
- addLigne(idDevis, ligneData)
- addSousLigne(idLigne, sousLigneData)
- calculerMontants(idDevis)
- genererPDF(idDevis)
- envoyerAuClient(idDevis)
```

#### ServiceFactures
```javascript
- getAll(filters)
- getById(id)
- genererDepuisDevis(idDevis)
- update(id, factureData)
- calculerSolde(idFacture)
- genererPDF(idFacture)
```

#### ServicePeppol
```javascript
- envoyerFacture(idFacture)
- verifierStatut(idFacture)
- recupererReponse(idFacture)
```

### Flux d'authentification

```
1. Client → POST /api/auth/login
2. Backend vérifie identifiants
3. Backend génère token JWT
4. Client stocke token
5. Client envoie token dans header Authorization
6. Middleware vérifie token
7. Route accessible si token valide
```

### Gestion des erreurs

```javascript
// Middleware global de gestion d'erreurs
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur serveur';
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack 
    })
  });
});
```

## Couche 3: Données (PostgreSQL)

### Schéma principal

#### Tables principales
1. **utilisateur**: Employés du système
2. **client**: Clients de l'entreprise
3. **prestation_service**: Catalogue des prestations
4. **devis**: Devis commerciaux
5. **ligne_devis**: Lignes de devis
6. **sous_ligne_devis**: Détails techniques
7. **document_technique**: Pièces jointes
8. **facture**: Factures émises
9. **note_credit**: Notes de crédit
10. **paiement**: Paiements reçus
11. **notification**: Notifications système

### Vues utiles

```sql
-- Vue devis avec informations complètes
CREATE VIEW v_devis_complet AS
SELECT 
  d.*,
  c.societe, c.nom, c.prenom,
  u.nom as createur_nom
FROM devis d
JOIN client c ON d.id_client = c.id_client
JOIN utilisateur u ON d.id_utilisateur = u.id_utilisateur;

-- Vue factures avec soldes
CREATE VIEW v_factures_soldes AS
SELECT 
  f.*,
  COALESCE(SUM(p.montant), 0) as total_paye
FROM facture f
LEFT JOIN paiement p ON f.id_facture = p.id_facture
GROUP BY f.id_facture;
```

### Triggers

```sql
-- Mise à jour automatique date_modification
CREATE TRIGGER trg_devis_date_maj
BEFORE UPDATE ON devis
FOR EACH ROW
EXECUTE FUNCTION update_date_modification();
```

## Intégration externe: PEPPOL

### Description
PEPPOL (Pan-European Public Procurement OnLine) est un réseau pour l'échange standardisé de documents électroniques entre entreprises.

### Flux d'envoi

```
1. Facture validée dans OMC
2. ServicePeppol.envoyerFacture(idFacture)
3. Conversion au format UBL-XML
4. Envoi via API PEPPOL
5. Réception accusé de réception
6. Mise à jour statut dans BD
```

### Format UBL
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">
  <ID>FACT-2024-001</ID>
  <IssueDate>2024-01-15</IssueDate>
  <AccountingSupplierParty>...</AccountingSupplierParty>
  <AccountingCustomerParty>...</AccountingCustomerParty>
  <InvoiceLine>...</InvoiceLine>
</Invoice>
```

## Sécurité

### Authentification
- JWT avec expiration 24h
- Refresh tokens pour sessions longues
- Hachage bcrypt (cost factor 10)

### Autorisations
```javascript
// Middleware de vérification des rôles
const autoriserRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Accès refusé' 
      });
    }
    next();
  };
};

// Utilisation
router.post('/devis', 
  authentification, 
  autoriserRoles('commercial', 'gestionnaire'),
  creerDevis
);
```

### Protection CORS
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
```

### Validation des entrées
```javascript
// Avec express-validator
const validationDevis = [
  body('id_client').isInt(),
  body('date_validite').isDate(),
  body('taux_tva').isDecimal()
];
```

## Performance

### Optimisations BD
- Index sur colonnes fréquemment recherchées
- Vues matérialisées pour rapports
- Connection pooling (max 5 connexions)

### Cache
- Redis pour sessions utilisateurs
- Cache des prestations (rarement modifiées)
- Cache des PDF générés (24h)

### Pagination
```javascript
// Backend
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 20;
const offset = (page - 1) * limit;

const devis = await Devis.findAndCountAll({
  limit,
  offset
});
```

## Monitoring

### Logs
```javascript
// Winston pour logging structuré
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ 
      filename: 'error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'combined.log' 
    })
  ]
});
```

### Métriques
- Temps de réponse API
- Taux d'erreurs
- Nombre de connexions actives
- Utilisation mémoire/CPU

## Déploiement

### Environnements

1. **Développement**
   - Base de données locale
   - Hot reload activé
   - Logs verbeux

2. **Staging**
   - Base de données de test
   - Configuration proche production
   - Tests d'intégration

3. **Production**
   - Base de données production
   - HTTPS obligatoire
   - Logs optimisés
   - Monitoring actif

### CI/CD Pipeline
```yaml
1. Commit → GitHub
2. Tests automatiques
3. Build
4. Deploy staging (si tests OK)
5. Tests E2E
6. Deploy production (validation manuelle)
```

## Évolutions futures

### Phase 2
- API REST complète pour intégrations tierces
- Exports Excel avancés
- Rapports et statistiques
- Module de gestion de stock

### Phase 3
- Application mobile
- Signature électronique des devis
- Intégration comptabilité
- BI et tableaux de bord avancés

## Ressources

- [Documentation PostgreSQL](https://www.postgresql.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Sequelize ORM](https://sequelize.org/)
- [PEPPOL Network](https://peppol.eu/)
