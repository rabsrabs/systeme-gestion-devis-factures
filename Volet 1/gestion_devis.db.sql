-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 16 déc. 2024 à 20:13
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `gestion_devis`
--

-- --------------------------------------------------------

--
-- Structure de la table `client`
--

CREATE TABLE `client` (
  `id_client` int(11) NOT NULL,
  `societe` varchar(255) DEFAULT NULL,
  `numero_TVA` varchar(50) DEFAULT NULL,
  `nom_client` varchar(255) NOT NULL,
  `prenom_client` varchar(255) NOT NULL,
  `adresse_client` text NOT NULL,
  `code_postal` varchar(20) DEFAULT NULL,
  `ville` varchar(50) DEFAULT NULL,
  `pays` varchar(50) DEFAULT NULL,
  `email_client` varchar(255) NOT NULL,
  `telephone_client` varchar(20) DEFAULT NULL,
  `mot_de_passe_client` varchar(255) DEFAULT NULL,
  `id_utilisateur` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `client`
--

INSERT INTO `client` (`id_client`, `societe`, `numero_TVA`, `nom_client`, `prenom_client`, `adresse_client`, `code_postal`, `ville`, `pays`, `email_client`, `telephone_client`, `mot_de_passe_client`, `id_utilisateur`) VALUES
(1, 'LaRoute', 'BE1234567890', 'Dubois', 'Luc', '107 Rue des bois', '1000', 'Bruxelles', 'Belgique', 'luc.dubois@example.com', '0466123456', NULL, 1),
(2, 'GreenSolutions', 'BE9876543210', 'Dupont', 'Jean', '56 Avenue des Champs', '7020', 'Mons', 'Belgique', 'jean.dupont@example.com', '0472345678', 'hashed_password', 2),
(3, 'EcoTech', 'BE1122334455', 'Dubois', 'Paul', '78 Boulevard Central', '1040', 'Etterbeek', 'Belgique', 'paul.dubois@example.com', '0473456789', 'hashed_password', 3),
(4, 'SunnySystems', 'BE5566778899', 'Durand', 'Sophie', '34 Rue du Soleil', '1030', 'Schaerbeek', 'Belgique', 'sophie.durand@example.com', '0474567890', 'hashed_password', 4),
(5, 'SolarEnergy', 'BE9988776655', 'Moreau', 'Luc', '12 Place Verte', '6030', 'Charleroi', 'Belgique', 'luc.moreau@example.com', '0475678901', 'hashed_password', 5),
(6, 'BrightFuture', 'BE2233445566', 'Leclerc', 'Julie', '90 Rue des Fleurs', '1080', 'Molenbeek', 'Belgique', 'julie.leclerc@example.com', '0476789012', 'hashed_password', 6),
(7, 'NextGenTech', 'BE4455667788', 'Rousseau', 'Marie', '45 Rue des Vignes', '1060', 'Saint-Gilles', 'Belgique', 'marie.rousseau@example.com', '0477890123', 'hashed_password', 7),
(8, 'Innovatech', 'BE6677889900', 'Petit', 'Hugo', '89 Rue des Pins', '7010', 'Mons', 'Belgique', 'hugo.petit@example.com', '0478901234', 'hashed_password', 8),
(9, 'BrightSolutions', 'BE7788990011', 'Blanc', 'Elise', '23 Rue des Arbres', '6060', 'Charleroi', 'Belgique', 'elise.blanc@example.com', '0479012345', 'hashed_password', 9),
(10, 'FutureTech', 'BE8899001122', 'Bernard', 'Noah', '67 Rue des Montagnes', '1150', 'Woluwe-Saint-Pierre', 'Belgique', 'noah.bernard@example.com', '0470123456', 'hashed_password', 10);

-- --------------------------------------------------------

--
-- Structure de la table `devis`
--

CREATE TABLE `devis` (
  `id_devis` int(11) NOT NULL,
  `date_creation_devis` date NOT NULL,
  `taux_TVA` float NOT NULL,
  `statut_devis` varchar(50) NOT NULL,
  `validite` date NOT NULL,
  `condition_reglement` text DEFAULT NULL,
  `id_projet` int(11) DEFAULT NULL,
  `id_client` int(11) DEFAULT NULL,
  `id_utilisateur` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `devis`
--

INSERT INTO `devis` (`id_devis`, `date_creation_devis`, `taux_TVA`, `statut_devis`, `validite`, `condition_reglement`, `id_projet`, `id_client`, `id_utilisateur`) VALUES
(1, '2024-12-20', 21, 'Validé', '2024-12-31', 'Paiement au comptant', 1, 1, 1),
(2, '2024-11-15', 21, 'Validé', '2025-01-15', 'Paiement à 15 jours', 2, 2, 2),
(3, '2024-12-05', 6, 'Validé', '2024-12-30', 'Paiement comptant', 3, 3, 3),
(4, '2024-10-20', 21, 'Validé', '2025-01-20', 'Paiement en 3 fois', 4, 4, 4),
(5, '2024-11-25', 21, 'Validé', '2025-02-25', 'Paiement comptant', 5, 5, 5),
(6, '2024-09-10', 21, 'Validé', '2024-12-10', 'Paiement à réception', 6, 6, 6),
(7, '2024-12-12', 6, 'Validé', '2025-01-12', 'Paiement à réception', 7, 7, 7),
(8, '2024-11-01', 21, 'Validé', '2025-01-01', 'Paiement en 3 fois', 8, 8, 8),
(9, '2024-08-15', 6, 'Validé', '2024-11-15', 'Paiement comptant', 9, 9, 9),
(10, '2024-07-30', 21, 'Validé', '2024-10-30', 'Paiement à 30 jours', 10, 10, 10);

-- --------------------------------------------------------

--
-- Structure de la table `facture`
--

CREATE TABLE `facture` (
  `id_facture` int(11) NOT NULL,
  `date_creation_facture` date NOT NULL,
  `statut_facture` varchar(50) NOT NULL,
  `acompte` float DEFAULT NULL,
  `solde` float DEFAULT NULL,
  `communication` text DEFAULT NULL,
  `conditions` text DEFAULT NULL,
  `date_echeance` date NOT NULL,
  `id_devis` int(11) DEFAULT NULL,
  `id_client` int(11) DEFAULT NULL,
  `id_utilisateur` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `facture`
--

INSERT INTO `facture` (`id_facture`, `date_creation_facture`, `statut_facture`, `acompte`, `solde`, `communication`, `conditions`, `date_echeance`, `id_devis`, `id_client`, `id_utilisateur`) VALUES
(1, '2024-11-20', 'En attente', 4002.5, 2000, 'Facture 002', 'Paiement sous 30 jours', '2024-12-20', 1, 1, 1),
(2, '2024-11-20', 'Payée', NULL, 0, 'Facture 002', 'Paiement sous 30 jours', '2024-12-20', 2, 2, 2),
(3, '2024-12-06', 'Payée', NULL, 0, 'Facture 003', 'Paiement sous 30 jours', '2025-01-06', 3, 3, 3),
(4, '2024-11-01', 'En attente', 4500, 1500, 'Facture 004', 'Paiement sous 30 jours', '2024-12-01', 4, 4, 4),
(5, '2024-12-10', 'Annulée', NULL, 0, 'Facture 005', 'Paiement sous 15 jours', '2024-12-25', 5, 5, 5),
(6, '2024-10-15', 'En attente', 500, 1000, 'Facture 006', 'Paiement sous 30 jours', '2024-11-15', 6, 6, 6),
(7, '2024-11-28', 'Payée', NULL, 0, 'Facture 007', 'Paiement sous 30 jours', '2024-12-28', 7, 7, 7),
(8, '2024-09-01', 'Payée', NULL, 0, 'Facture 008', 'Paiement sous 30 jours', '2024-10-01', 8, 8, 8),
(9, '2024-10-20', 'En attente', 1000, 4000, 'Facture 009', 'Paiement sous 30 jours', '2024-11-20', 9, 9, 9),
(10, '2024-08-10', 'En attente', 6000, 3000, 'Facture 010', 'Paiement sous 30 jours', '2024-09-10', 10, 10, 10);

-- --------------------------------------------------------

--
-- Structure de la table `ligne_devis`
--

CREATE TABLE `ligne_devis` (
  `id_ligne` int(11) NOT NULL,
  `id_devis` int(11) DEFAULT NULL,
  `id_article` int(11) DEFAULT NULL,
  `quantite_ouvrage` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `ligne_devis`
--

INSERT INTO `ligne_devis` (`id_ligne`, `id_devis`, `id_article`, `quantite_ouvrage`) VALUES
(1, 1, 1, 5),
(2, 2, 2, 3),
(3, 3, 3, 2),
(4, 4, 4, 4),
(5, 5, 5, 1),
(6, 6, 6, 10),
(7, 7, 1, 3),
(8, 8, 2, 2),
(9, 9, 3, 7),
(10, 10, 4, 6);

-- --------------------------------------------------------

--
-- Structure de la table `notification`
--

CREATE TABLE `notification` (
  `id_notification` int(11) NOT NULL,
  `type_notifications` varchar(50) NOT NULL,
  `message` text NOT NULL,
  `statut_notifications` varchar(50) NOT NULL,
  `date_envoi` date NOT NULL,
  `mode_de_notification` varchar(50) NOT NULL,
  `id_facture` int(11) DEFAULT NULL,
  `id_devis` int(11) DEFAULT NULL,
  `id_paiement` int(11) DEFAULT NULL,
  `id_utilisateur` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `notification`
--

INSERT INTO `notification` (`id_notification`, `type_notifications`, `message`, `statut_notifications`, `date_envoi`, `mode_de_notification`, `id_facture`, `id_devis`, `id_paiement`, `id_utilisateur`) VALUES
(1, 'Alerte', 'Nouvelle facture créée.', 'Non lue', '2024-11-20', 'Email', 1, NULL, NULL, 2),
(2, 'Info', 'Paiement reçu.', 'Lue', '2024-12-06', 'SMS', NULL, NULL, 2, 3),
(3, 'Alerte', 'Facture annulée.', 'Non lue', '2024-10-15', 'Email', 5, NULL, NULL, 4),
(4, 'Rappel', 'Facture en attente.', 'Non lue', '2024-11-25', 'Email', 4, NULL, NULL, 5),
(5, 'Info', 'Paiement validé.', 'Lue', '2024-09-10', 'SMS', NULL, NULL, 5, 6),
(6, 'Info', 'Paiement partiel effectué.', 'Non lue', '2024-12-12', 'Email', NULL, NULL, 6, 7),
(7, 'Alerte', 'Facture payée.', 'Lue', '2024-11-15', 'SMS', 7, NULL, NULL, 8),
(8, 'Info', 'Facture réglée intégralement.', 'Lue', '2024-12-20', 'Email', 8, NULL, NULL, 9),
(9, 'Alerte', 'Facture en attente de paiement.', 'Non lue', '2024-12-22', 'Email', 9, NULL, NULL, 10),
(10, 'Info', 'Paiement en attente.', 'Non lue', '2024-12-25', 'SMS', NULL, NULL, 10, 2);

-- --------------------------------------------------------

--
-- Structure de la table `ouvrage`
--

CREATE TABLE `ouvrage` (
  `id_ouvrage` int(11) NOT NULL,
  `description_ouvrage` varchar(255) NOT NULL,
  `prix_unitaire` float NOT NULL,
  `unite_ouvrage` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `ouvrage`
--

INSERT INTO `ouvrage` (`id_ouvrage`, `description_ouvrage`, `prix_unitaire`, `unite_ouvrage`) VALUES
(1, 'Installation de panneaux solaires', 1200.5, 'M2'),
(2, 'Réparation de toiture', 70, 'M2'),
(3, 'Isolation thermique', 200, 'M2'),
(4, 'Pompe à chaleur', 1500, 'Unité'),
(5, 'Rénovation électrique', 80, 'h'),
(6, 'Diagnostic énergétique', 150, 'h'),
(7, 'Changement de chaudière', 80, 'h'),
(8, 'Maçonnerie', 320, 'M3'),
(9, 'Fouilles en rigole', 20, 'M3'),
(10, 'Entretien des équipements', 80, 'h');

-- --------------------------------------------------------

--
-- Structure de la table `paiement`
--

CREATE TABLE `paiement` (
  `id_paiement` int(11) NOT NULL,
  `montant` float NOT NULL,
  `date_paiement` date NOT NULL,
  `mode_paiement` varchar(50) NOT NULL,
  `statut_paiement` varchar(50) NOT NULL,
  `id_facture` int(11) DEFAULT NULL,
  `id_utilisateur` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `paiement`
--

INSERT INTO `paiement` (`id_paiement`, `montant`, `date_paiement`, `mode_paiement`, `statut_paiement`, `id_facture`, `id_utilisateur`) VALUES
(1, 2002.5, '2024-11-25', 'Virement', 'En attente', 1, 1),
(2, 2000, '2024-12-06', 'Carte bancaire', 'Payé', 1, 1),
(3, 240, '2024-11-30', 'Espèces', 'Payé', 2, 2),
(4, 600, '2024-12-10', 'Virement', 'En attente', 3, 3),
(5, 1500, '2024-11-07', 'Carte bancaire', 'Payé', 4, 4),
(6, 1500, '2024-11-15', 'Chèque', 'Payé', 4, 4),
(7, 1500, '2024-11-20', 'Virement', 'Payé', 4, 4),
(8, 500, '2024-10-30', 'Carte bancaire', 'Payé', 6, 6),
(9, 3600, '2024-11-30', 'Espèces', 'En attente', 7, 7),
(10, 140, '2024-09-28', 'Virement', 'En attente', 8, 8);

-- --------------------------------------------------------

--
-- Structure de la table `projet`
--

CREATE TABLE `projet` (
  `id_projet` int(11) NOT NULL,
  `nom_projet` varchar(255) NOT NULL,
  `description_projet` text DEFAULT NULL,
  `statut_projet` varchar(50) NOT NULL,
  `date_echeance` date DEFAULT NULL,
  `id_client` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `projet`
--

INSERT INTO `projet` (`id_projet`, `nom_projet`, `description_projet`, `statut_projet`, `date_echeance`, `id_client`) VALUES
(1, 'Projet A', 'Remplacement de panneaux solaires', 'En cours', '2025-01-15', 1),
(2, 'Projet B', 'Réparation de toiture.', 'Terminé', '2025-01-15', 2),
(3, 'Projet C', 'Isolation thermique des murs.', 'En cours', '2025-01-15', 3),
(4, 'Projet D', 'Installation de pompe à chaleur', 'Non démarré', '2025-01-15', 4),
(5, 'Projet E', 'Renovation électrique globale', 'Terminé', '2025-01-15', 5),
(6, 'Projet F', 'Diagnostique energétique', 'En cours', '2025-01-15', 6),
(7, 'Projet G', 'Renouvellement chaudière', 'En cours', '2025-01-15', 7),
(8, 'Projet H', 'Elévation de mur porteur', 'Non démarré', '2025-01-15', 8),
(9, 'Projet I', 'Fouille en rigole', 'Terminé', '2025-01-15', 9),
(10, 'Projet J', 'Entretien des équipements', 'En cours', '2025-01-15', 10);

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `id_utilisateur` int(11) NOT NULL,
  `prenom_utilisateur` varchar(255) NOT NULL,
  `nom_utilisateur` varchar(255) NOT NULL,
  `email_utilisateur` varchar(255) NOT NULL,
  `role_utilisateur` varchar(50) NOT NULL,
  `mot_de_passe_utilisateur` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`id_utilisateur`, `prenom_utilisateur`, `nom_utilisateur`, `email_utilisateur`, `role_utilisateur`, `mot_de_passe_utilisateur`) VALUES
(1, 'test', 'testt', 'test@gmail.com', 'Utilisateur', 'scrypt:32768:8:1$17flF4nM11NlOon3$5ca3c8b5bb8fd6e84df0a68b6295cc169fd924a121c602ecb5d7d69b6f486d7e1fa8e83dde79be6ab3bb65c52ca55017534ad792732462428d7543eee9be9da9'),
(2, 'Claire', 'Martin', 'claire.martin@example.com', 'Commercial', 'hashed_password_2'),
(3, 'Paul', 'Dubois', 'paul.dubois@example.com', 'Technicien', 'hashed_password_3'),
(4, 'Sophie', 'Durand', 'sophie.durand@example.com', 'Comptable', 'hashed_password_4'),
(5, 'Luc', 'Moreau', 'luc.moreau@example.com', 'Support', 'hashed_password_5'),
(6, 'Julie', 'Leclerc', 'julie.leclerc@example.com', 'Administrateur', 'hashed_password_6'),
(7, 'Marie', 'Rousseau', 'marie.rousseau@example.com', 'Technicien', 'hashed_password_7'),
(8, 'Hugo', 'Petit', 'hugo.petit@example.com', 'Commercial', 'hashed_password_8'),
(9, 'Elise', 'Blanc', 'elise.blanc@example.com', 'Comptable', 'hashed_password_9'),
(10, 'Noah', 'Bernard', 'noah.bernard@example.com', 'Support', 'hashed_password_10');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id_client`),
  ADD KEY `id_utilisateur` (`id_utilisateur`);

--
-- Index pour la table `devis`
--
ALTER TABLE `devis`
  ADD PRIMARY KEY (`id_devis`),
  ADD KEY `id_projet` (`id_projet`),
  ADD KEY `id_client` (`id_client`),
  ADD KEY `id_utilisateur` (`id_utilisateur`);

--
-- Index pour la table `facture`
--
ALTER TABLE `facture`
  ADD PRIMARY KEY (`id_facture`),
  ADD KEY `id_devis` (`id_devis`),
  ADD KEY `id_client` (`id_client`),
  ADD KEY `id_utilisateur` (`id_utilisateur`);

--
-- Index pour la table `ligne_devis`
--
ALTER TABLE `ligne_devis`
  ADD PRIMARY KEY (`id_ligne`),
  ADD KEY `id_devis` (`id_devis`),
  ADD KEY `id_article` (`id_article`);

--
-- Index pour la table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id_notification`),
  ADD KEY `id_facture` (`id_facture`),
  ADD KEY `id_devis` (`id_devis`),
  ADD KEY `id_paiement` (`id_paiement`),
  ADD KEY `id_utilisateur` (`id_utilisateur`);

--
-- Index pour la table `ouvrage`
--
ALTER TABLE `ouvrage`
  ADD PRIMARY KEY (`id_ouvrage`);

--
-- Index pour la table `paiement`
--
ALTER TABLE `paiement`
  ADD PRIMARY KEY (`id_paiement`),
  ADD KEY `id_facture` (`id_facture`),
  ADD KEY `id_utilisateur` (`id_utilisateur`) USING BTREE;

--
-- Index pour la table `projet`
--
ALTER TABLE `projet`
  ADD PRIMARY KEY (`id_projet`),
  ADD KEY `id_client` (`id_client`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`id_utilisateur`),
  ADD UNIQUE KEY `email_utilisateur` (`email_utilisateur`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `client`
--
ALTER TABLE `client`
  MODIFY `id_client` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `devis`
--
ALTER TABLE `devis`
  MODIFY `id_devis` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `facture`
--
ALTER TABLE `facture`
  MODIFY `id_facture` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `ligne_devis`
--
ALTER TABLE `ligne_devis`
  MODIFY `id_ligne` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `notification`
--
ALTER TABLE `notification`
  MODIFY `id_notification` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `ouvrage`
--
ALTER TABLE `ouvrage`
  MODIFY `id_ouvrage` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `paiement`
--
ALTER TABLE `paiement`
  MODIFY `id_paiement` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `projet`
--
ALTER TABLE `projet`
  MODIFY `id_projet` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `id_utilisateur` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `client`
--
ALTER TABLE `client`
  ADD CONSTRAINT `client_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`);

--
-- Contraintes pour la table `devis`
--
ALTER TABLE `devis`
  ADD CONSTRAINT `devis_ibfk_1` FOREIGN KEY (`id_projet`) REFERENCES `projet` (`id_projet`),
  ADD CONSTRAINT `devis_ibfk_2` FOREIGN KEY (`id_client`) REFERENCES `client` (`id_client`),
  ADD CONSTRAINT `devis_ibfk_3` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`);

--
-- Contraintes pour la table `facture`
--
ALTER TABLE `facture`
  ADD CONSTRAINT `facture_ibfk_1` FOREIGN KEY (`id_devis`) REFERENCES `devis` (`id_devis`),
  ADD CONSTRAINT `facture_ibfk_2` FOREIGN KEY (`id_client`) REFERENCES `client` (`id_client`),
  ADD CONSTRAINT `facture_ibfk_3` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`);

--
-- Contraintes pour la table `ligne_devis`
--
ALTER TABLE `ligne_devis`
  ADD CONSTRAINT `ligne_devis_ibfk_1` FOREIGN KEY (`id_devis`) REFERENCES `devis` (`id_devis`),
  ADD CONSTRAINT `ligne_devis_ibfk_2` FOREIGN KEY (`id_article`) REFERENCES `ouvrage` (`id_ouvrage`);

--
-- Contraintes pour la table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`id_facture`) REFERENCES `facture` (`id_facture`),
  ADD CONSTRAINT `notification_ibfk_2` FOREIGN KEY (`id_devis`) REFERENCES `devis` (`id_devis`),
  ADD CONSTRAINT `notification_ibfk_3` FOREIGN KEY (`id_paiement`) REFERENCES `paiement` (`id_paiement`),
  ADD CONSTRAINT `notification_ibfk_4` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`);

--
-- Contraintes pour la table `paiement`
--
ALTER TABLE `paiement`
  ADD CONSTRAINT `paiement_ibfk_1` FOREIGN KEY (`id_facture`) REFERENCES `facture` (`id_facture`),
  ADD CONSTRAINT `paiement_ibfk_2` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`);

--
-- Contraintes pour la table `projet`
--
ALTER TABLE `projet`
  ADD CONSTRAINT `projet_ibfk_1` FOREIGN KEY (`id_client`) REFERENCES `client` (`id_client`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
