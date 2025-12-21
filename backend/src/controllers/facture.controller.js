const { Facture, Client, Devis, LigneDevis } = require('../models');
const PDFDocument = require('pdfkit');

exports.getAllFactures = async (req, res) => {
  try {
    const factures = await Facture.findAll({
      include: [{ model: Client }],
      order: [['date_emission', 'DESC']]
    });
    res.json({ success: true, data: factures });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generatePDF = async (req, res) => {
  try {
    const { id } = req.params;
    
    const facture = await Facture.findByPk(id, {
      include: [{ model: Client }]
    });

    if (!facture) {
      return res.status(404).json({ success: false, message: 'Facture non trouvée' });
    }

    // Récupérer les lignes du devis associé
    let lignes = [];
    let devisInfo = null;
    if (facture.id_devis) {
      devisInfo = await Devis.findByPk(facture.id_devis, {
        include: [{ model: LigneDevis }]
      });
      if (devisInfo && devisInfo.LigneDevis) {
        lignes = devisInfo.LigneDevis;
      }
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=facture-${facture.numero_facture}.pdf`);

    doc.pipe(res);

    // En-tête entreprise
    doc.fontSize(24).fillColor('#667eea').text('Anneessens & Co', 50, 50);
    doc.fontSize(10).fillColor('#666').text('Solutions Panneaux Solaires', 50, 80);
    doc.text('Place Anneessens 11', 50, 95);
    doc.text('1000 Bruxelles', 50, 110);
    doc.text('TVA: BE0123456789', 50, 125);

    // Titre FACTURE
    doc.fontSize(28).fillColor('#333').text('FACTURE', 400, 50);
    doc.fontSize(10).fillColor('#666').text(`N° ${facture.numero_facture}`, 400, 85);
    doc.text(`Date: ${new Date(facture.date_emission).toLocaleDateString('fr-FR')}`, 400, 100);
    doc.text(`Echeance: ${new Date(facture.date_echeance).toLocaleDateString('fr-FR')}`, 400, 115);

    // Ligne séparatrice
    doc.moveTo(50, 160).lineTo(550, 160).stroke('#667eea');

    // Infos client
    doc.fontSize(12).fillColor('#667eea').text('Facture a:', 50, 180);
    doc.fontSize(11).fillColor('#333');
    doc.text(`${facture.Client?.nom || ''} ${facture.Client?.prenom || ''}`, 50, 200);
    if (facture.Client?.adresse) doc.text(facture.Client.adresse, 50, 215);
    if (facture.Client?.code_postal || facture.Client?.ville) {
      doc.text(`${facture.Client?.code_postal || ''} ${facture.Client?.ville || ''}`, 50, 230);
    }
    if (facture.Client?.numero_tva) doc.text(`TVA: ${facture.Client.numero_tva}`, 50, 245);

    // Tableau des produits
    let yPos = 290;
    
    // En-tête tableau
    doc.fillColor('#667eea').rect(50, yPos, 500, 25).fill();
    doc.fillColor('#fff').fontSize(10);
    doc.text('Description', 60, yPos + 8);
    doc.text('Qte', 350, yPos + 8);
    doc.text('Prix unit.', 400, yPos + 8);
    doc.text('Total', 480, yPos + 8);

    yPos += 25;

    // Calculer le sous-total (avant remise)
    let sousTotal = 0;

    // Lignes du tableau
    if (lignes.length > 0) {
      lignes.forEach((ligne, index) => {
        const bgColor = index % 2 === 0 ? '#f9f9f9' : '#ffffff';
        doc.fillColor(bgColor).rect(50, yPos, 500, 25).fill();
        doc.fillColor('#333').fontSize(9);
        
        const description = ligne.description_personnalisee || 'Produit';
        const quantite = parseFloat(ligne.quantite) || 1;
        const prixUnit = parseFloat(ligne.prix_unitaire) || 0;
        const total = quantite * prixUnit;
        sousTotal += total;
        
        doc.text(description.substring(0, 50), 60, yPos + 8, { width: 280 });
        doc.text(String(quantite), 355, yPos + 8);
        doc.text(`${prixUnit.toFixed(2)} EUR`, 395, yPos + 8);
        doc.text(`${total.toFixed(2)} EUR`, 475, yPos + 8);
        yPos += 25;
      });
    } else {
      doc.fillColor('#f9f9f9').rect(50, yPos, 500, 25).fill();
      doc.fillColor('#999').fontSize(9);
      doc.text('Produits selon devis', 60, yPos + 8);
      yPos += 25;
    }

    // Récupérer la remise (depuis facture ou devis)
    const remise = parseFloat(facture.remise) || (devisInfo ? parseFloat(devisInfo.remise) : 0) || 0;
    const raisonRemise = facture.raison_remise || (devisInfo ? devisInfo.raison_remise : '') || '';

    yPos += 20;
    doc.fontSize(10);

    // Afficher sous-total si remise
    if (remise > 0 && sousTotal > 0) {
      doc.fillColor('#666').text('Sous-total HTVA:', 380, yPos);
      doc.fillColor('#333').text(`${sousTotal.toFixed(2)} EUR`, 480, yPos);
      yPos += 20;

      // Afficher la remise
      const montantRemise = sousTotal * (remise / 100);
      doc.fillColor('#ff9800').text(`Remise (${remise}%):`, 380, yPos);
      doc.fillColor('#ff9800').text(`-${montantRemise.toFixed(2)} EUR`, 480, yPos);
      yPos += 15;
      
      if (raisonRemise) {
        doc.fontSize(8).fillColor('#888').text(`(${raisonRemise})`, 380, yPos);
        yPos += 15;
      }
      yPos += 5;
    }

    // Total HTVA
    doc.fontSize(10);
    doc.fillColor('#666').text('Total HTVA:', 380, yPos);
    doc.fillColor('#333').text(`${parseFloat(facture.montant_ht || 0).toFixed(2)} EUR`, 480, yPos);
    
    yPos += 20;
    doc.fillColor('#666').text('TVA (21%):', 380, yPos);
    doc.fillColor('#333').text(`${parseFloat(facture.montant_tva || 0).toFixed(2)} EUR`, 480, yPos);
    
    yPos += 25;
    doc.fillColor('#667eea').rect(370, yPos - 5, 180, 30).fill();
    doc.fillColor('#fff').fontSize(12).text('Total TVAC:', 380, yPos + 3);
    doc.text(`${parseFloat(facture.montant_ttc || 0).toFixed(2)} EUR`, 480, yPos + 3);

    // Pied de page
    yPos += 60;
    doc.fillColor('#666').fontSize(9);
    doc.text('Conditions de paiement: 30 jours', 50, yPos);
    doc.text('IBAN: BE00 0000 0000 0000 - BIC: GEBABEBB', 50, yPos + 15);
    doc.text('Merci pour votre confiance!', 50, yPos + 35);

    doc.end();

  } catch (error) {
    console.error('Erreur PDF:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = exports;
