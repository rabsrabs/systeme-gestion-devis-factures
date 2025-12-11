-- Données de test pour le système OMC

-- ============================================
-- UTILISATEURS DE TEST
-- ============================================
-- Mot de passe pour tous: "password123" (hachage bcrypt)
INSERT INTO utilisateur (nom, email, mot_de_passe, role) VALUES
('Admin Système', 'admin@omc.be', '$2b$10$rqJZE3xqzqKjN3L0PfOXR.xqXjYqGzYCXzqKjN3L0PfOXR.xqXjYq', 'admin'),
('Jean Dupont', 'jean.dupont@omc.be', '$2b$10$rqJZE3xqzqKjN3L0PfOXR.xqXjYqGzYCXzqKjN3L0PfOXR.xqXjYq', 'gestionnaire'),
('Marie Martin', 'marie.martin@omc.be', '$2b$10$rqJZE3xqzqKjN3L0PfOXR.xqXjYqGzYCXzqKjN3L0PfOXR.xqXjYq', 'commercial'),
('Pierre Leroy', 'pierre.leroy@omc.be', '$2b$10$rqJZE3xqzqKjN3L0PfOXR.xqXjYqGzYCXzqKjN3L0PfOXR.xqXjYq', 'comptable');

-- ============================================
-- CLIENTS DE TEST
-- ============================================
INSERT INTO client (numero_interne, societe, numero_tva, nom, prenom, adresse_facturation, adresse_livraison, code_postal, ville, pays, telephone, email, id_utilisateur) VALUES
('CLI-001', 'TechnoSolutions SPRL', 'BE0123456789', 'Dubois', 'Laurent', '15 Rue de la Loi', '15 Rue de la Loi', '1000', 'Bruxelles', 'Belgique', '+32 2 123 45 67', 'l.dubois@technosolutions.be', 3),
('CLI-002', 'Green Energy SA', 'BE0987654321', 'Lefebvre', 'Sophie', '42 Avenue Louise', '42 Avenue Louise', '1050', 'Ixelles', 'Belgique', '+32 2 234 56 78', 's.lefebvre@greenenergy.be', 3),
('CLI-003', NULL, NULL, 'Bertrand', 'Michel', '8 Rue du Commerce', NULL, '4000', 'Liège', 'Belgique', '+32 4 345 67 89', 'm.bertrand@email.be', 3),
('CLI-004', 'BuildCo International', 'BE0555666777', 'Moreau', 'Claire', '123 Boulevard Anspach', '123 Boulevard Anspach', '1000', 'Bruxelles', 'Belgique', '+32 2 456 78 90', 'c.moreau@buildco.be', 2);

-- ============================================
-- PRESTATIONS DE SERVICE
-- ============================================
INSERT INTO prestation_service (code_prestation, description, unite, prix_unitaire, details_techniques, categorie) VALUES
('ISO-001', 'Isolation thermique des murs', 'm²', 45.50, 'Panneaux isolants haute performance, épaisseur 10-15cm', 'Isolation'),
('ISO-002', 'Isolation de toiture', 'm²', 65.00, 'Laine de roche ou polyuréthane, R≥6', 'Isolation'),
('SOL-001', 'Installation panneaux solaires photovoltaïques', 'unité', 850.00, 'Panneaux 300-400W, rendement >20%', 'Énergies renouvelables'),
('SOL-002', 'Installation onduleur solaire', 'unité', 1200.00, 'Onduleur 3-10kW, garantie 10 ans', 'Énergies renouvelables'),
('CHAUF-001', 'Installation pompe à chaleur', 'unité', 4500.00, 'COP>4, puissance adaptée au bâtiment', 'Chauffage'),
('VENT-001', 'Installation VMC double flux', 'unité', 2800.00, 'Débit 150-400m³/h, filtres F7', 'Ventilation'),
('AUDIT-001', 'Audit énergétique complet', 'forfait', 850.00, 'Rapport détaillé avec recommandations', 'Audit'),
('MAIN-001', 'Maintenance annuelle installations', 'forfait', 350.00, 'Visite annuelle + nettoyage + contrôle', 'Maintenance');

-- ============================================
-- DEVIS DE TEST
-- ============================================
INSERT INTO devis (numero_devis, date_validite, taux_tva, remise, statut, montant_ht, montant_tva, montant_ttc, conditions_reglement, notes, id_client, id_utilisateur) VALUES
('DEV-2024-001', CURRENT_DATE + INTERVAL '30 days', 21.00, 0.00, 'envoye', 5200.00, 1092.00, 6292.00, 'Paiement: 30% à la commande, 70% à la livraison', 'Projet isolation complète maison unifamiliale', 1, 3),
('DEV-2024-002', CURRENT_DATE + INTERVAL '30 days', 21.00, 5.00, 'accepte', 8500.00, 1785.00, 10285.00, 'Paiement: 50% à la commande, 50% à l''installation', 'Installation complète panneaux solaires', 2, 3),
('DEV-2024-003', CURRENT_DATE + INTERVAL '30 days', 21.00, 0.00, 'brouillon', 4500.00, 945.00, 5445.00, 'Paiement: à définir', NULL, 3, 2),
('DEV-2024-004', CURRENT_DATE + INTERVAL '30 days', 21.00, 10.00, 'envoye', 7650.00, 1606.50, 9256.50, 'Paiement: 40% à la commande, 60% à la réception', 'Rénovation énergétique complète', 4, 2);

