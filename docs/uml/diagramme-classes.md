# Diagramme de Classes - Système OMC

## Vue d'ensemble
Ce diagramme présente les classes principales du système et leurs relations.

```plantuml
@startuml
!define TABLE(name) class name << (T,#FFAAAA) >>
!define PK(x) <b><color:red>PK</color> x</b>
!define FK(x) <color:blue>FK</color> x

skinparam classAttributeIconSize 0

class Utilisateur {
  PK(id_utilisateur): INTEGER
  nom: VARCHAR(100)
  email: VARCHAR(255)
  mot_de_passe: VARCHAR(255)
  role: VARCHAR(50)
  date_creation: TIMESTAMP
  date_modification: TIMESTAMP
  actif: BOOLEAN
  --
  +verifierMotDePasse(motDePasse): Boolean
  +toJSON(): Object
}

class Client {
  PK(id_client): INTEGER
  numero_interne: VARCHAR(50)
  societe: VARCHAR(255)
  numero_tva: VARCHAR(50)
  nom: VARCHAR(100)
  prenom: VARCHAR(100)
  adresse_facturation: TEXT
  adresse_livraison: TEXT
  code_postal: VARCHAR(20)
  ville: VARCHAR(100)
  pays: VARCHAR(100)
  telephone: VARCHAR(50)
  email: VARCHAR(255)
  FK(id_utilisateur): INTEGER
  date_creation: TIMESTAMP
  date_modification: TIMESTAMP
  actif: BOOLEAN
}

class PrestationService {
  PK(id_prestation): INTEGER
  code_prestation: VARCHAR(50)
  description: TEXT
  unite: VARCHAR(50)
  prix_unitaire: DECIMAL(10,2)
  details_techniques: TEXT
  categorie: VARCHAR(100)
  actif: BOOLEAN
  date_creation: TIMESTAMP
  date_modification: TIMESTAMP
}

class Devis {
  PK(id_devis): INTEGER
  numero_devis: VARCHAR(50)
  date_creation: TIMESTAMP
  date_maj: TIMESTAMP
  date_validite: DATE
  taux_tva: DECIMAL(5,2)
  remise: DECIMAL(10,2)
  statut: VARCHAR(50)
  montant_ht: DECIMAL(10,2)
  montant_tva: DECIMAL(10,2)
  montant_ttc: DECIMAL(10,2)
  conditions_reglement: TEXT
  notes: TEXT
  FK(id_client): INTEGER
  FK(id_utilisateur): INTEGER
  --
  +calculerMontants(): void
  +genererPDF(): Buffer
}

class LigneDevis {
  PK(id_ligne_devis): INTEGER
  FK(id_devis): INTEGER
  FK(id_prestation): INTEGER
  ordre: INTEGER
  quantite: DECIMAL(10,2)
  prix_unitaire: DECIMAL(10,2)
  montant_ligne: DECIMAL(10,2)
  description_personnalisee: TEXT
  date_creation: TIMESTAMP
  --
  +calculerMontant(): void
}

class SousLigneDevis {
  PK(id_sous_ligne_devis): INTEGER
  FK(id_ligne_devis): INTEGER
  ordre: INTEGER
  description_detaillee: TEXT
  note_complementaire: TEXT
  valeur_technique: VARCHAR(255)
  date_creation: TIMESTAMP
}

class DocumentTechnique {
  PK(id_document): INTEGER
  FK(id_ligne_devis): INTEGER
  nom_fichier: VARCHAR(255)
  type_fichier: VARCHAR(50)
  chemin_fichier: TEXT
  taille_fichier: INTEGER
  description: TEXT
  date_upload: TIMESTAMP
}

class Facture {
  PK(id_facture): INTEGER
  numero_facture: VARCHAR(50)
  date_creation: TIMESTAMP
  date_maj: TIMESTAMP
  date_echeance: DATE
  statut: VARCHAR(50)
  montant_ht: DECIMAL(10,2)
  montant_tva: DECIMAL(10,2)
  montant_ttc: DECIMAL(10,2)
  montant_accompte: DECIMAL(10,2)
  solde_restant: DECIMAL(10,2)
  remise: DECIMAL(10,2)
  conditions_reglement: TEXT
  notes: TEXT
  FK(id_devis): INTEGER
  FK(id_client): INTEGER
  FK(id_utilisateur): INTEGER
  envoyee_peppol: BOOLEAN
  date_envoi_peppol: TIMESTAMP
  --
  +calculerSolde(): void
  +genererPDF(): Buffer
  +envoyerPeppol(): Boolean
}

class NoteCredit {
  PK(id_note_credit): INTEGER
  numero_note_credit: VARCHAR(50)
  FK(id_facture): INTEGER
  montant: DECIMAL(10,2)
  motif: TEXT
  date_emission: TIMESTAMP
  FK(id_utilisateur): INTEGER
}

class Paiement {
  PK(id_paiement): INTEGER
  FK(id_facture): INTEGER
  FK(id_client): INTEGER
  date_paiement: DATE
  montant: DECIMAL(10,2)
  mode_paiement: VARCHAR(50)
  statut: VARCHAR(50)
  reference_paiement: VARCHAR(255)
  notes: TEXT
  FK(id_utilisateur): INTEGER
  date_creation: TIMESTAMP
}

class Notification {
  PK(id_notification): INTEGER
  type: VARCHAR(100)
  message: TEXT
  statut: VARCHAR(50)
  date_envoi: TIMESTAMP
  mode_notification: VARCHAR(50)
  FK(id_utilisateur): INTEGER
  FK(id_devis): INTEGER
  FK(id_facture): INTEGER
  FK(id_paiement): INTEGER
}

' Relations
Utilisateur "1" -- "*" Client : gère >
Utilisateur "1" -- "*" Devis : crée >
Utilisateur "1" -- "*" Facture : émet >
Utilisateur "1" -- "*" Paiement : enregistre >
Utilisateur "1" -- "*" Notification : reçoit >
Utilisateur "1" -- "*" NoteCredit : émet >

Client "1" -- "*" Devis : demande >
Client "1" -- "*" Facture : reçoit >
Client "1" -- "*" Paiement : effectue >

Devis "1" -- "*" LigneDevis : contient >
Devis "1" -- "0..1" Facture : génère >
Devis "1" -- "*" Notification : déclenche >

LigneDevis "*" -- "1" PrestationService : utilise >
LigneDevis "1" -- "*" SousLigneDevis : détaille >
LigneDevis "1" -- "*" DocumentTechnique : joint >

Facture "1" -- "*" Paiement : reçoit >
Facture "1" -- "*" NoteCredit : peut avoir >
Facture "1" -- "*" Notification : déclenche >

Paiement "1" -- "*" Notification : génère >

note right of Devis
  Statuts possibles:
  - brouillon
  - envoye
  - accepte
  - refuse
  - expire
end note

note right of Facture
  Statuts possibles:
  - brouillon
  - emise
  - payee
  - partiellement_payee
  - annulee
end note

@enduml
```

## Description des classes principales

### Utilisateur
Représente un employé de l'entreprise avec un rôle spécifique (admin, gestionnaire, commercial, comptable).

### Client
Représente un client de l'entreprise (personne physique ou société).

### Devis
Document commercial proposant des prestations à un client avec calcul automatique des montants.

### Facture
Document comptable émis après acceptation d'un devis, avec gestion des paiements et interface PEPPOL.

### Paiement
Enregistrement d'un paiement effectué par un client pour une facture.

## Patterns utilisés

- **Repository Pattern**: Séparation de la logique d'accès aux données
- **Service Layer**: Logique métier centralisée dans les services
- **Factory Pattern**: Génération de PDF et numéros de documents
- **Observer Pattern**: Système de notifications automatiques
