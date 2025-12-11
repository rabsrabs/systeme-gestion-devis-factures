# Documentation UML - Système OMC

Ce dossier contient l'ensemble de la documentation UML du projet.

## Contenu

### 1. Diagramme de Cas d'Utilisation
**Fichier**: `cas-utilisation.md`

Présente les différents cas d'utilisation selon les rôles:
- Admin: Gestion des utilisateurs
- Commercial: Gestion clients, devis, prestations
- Gestionnaire: Supervision, génération factures
- Comptable: Facturation, paiements, PEPPOL

### 2. Diagramme de Classes
**Fichier**: `diagramme-classes.md`

Modélisation complète des classes du système:
- Entités principales (Utilisateur, Client, Devis, Facture, etc.)
- Relations et cardinalités
- Méthodes clés
- Patterns utilisés

### 3. Diagrammes de Séquence

#### Création de Devis
**Fichier**: `sequence-creation-devis.md`

Détaille le processus complet de création d'un devis:
1. Authentification
2. Chargement des données
3. Saisie du devis
4. Calculs automatiques
5. Enregistrement transactionnel
6. Notifications

## Génération des diagrammes

Les diagrammes sont écrits en **PlantUML**. Pour les générer:

### Option 1: Utiliser PlantUML en ligne
Visitez: https://www.plantuml.com/plantuml/uml/

Copiez le code entre les balises ```plantuml et collez-le dans l'éditeur en ligne.

### Option 2: Installation locale de PlantUML

```bash
# Installer PlantUML
brew install plantuml  # macOS
apt-get install plantuml  # Linux
# Windows: télécharger depuis https://plantuml.com/download

# Générer les images
plantuml cas-utilisation.md
plantuml diagramme-classes.md
plantuml sequence-creation-devis.md
```

### Option 3: Extension VSCode
Installer l'extension "PlantUML" dans VSCode pour prévisualiser les diagrammes directement.

## Structure recommandée

Pour ajouter de nouveaux diagrammes:

1. **Diagrammes de séquence** pour les flux complexes:
   - Génération de facture
   - Envoi PEPPOL
   - Enregistrement de paiement

2. **Diagrammes d'activité** pour les processus métier:
   - Workflow validation devis
   - Processus facturation
   - Rappels paiements

3. **Diagrammes de composants** pour l'architecture:
   - Découpage en modules
   - Dépendances
   - Interfaces

4. **Diagrammes de déploiement** pour l'infrastructure:
   - Serveurs
   - Base de données
   - Services externes

## Conventions

- Tous les diagrammes doivent être en français
- Utiliser les noms de tables et attributs du MLD
- Documenter les contraintes et règles métier
- Inclure des notes explicatives

## Maintenance

Les diagrammes doivent être mis à jour lors de:
- Ajout de nouvelles fonctionnalités
- Modification de l'architecture
- Changement des relations entre entités
- Evolution des processus métier

## Outils recommandés

- **PlantUML**: Diagrammes UML en mode texte
- **Mermaid**: Alternative pour diagrammes simples
- **Draw.io**: Diagrammes complexes en mode graphique
- **StarUML**: Modélisation complète UML

## Contact

Pour toute question sur la documentation UML, contacter l'équipe d'architecture.
