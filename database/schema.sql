-- ================================================
-- Système de Gestion OMC - Base de données PostgreSQL
-- Projet Groupe 2 - 2024/2025
-- ================================================

-- Supprimer les tables si elles existent
DROP TABLE IF EXISTS ligne_facture CASCADE;
DROP TABLE IF EXISTS ligne_devis CASCADE;
DROP TABLE IF EXISTS paiement CASCADE;
DROP TABLE IF EXISTS facture CASCADE;
DROP TABLE IF EXISTS devis CASCADE;
DROP TABLE IF EXISTS notification CASCADE;
DROP TABLE IF EXISTS prestation_service CASCADE;
DROP TABLE IF EXISTS utilisateur CASCADE;
DROP TABLE IF EXISTS client CASCADE;

-- ================================================
-- TABLE: CLIENT
-- ================================================
CREATE TABLE client (
    id_client SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100),
    email VARCHAR(255) NOT NULL UNIQUE,
    telephone VARCHAR(20),
    adresse TEXT,
    ville VARCHAR(100),
    code_postal VARCHAR(10),
    pays VARCHAR(100) DEFAULT 'Belgique',
    numero_tva VARCHAR(50),
    type_client VARCHAR(20) CHECK (type_client IN ('particulier', 'professionnel')) DEFAULT 'particulier',
    actif BOOLEAN DEFAULT TRUE,
    notes TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- TABLE: UTILISATEUR
-- ================================================
CREATE TABLE utilisateur (
    id_utilisateur SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'client')) DEFAULT 'client',
    telephone VARCHAR(20),
    actif BOOLEAN DEFAULT TRUE,
    derniere_connexion TIMESTAMP,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_client INTEGER REFERENCES client(id_client) ON DELETE SET NULL
);

-- ================================================
-- TABLE: PRESTATION_SERVICE
-- ================================================
CREATE TABLE prestation_service (
    id_prestation SERIAL PRIMARY KEY,
    code_prestation VARCHAR(50) UNIQUE NOT NULL,
    nom VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    categorie VARCHAR(100) NOT NULL,
    sous_categorie VARCHAR(100),
    unite VARCHAR(50) DEFAULT 'unité',
    prix_unitaire DECIMAL(10,2) NOT NULL,
    tva_applicable DECIMAL(5,2) DEFAULT 21.00,
    details_techniques TEXT,
    actif BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- TABLE: DEVIS
-- ================================================
CREATE TABLE devis (
    id_devis SERIAL PRIMARY KEY,
    numero_devis VARCHAR(50) UNIQUE NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_maj TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_validite DATE NOT NULL,
    taux_tva DECIMAL(5,2) DEFAULT 21.00,
    remise DECIMAL(10,2) DEFAULT 0.00,
    statut VARCHAR(50) CHECK (statut IN ('brouillon', 'envoye', 'accepte', 'refuse', 'expire')) NOT NULL,
    montant_ht DECIMAL(10,2) DEFAULT 0.00,
    montant_tva DECIMAL(10,2) DEFAULT 0.00,
    montant_ttc DECIMAL(10,2) DEFAULT 0.00,
    conditions_reglement TEXT,
    notes TEXT,
    id_client INTEGER NOT NULL REFERENCES client(id_client) ON DELETE CASCADE,
    id_utilisateur INTEGER NOT NULL REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE
);

-- ================================================
-- TABLE: LIGNE_DEVIS
-- ================================================
CREATE TABLE ligne_devis (
    id_ligne_devis SERIAL PRIMARY KEY,
    ordre INTEGER DEFAULT 1,
    quantite DECIMAL(10,2) NOT NULL,
    prix_unitaire DECIMAL(10,2) NOT NULL,
    tva DECIMAL(5,2) DEFAULT 21.00,
    total_ligne DECIMAL(10,2) GENERATED ALWAYS AS (quantite * prix_unitaire) STORED,
    description_personnalisee TEXT,
    id_devis INTEGER NOT NULL REFERENCES devis(id_devis) ON DELETE CASCADE,
    id_prestation INTEGER NOT NULL REFERENCES prestation_service(id_prestation) ON DELETE RESTRICT
);

-- ================================================
-- TABLE: FACTURE
-- ================================================
CREATE TABLE facture (
    id_facture SERIAL PRIMARY KEY,
    numero_facture VARCHAR(50) UNIQUE NOT NULL,
    date_emission TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_echeance DATE NOT NULL,
    statut_paiement VARCHAR(50) CHECK (statut_paiement IN ('non_payee', 'partielle', 'payee', 'en_retard')) DEFAULT 'non_payee',
    montant_ht DECIMAL(10,2) DEFAULT 0.00,
    montant_tva DECIMAL(10,2) DEFAULT 0.00,
    montant_ttc DECIMAL(10,2) DEFAULT 0.00,
    montant_paye DECIMAL(10,2) DEFAULT 0.00,
    montant_restant DECIMAL(10,2) DEFAULT 0.00,
    remise DECIMAL(10,2) DEFAULT 0.00,
    conditions_paiement TEXT,
    notes TEXT,
    id_client INTEGER NOT NULL REFERENCES client(id_client) ON DELETE CASCADE,
    id_devis INTEGER REFERENCES devis(id_devis) ON DELETE SET NULL,
    id_utilisateur INTEGER NOT NULL REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE
);

-- ================================================
-- TABLE: LIGNE_FACTURE
-- ================================================
CREATE TABLE ligne_facture (
    id_ligne_facture SERIAL PRIMARY KEY,
    ordre INTEGER DEFAULT 1,
    quantite DECIMAL(10,2) NOT NULL,
    prix_unitaire DECIMAL(10,2) NOT NULL,
    tva DECIMAL(5,2) DEFAULT 21.00,
    total_ligne DECIMAL(10,2) GENERATED ALWAYS AS (quantite * prix_unitaire) STORED,
    description_personnalisee TEXT,
    id_facture INTEGER NOT NULL REFERENCES facture(id_facture) ON DELETE CASCADE,
    id_prestation INTEGER NOT NULL REFERENCES prestation_service(id_prestation) ON DELETE RESTRICT
);

-- ================================================
-- TABLE: PAIEMENT
-- ================================================
CREATE TABLE paiement (
    id_paiement SERIAL PRIMARY KEY,
    numero_paiement VARCHAR(50) UNIQUE NOT NULL,
    date_paiement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    montant DECIMAL(10,2) NOT NULL,
    mode_paiement VARCHAR(50) CHECK (mode_paiement IN ('virement', 'carte', 'especes', 'cheque')) NOT NULL,
    reference_transaction VARCHAR(100),
    notes TEXT,
    id_facture INTEGER NOT NULL REFERENCES facture(id_facture) ON DELETE CASCADE
);

-- ================================================
-- TABLE: NOTIFICATION
-- ================================================
CREATE TABLE notification (
    id_notification SERIAL PRIMARY KEY,
    type VARCHAR(50) CHECK (type IN ('devis_cree', 'devis_accepte', 'devis_refuse', 'facture_emise', 'paiement_recu', 'rappel_paiement')) NOT NULL,
    message TEXT NOT NULL,
    lu BOOLEAN DEFAULT FALSE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_utilisateur INTEGER NOT NULL REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE
);

-- ================================================
-- TRIGGERS
-- ================================================

-- Trigger pour mettre à jour date_maj du devis
CREATE OR REPLACE FUNCTION update_devis_date_maj()
RETURNS TRIGGER AS $$
BEGIN
    NEW.date_maj = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_devis_date_maj
BEFORE UPDATE ON devis
FOR EACH ROW
EXECUTE FUNCTION update_devis_date_maj();

-- ================================================
-- INDEX pour optimisation
-- ================================================
CREATE INDEX idx_devis_client ON devis(id_client);
CREATE INDEX idx_devis_statut ON devis(statut);
CREATE INDEX idx_facture_client ON facture(id_client);
CREATE INDEX idx_facture_statut ON facture(statut_paiement);
CREATE INDEX idx_paiement_facture ON paiement(id_facture);
CREATE INDEX idx_notification_utilisateur ON notification(id_utilisateur);

-- ================================================
-- DONNÉES DE TEST
-- ================================================

-- Insérer un client test
INSERT INTO client (nom, prenom, email, telephone, adresse, ville, code_postal, type_client)
VALUES ('Dupont', 'Jean', 'jean.dupont@example.com', '+32 2 123 45 67', '123 Rue de la Loi', 'Bruxelles', '1000', 'professionnel');

-- Insérer un utilisateur admin (mot de passe: admin123)
-- Note: En production, le mot de passe sera haché par bcrypt
INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role, telephone)
VALUES ('Admin', 'Système', 'admin@omc.be', '$2a$10$YourHashedPasswordHere', 'admin', '+32 2 999 99 99');

