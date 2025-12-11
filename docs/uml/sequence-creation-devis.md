# Diagramme de Séquence - Création d'un Devis

## Scénario: Un commercial crée un nouveau devis pour un client

```plantuml
@startuml
actor Commercial
participant "Interface OMC" as UI
participant "ServiceAuthentification" as AuthSvc
participant "ServiceDevis" as DevisSvc
participant "ServiceClients" as ClientSvc
participant "ServicePrestations" as PrestaSvc
participant "ServiceNotifications" as NotifSvc
database "PostgreSQL" as DB

== Authentification ==
Commercial -> UI: Se connecte
UI -> AuthSvc: login(email, password)
AuthSvc -> DB: Vérifier identifiants
DB --> AuthSvc: Utilisateur trouvé
AuthSvc --> UI: Token JWT
UI --> Commercial: Accès accordé

== Navigation ==
Commercial -> UI: Accéder à "Créer devis"
UI -> ClientSvc: getClients()
ClientSvc -> DB: SELECT * FROM client
DB --> ClientSvc: Liste clients
ClientSvc --> UI: Clients disponibles

UI -> PrestaSvc: getPrestations()
PrestaSvc -> DB: SELECT * FROM prestation_service
DB --> PrestaSvc: Liste prestations
PrestaSvc --> UI: Prestations disponibles

== Création du devis ==
Commercial -> UI: Sélectionner client
Commercial -> UI: Remplir informations devis\n(validité, conditions, ...)
Commercial -> UI: Ajouter lignes de devis
loop Pour chaque ligne
    Commercial -> UI: Sélectionner prestation
    Commercial -> UI: Saisir quantité
    UI -> UI: Calculer montant ligne
    
    alt Ajouter sous-lignes techniques
        Commercial -> UI: Ajouter détails techniques
        UI -> UI: Créer sous-ligne
    end
    
    alt Joindre documents
        Commercial -> UI: Upload fichiers
        UI -> UI: Enregistrer documents
    end
end

Commercial -> UI: Valider devis

== Enregistrement ==
UI -> DevisSvc: creerDevis(donneesDevis)
DevisSvc -> DevisSvc: Générer numéro_devis
DevisSvc -> DevisSvc: Calculer montants (HT, TVA, TTC)

DevisSvc -> DB: BEGIN TRANSACTION
DevisSvc -> DB: INSERT INTO devis
DB --> DevisSvc: id_devis

loop Pour chaque ligne
    DevisSvc -> DB: INSERT INTO ligne_devis
    DB --> DevisSvc: id_ligne_devis
    
    alt Si sous-lignes
        DevisSvc -> DB: INSERT INTO sous_ligne_devis
        DB --> DevisSvc: id_sous_ligne_devis
    end
    
    alt Si documents
        DevisSvc -> DB: INSERT INTO document_technique
        DB --> DevisSvc: id_document
    end
end

DevisSvc -> DB: COMMIT TRANSACTION

== Notification ==
DevisSvc -> NotifSvc: creerNotification(\n  type: "devis_cree",\n  id_devis: id_devis,\n  id_utilisateur: commercial_id\n)
NotifSvc -> DB: INSERT INTO notification
DB --> NotifSvc: Notification créée
NotifSvc --> DevisSvc: OK

DevisSvc --> UI: Devis créé (id_devis)
UI --> Commercial: ✅ Devis créé avec succès

== Consultation ==
Commercial -> UI: Consulter devis
UI -> DevisSvc: getDevisById(id_devis)
DevisSvc -> DB: SELECT devis avec lignes
DB --> DevisSvc: Détails complets
DevisSvc --> UI: Devis complet
UI --> Commercial: Afficher devis

@enduml
```

## Étapes principales

1. **Authentification**: Le commercial se connecte avec ses identifiants
2. **Chargement des données**: Récupération des clients et prestations disponibles
3. **Saisie du devis**: 
   - Sélection du client
   - Ajout de lignes de prestation
   - Ajout de sous-lignes techniques (optionnel)
   - Upload de documents (optionnel)
4. **Calculs automatiques**: Le système calcule les montants (HT, TVA, TTC)
5. **Enregistrement transactionnel**: Tout est enregistré dans une transaction
6. **Notification**: Une notification est créée automatiquement
7. **Confirmation**: Le commercial reçoit la confirmation et peut consulter le devis

## Points importants

- **Transaction atomique**: Tout le devis (lignes, sous-lignes, documents) est créé dans une seule transaction
- **Calculs automatiques**: Les montants sont calculés automatiquement côté backend
- **Numérotation automatique**: Le numéro de devis est généré automatiquement
- **Notifications**: Le système crée automatiquement une notification
- **Validation**: Toutes les données sont validées avant l'enregistrement