-- ============================================
-- LIGNES DE DEVIS
-- ============================================
INSERT INTO ligne_devis (id_devis, id_prestation, ordre, quantite, prix_unitaire, montant_ligne) VALUES
-- Devis 1
(1, 1, 1, 80.00, 45.50, 3640.00),
(1, 2, 2, 40.00, 65.00, 2600.00),
-- Devis 2
(2, 3, 1, 12.00, 850.00, 10200.00),
(2, 4, 2, 1.00, 1200.00, 1200.00),
(2, 8, 3, 1.00, 350.00, 350.00),
-- Devis 3
(3, 5, 1, 1.00, 4500.00, 4500.00),
-- Devis 4
(4, 1, 1, 100.00, 45.50, 4550.00),
(4, 6, 2, 1.00, 2800.00, 2800.00),
(4, 7, 3, 1.00, 850.00, 850.00);

-- ============================================
-- SOUS-LIGNES DE DEVIS
-- ============================================
INSERT INTO sous_ligne_devis (id_ligne_devis, ordre, description_detaillee, valeur_technique) VALUES
-- Sous-lignes pour isolation murs (ligne 1, devis 1)
(1, 1, 'Isolation murs façade sud', 'Épaisseur: 12cm, R=4.5'),
(1, 2, 'Isolation murs façade nord', 'Épaisseur: 15cm, R=5.5'),
-- Sous-lignes pour panneaux solaires (ligne 3, devis 2)
(3, 1, 'Panneaux photovoltaïques haute performance', 'Puissance unitaire: 400W'),
(3, 2, 'Structure de montage aluminium', 'Garantie: 25 ans'),
(3, 3, 'Câblage et connectique', 'Normes CE');

-- ============================================
-- FACTURES
-- ============================================
INSERT INTO facture (numero_facture, date_echeance, statut, montant_ht, montant_tva, montant_ttc, montant_accompte, solde_restant, remise, conditions_reglement, id_devis, id_client, id_utilisateur) VALUES
('FACT-2024-001', CURRENT_DATE + INTERVAL '30 days', 'emise', 8500.00, 1785.00, 10285.00, 5142.50, 5142.50, 5.00, 'Paiement sous 30 jours', 2, 2, 4);

-- ============================================
-- PAIEMENTS
-- ============================================
INSERT INTO paiement (id_facture, id_client, date_paiement, montant, mode_paiement, statut, reference_paiement, id_utilisateur) VALUES
(1, 2, CURRENT_DATE - INTERVAL '5 days', 5142.50, 'virement', 'valide', 'VIR-2024-001-ACCOMPTE', 4);

-- ============================================
-- NOTIFICATIONS
-- ============================================
INSERT INTO notification (type, message, statut, mode_notification, id_utilisateur, id_devis, id_facture, id_paiement) VALUES
('devis_envoye', 'Le devis DEV-2024-001 a été envoyé au client TechnoSolutions SPRL', 'lu', 'systeme', 3, 1, NULL, NULL),
('devis_accepte', 'Le devis DEV-2024-002 a été accepté par le client Green Energy SA', 'lu', 'systeme', 3, 2, NULL, NULL),
('facture_emise', 'La facture FACT-2024-001 a été émise pour Green Energy SA', 'non_lu', 'systeme', 4, NULL, 1, NULL),
('paiement_recu', 'Paiement de 5142.50€ reçu pour la facture FACT-2024-001', 'non_lu', 'systeme', 4, NULL, 1, 1),
('devis_envoye', 'Le devis DEV-2024-004 a été envoyé au client BuildCo International', 'non_lu', 'systeme', 2, 4, NULL, NULL);

-- ============================================
-- Afficher les statistiques
-- ============================================
SELECT 'Utilisateurs créés: ' || COUNT(*) FROM utilisateur;
SELECT 'Clients créés: ' || COUNT(*) FROM client;
SELECT 'Prestations créées: ' || COUNT(*) FROM prestation_service;
SELECT 'Devis créés: ' || COUNT(*) FROM devis;
SELECT 'Lignes de devis créées: ' || COUNT(*) FROM ligne_devis;
SELECT 'Factures créées: ' || COUNT(*) FROM facture;
SELECT 'Paiements créés: ' || COUNT(*) FROM paiement;
SELECT 'Notifications créées: ' || COUNT(*) FROM notification;