-- Insérer un utilisateur client (mot de passe: client123)
INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role, id_client)
VALUES ('Dupont', 'Jean', 'jean.dupont@example.com', '$2a$10$YourHashedPasswordHere', 'client', 1);

-- Insérer des prestations de service avec catégories et sous-catégories
INSERT INTO prestation_service (code_prestation, nom, description, categorie, sous_categorie, unite, prix_unitaire, tva_applicable)
VALUES 
('ELEC-001', 'Installation électrique', 'Installation complète circuit électrique', 'Électricité', 'Installation', 'm²', 150.00, 21.00),
('ELEC-002', 'Réparation tableau électrique', 'Diagnostic et réparation tableau', 'Électricité', 'Réparation', 'unité', 200.00, 21.00),
('PLOMB-001', 'Installation sanitaire', 'Installation système sanitaire complet', 'Plomberie', 'Installation', 'unité', 500.00, 21.00),
('PLOMB-002', 'Réparation fuite', 'Détection et réparation fuite d\'eau', 'Plomberie', 'Réparation', 'intervention', 120.00, 21.00),
('CHAUF-001', 'Installation chaudière', 'Pose et installation chaudière gaz', 'Chauffage', 'Installation', 'unité', 2500.00, 6.00),
('ISOL-001', 'Isolation toiture', 'Isolation thermique toiture', 'Isolation', 'Toiture', 'm²', 50.00, 6.00),
('ISOL-002', 'Isolation murs', 'Isolation thermique murs intérieurs', 'Isolation', 'Murs', 'm²', 40.00, 6.00),
('RENO-001', 'Rénovation énergétique', 'Audit et travaux rénovation énergétique', 'Rénovation', 'Énergétique', 'projet', 5000.00, 6.00);

-- Insérer un devis test
INSERT INTO devis (numero_devis, date_validite, statut, id_client, id_utilisateur)
VALUES ('DEV-2024-0001', CURRENT_DATE + INTERVAL '30 days', 'envoye', 1, 1);

-- Insérer des lignes de devis
INSERT INTO ligne_devis (quantite, prix_unitaire, id_devis, id_prestation)
VALUES 
(50, 150.00, 1, 1),
(1, 200.00, 1, 2);

-- ================================================
-- FIN DU SCRIPT
-- ================================================

SELECT 'Base de données créée avec succès!' AS message;
