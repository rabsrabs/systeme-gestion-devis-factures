-- Migration initiale - Système OMC
-- Création de la base de données et des tables

-- ============================================
-- TABLE: UTILISATEUR
-- ============================================
CREATE TABLE utilisateur (
    id_utilisateur SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL, -- Hachage bcrypt
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'gestionnaire', 'commercial', 'comptable')),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actif BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_utilisateur_email ON utilisateur(email);
CREATE INDEX idx_utilisateur_role ON utilisateur(role);

-- ============================================
-- TABLE: CLIENT
-- ============================================
CREATE TABLE client (
    id_client SERIAL PRIMARY KEY,
    numero_interne VARCHAR(50) UNIQUE,
    societe VARCHAR(255),
    numero_tva VARCHAR(50),
    nom VARCHAR(100),
    prenom VARCHAR(100),
    adresse_facturation TEXT NOT NULL,
    adresse_livraison TEXT,
    code_postal VARCHAR(20),
    ville VARCHAR(100),
    pays VARCHAR(100) DEFAULT 'Belgique',
    telephone VARCHAR(50),
    email VARCHAR(255) NOT NULL,
    id_utilisateur INTEGER REFERENCES utilisateur(id_utilisateur),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actif BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_client_email ON client(email);
CREATE INDEX idx_client_numero_tva ON client(numero_tva);
CREATE INDEX idx_client_utilisateur ON client(id_utilisateur);

-- ============================================
-- TABLE: PRESTATION_SERVICE
-- ============================================
CREATE TABLE prestation_service (
    id_prestation SERIAL PRIMARY KEY,
    code_prestation VARCHAR(50) UNIQUE,
    description TEXT NOT NULL,
    unite VARCHAR(50) NOT NULL, -- ex: m², heure, unité, forfait
    prix_unitaire DECIMAL(10, 2) NOT NULL,
    details_techniques TEXT,
    categorie VARCHAR(100),
    actif BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_prestation_code ON prestation_service(code_prestation);
CREATE INDEX idx_prestation_categorie ON prestation_service(categorie);

-- ============================================
-- TABLE: DEVIS
-- ============================================
CREATE TABLE devis (
    id_devis SERIAL PRIMARY KEY,
    numero_devis VARCHAR(50) UNIQUE NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_maj TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_validite DATE NOT NULL, -- 30 jours par défaut
    taux_tva DECIMAL(5, 2) DEFAULT 21.00,
    remise DECIMAL(10, 2) DEFAULT 0.00,
    statut VARCHAR(50) NOT NULL CHECK (statut IN ('brouillon', 'envoye', 'accepte', 'refuse', 'expire')),
    montant_ht DECIMAL(10, 2) DEFAULT 0.00,
    montant_tva DECIMAL(10, 2) DEFAULT 0.00,
    montant_ttc DECIMAL(10, 2) DEFAULT 0.00,
    conditions_reglement TEXT,
    notes TEXT,
    id_client INTEGER NOT NULL REFERENCES client(id_client),
    id_utilisateur INTEGER NOT NULL REFERENCES utilisateur(id_utilisateur),
    CONSTRAINT chk_devis_dates CHECK (date_validite >= date_creation::date)
);

CREATE INDEX idx_devis_numero ON devis(numero_devis);
CREATE INDEX idx_devis_client ON devis(id_client);
CREATE INDEX idx_devis_statut ON devis(statut);
CREATE INDEX idx_devis_date_creation ON devis(date_creation);

-- ============================================
-- TABLE: LIGNE_DEVIS
-- ============================================
CREATE TABLE ligne_devis (
    id_ligne_devis SERIAL PRIMARY KEY,
    id_devis INTEGER NOT NULL REFERENCES devis(id_devis) ON DELETE CASCADE,
    id_prestation INTEGER NOT NULL REFERENCES prestation_service(id_prestation),
    ordre INTEGER NOT NULL,
    quantite DECIMAL(10, 2) NOT NULL,
    prix_unitaire DECIMAL(10, 2) NOT NULL,
    montant_ligne DECIMAL(10, 2) NOT NULL,
    description_personnalisee TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ligne_devis_devis ON ligne_devis(id_devis);
CREATE INDEX idx_ligne_devis_prestation ON ligne_devis(id_prestation);

-- ============================================
-- TABLE: SOUS_LIGNE_DEVIS
-- ============================================
CREATE TABLE sous_ligne_devis (
    id_sous_ligne_devis SERIAL PRIMARY KEY,
    id_ligne_devis INTEGER NOT NULL REFERENCES ligne_devis(id_ligne_devis) ON DELETE CASCADE,
    ordre INTEGER NOT NULL,
    description_detaillee TEXT NOT NULL,
    note_complementaire TEXT,
    valeur_technique VARCHAR(255), -- ex: "épaisseur 15cm", "puissance 300W"
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sous_ligne_devis_ligne ON sous_ligne_devis(id_ligne_devis);

-- ============================================
-- TABLE: DOCUMENT_TECHNIQUE
-- ============================================
CREATE TABLE document_technique (
    id_document SERIAL PRIMARY KEY,
    id_ligne_devis INTEGER REFERENCES ligne_devis(id_ligne_devis) ON DELETE CASCADE,
    nom_fichier VARCHAR(255) NOT NULL,
    type_fichier VARCHAR(50) NOT NULL, -- pdf, jpg, png
    chemin_fichier TEXT NOT NULL,
    taille_fichier INTEGER, -- en octets
    description TEXT,
    date_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_document_ligne ON document_technique(id_ligne_devis);

-- ============================================
-- TABLE: FACTURE
-- ============================================
CREATE TABLE facture (
    id_facture SERIAL PRIMARY KEY,
    numero_facture VARCHAR(50) UNIQUE NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_maj TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_echeance DATE NOT NULL,
    statut VARCHAR(50) NOT NULL CHECK (statut IN ('brouillon', 'emise', 'payee', 'partiellement_payee', 'annulee')),
    montant_ht DECIMAL(10, 2) NOT NULL,
    montant_tva DECIMAL(10, 2) NOT NULL,
    montant_ttc DECIMAL(10, 2) NOT NULL,
    montant_accompte DECIMAL(10, 2) DEFAULT 0.00,
    solde_restant DECIMAL(10, 2) NOT NULL,
    remise DECIMAL(10, 2) DEFAULT 0.00,
    conditions_reglement TEXT,
    notes TEXT,
    id_devis INTEGER REFERENCES devis(id_devis),
    id_client INTEGER NOT NULL REFERENCES client(id_client),
    id_utilisateur INTEGER NOT NULL REFERENCES utilisateur(id_utilisateur),
    envoyee_peppol BOOLEAN DEFAULT FALSE,
    date_envoi_peppol TIMESTAMP
);

CREATE INDEX idx_facture_numero ON facture(numero_facture);
CREATE INDEX idx_facture_client ON facture(id_client);
CREATE INDEX idx_facture_devis ON facture(id_devis);
CREATE INDEX idx_facture_statut ON facture(statut);
CREATE INDEX idx_facture_date_echeance ON facture(date_echeance);

-- ============================================
-- TABLE: NOTE_CREDIT
-- ============================================
CREATE TABLE note_credit (
    id_note_credit SERIAL PRIMARY KEY,
    numero_note_credit VARCHAR(50) UNIQUE NOT NULL,
    id_facture INTEGER NOT NULL REFERENCES facture(id_facture),
    montant DECIMAL(10, 2) NOT NULL,
    motif TEXT NOT NULL,
    date_emission TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_utilisateur INTEGER NOT NULL REFERENCES utilisateur(id_utilisateur)
);

CREATE INDEX idx_note_credit_facture ON note_credit(id_facture);

-- ============================================
-- TABLE: PAIEMENT
-- ============================================
CREATE TABLE paiement (
    id_paiement SERIAL PRIMARY KEY,
    id_facture INTEGER NOT NULL REFERENCES facture(id_facture),
    id_client INTEGER NOT NULL REFERENCES client(id_client),
    date_paiement DATE NOT NULL,
    montant DECIMAL(10, 2) NOT NULL,
    mode_paiement VARCHAR(50) NOT NULL CHECK (mode_paiement IN ('virement', 'carte', 'especes', 'cheque', 'prelevement')),
    statut VARCHAR(50) NOT NULL CHECK (statut IN ('en_attente', 'valide', 'rejete')),
    reference_paiement VARCHAR(255),
    notes TEXT,
    id_utilisateur INTEGER NOT NULL REFERENCES utilisateur(id_utilisateur),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_paiement_facture ON paiement(id_facture);
CREATE INDEX idx_paiement_client ON paiement(id_client);
CREATE INDEX idx_paiement_date ON paiement(date_paiement);

-- ============================================
-- TABLE: NOTIFICATION
-- ============================================
CREATE TABLE notification (
    id_notification SERIAL PRIMARY KEY,
    type VARCHAR(100) NOT NULL CHECK (type IN ('devis_cree', 'devis_envoye', 'devis_accepte', 'devis_refuse', 'facture_creee', 'facture_emise', 'paiement_recu', 'rappel_echeance')),
    message TEXT NOT NULL,
    statut VARCHAR(50) NOT NULL CHECK (statut IN ('non_lu', 'lu', 'archive')),
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mode_notification VARCHAR(50) CHECK (mode_notification IN ('systeme', 'email', 'sms')),
    id_utilisateur INTEGER NOT NULL REFERENCES utilisateur(id_utilisateur),
    id_devis INTEGER REFERENCES devis(id_devis),
    id_facture INTEGER REFERENCES facture(id_facture),
    id_paiement INTEGER REFERENCES paiement(id_paiement)
);

CREATE INDEX idx_notification_utilisateur ON notification(id_utilisateur);
CREATE INDEX idx_notification_type ON notification(type);
CREATE INDEX idx_notification_statut ON notification(statut);
CREATE INDEX idx_notification_date ON notification(date_envoi);

-- ============================================
-- TRIGGERS pour mise à jour automatique des dates
-- ============================================

-- Trigger pour utilisateur
CREATE OR REPLACE FUNCTION update_date_modification()
RETURNS TRIGGER AS $$
BEGIN
    NEW.date_modification = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_utilisateur_date_maj
BEFORE UPDATE ON utilisateur
FOR EACH ROW
EXECUTE FUNCTION update_date_modification();

CREATE TRIGGER trg_client_date_maj
BEFORE UPDATE ON client
FOR EACH ROW
EXECUTE FUNCTION update_date_modification();

CREATE TRIGGER trg_devis_date_maj
BEFORE UPDATE ON devis
FOR EACH ROW
EXECUTE FUNCTION update_date_modification();

CREATE TRIGGER trg_facture_date_maj
BEFORE UPDATE ON facture
FOR EACH ROW
EXECUTE FUNCTION update_date_modification();

-- ============================================
-- VUES UTILES
-- ============================================

-- Vue des devis avec informations client et utilisateur
CREATE VIEW v_devis_complet AS
SELECT 
    d.*,
    c.societe, c.nom, c.prenom, c.email as client_email,
    u.nom as createur_nom, u.email as createur_email
FROM devis d
JOIN client c ON d.id_client = c.id_client
JOIN utilisateur u ON d.id_utilisateur = u.id_utilisateur;

-- Vue des factures avec soldes
CREATE VIEW v_factures_soldes AS
SELECT 
    f.*,
    COALESCE(SUM(p.montant), 0) as total_paye,
    f.montant_ttc - COALESCE(SUM(p.montant), 0) as solde_actuel,
    c.societe, c.nom, c.prenom
FROM facture f
LEFT JOIN paiement p ON f.id_facture = p.id_facture AND p.statut = 'valide'
JOIN client c ON f.id_client = c.id_client
GROUP BY f.id_facture, c.societe, c.nom, c.prenom;

-- ============================================
-- COMMENTAIRES SUR LES TABLES
-- ============================================
COMMENT ON TABLE utilisateur IS 'Utilisateurs internes du système (employés)';
COMMENT ON TABLE client IS 'Clients de l''entreprise';
COMMENT ON TABLE prestation_service IS 'Catalogue des prestations offertes';
COMMENT ON TABLE devis IS 'Devis créés pour les clients';
COMMENT ON TABLE ligne_devis IS 'Lignes détaillées d''un devis';
COMMENT ON TABLE sous_ligne_devis IS 'Sous-lignes techniques détaillant une ligne';
COMMENT ON TABLE document_technique IS 'Documents joints aux lignes de devis (photos, PDF)';
COMMENT ON TABLE facture IS 'Factures émises';
COMMENT ON TABLE note_credit IS 'Notes de crédit liées aux factures';
COMMENT ON TABLE paiement IS 'Paiements reçus';
COMMENT ON TABLE notification IS 'Notifications système';

-- ============================================
-- FIN DE LA MIGRATION
-- ============================================
