-- Question 1 : Trouver tous les clients ayant une adresse dans la ville de "Bruxelles" ou "Ixelles" et dont le code postal est supérieur à 1000.

SELECT id_client, nom_client, prenom_client, ville, code_postal
FROM client
WHERE (ville = 'Bruxelles' OR ville = 'Ixelles') AND code_postal > 1000;


-- Question 2 : Afficher la somme des montants de tous les paiements groupés par mode de paiement.

SELECT mode_paiement, SUM(montant) AS total_paiement
FROM paiement
GROUP BY mode_paiement
HAVING SUM(montant) > 500;


-- Question 3 : Récupérer la liste des devis avec les informations du client associé (nom, prénom).

SELECT devis.id_devis, devis.date_creation_devis, client.nom_client, client.prenom_client
FROM devis
INNER JOIN client ON devis.id_client = client.id_client
ORDER BY devis.date_creation_devis DESC;


-- Question 4 : Afficher tous les projets, même ceux qui n'ont pas de devis associés.

SELECT projet.id_projet, projet.nom_projet, devis.id_devis, devis.statut_devis
FROM projet
LEFT JOIN devis ON projet.id_projet = devis.id_projet;


-- Question 5 :Identifier les factures en retard de paiement, avec le montant restant dû avec une limite de 5 factures.

SELECT id_facture, date_echeance, solde AS montant_restant
FROM facture
WHERE date_echeance < NOW() AND solde > 0
ORDER BY date_echeance ASC
LIMIT 5;
