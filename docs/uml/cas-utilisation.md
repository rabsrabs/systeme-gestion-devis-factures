# Diagramme de Cas d'Utilisation - Système OMC

## Description
Ce diagramme présente les différents cas d'utilisation du système OMC selon les rôles des utilisateurs.

```plantuml
@startuml
left to right direction
skinparam packageStyle rectangle

actor "Utilisateur\nInterne" as User
actor "Admin" as Admin
actor "Commercial" as Commercial
actor "Gestionnaire" as Gestionnaire
actor "Comptable" as Comptable
actor "Système\nPEPPOL" as Peppol

rectangle "Système OMC" {
  ' Authentification
  usecase "Se connecter" as UC1
  usecase "Gérer utilisateurs" as UC2
  
  ' Gestion clients
  usecase "Créer client" as UC3
  usecase "Modifier client" as UC4
  usecase "Consulter clients" as UC5
  usecase "Rechercher client" as UC6
  
  ' Gestion prestations
  usecase "Créer prestation" as UC7
  usecase "Modifier prestation" as UC8
  usecase "Consulter prestations" as UC9
  
  ' Gestion devis
  usecase "Créer devis" as UC10
  usecase "Modifier devis" as UC11
  usecase "Ajouter lignes devis" as UC12
  usecase "Ajouter sous-lignes" as UC13
  usecase "Joindre documents" as UC14
  usecase "Générer PDF devis" as UC15
  usecase "Envoyer devis" as UC16
  usecase "Accepter/Refuser devis" as UC17
  
  ' Gestion factures
  usecase "Générer facture" as UC18
  usecase "Créer note de crédit" as UC19
  usecase "Consulter factures" as UC20
  usecase "Envoyer facture PEPPOL" as UC21
  
  ' Gestion paiements
  usecase "Enregistrer paiement" as UC22
  usecase "Consulter paiements" as UC23
  usecase "Gérer paiements partiels" as UC24
  
  ' Notifications
  usecase "Consulter notifications" as UC25
  usecase "Gérer notifications" as UC26
}

' Relations utilisateurs génériques
User <|-- Commercial
User <|-- Gestionnaire
User <|-- Comptable
User <|-- Admin

' Authentification
User --> UC1

' Admin
Admin --> UC2

' Commercial
Commercial --> UC3
Commercial --> UC4
Commercial --> UC5
Commercial --> UC6
Commercial --> UC7
Commercial --> UC8
Commercial --> UC9
Commercial --> UC10
Commercial --> UC11
Commercial --> UC12
Commercial --> UC13
Commercial --> UC14
Commercial --> UC15
Commercial --> UC16

' Gestionnaire
Gestionnaire --> UC5
Gestionnaire --> UC6
Gestionnaire --> UC9
Gestionnaire --> UC10
Gestionnaire --> UC11
Gestionnaire --> UC12
Gestionnaire --> UC13
Gestionnaire --> UC14
Gestionnaire --> UC15
Gestionnaire --> UC16
Gestionnaire --> UC18
Gestionnaire --> UC20

' Comptable
Comptable --> UC18
Comptable --> UC19
Comptable --> UC20
Comptable --> UC21
Comptable --> UC22
Comptable --> UC23
Comptable --> UC24

' Tous
User --> UC25
User --> UC26

' Relations externes
UC21 --> Peppol : "envoie à"

' Dépendances
UC18 ..> UC17 : <<include>>
UC12 ..> UC10 : <<include>>
UC13 ..> UC12 : <<include>>
UC14 ..> UC12 : <<include>>
UC16 ..> UC15 : <<include>>
UC22 ..> UC20 : <<include>>

@enduml
```

## Acteurs principaux

### 1. Admin
- Gestion complète des utilisateurs
- Accès à toutes les fonctionnalités

### 2. Commercial
- Gestion des clients
- Création et gestion des devis
- Gestion des prestations

### 3. Gestionnaire
- Supervision des devis
- Génération des factures
- Consultation globale

### 4. Comptable
- Gestion des factures
- Enregistrement des paiements
- Envoi PEPPOL

## Cas d'utilisation prioritaires

1. **Créer un devis** (UC10)
   - Acteurs: Commercial, Gestionnaire
   - Pré-condition: Client existant
   - Post-condition: Devis créé en statut "brouillon"

2. **Enregistrer un paiement** (UC22)
   - Acteur: Comptable
   - Pré-condition: Facture émise
   - Post-condition: Paiement enregistré, solde mis à jour

3. **Envoyer facture PEPPOL** (UC21)
   - Acteur: Comptable
   - Pré-condition: Facture validée
   - Post-condition: Facture transmise au réseau PEPPOL
