const { Devis, Client, LigneDevis, Facture } = require('../models');
const transporter = require('../config/email');
const PDFDocument = require('pdfkit');

exports.getAllDevis = async (req, res) => {
  try {
    const devis = await Devis.findAll({
      include: [{ model: Client }, { model: LigneDevis }],
      order: [['date_creation', 'DESC']]
    });
    res.json({ success: true, data: devis });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDevisById = async (req, res) => {
  try {
    const devis = await Devis.findByPk(req.params.id, {
      include: [{ model: Client }, { model: LigneDevis }]
    });
    if (!devis) return res.status(404).json({ success: false, message: 'Devis non trouve' });
    res.json({ success: true, data: devis });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createDevis = async (req, res) => {
  try {
    const { lignes, montant_ht, montant_tva, montant_ttc, notes, taux_tva } = req.body;
    let client = await Client.findOne({ where: { email: req.user.email } });
    if (!client) {
      client = await Client.create({
        nom: req.user.nom || 'Client',
        prenom: req.user.prenom || '',
        email: req.user.email,
        id_utilisateur: req.user.id_utilisateur,
        type_client: 'particulier'
      });
    }
    const lastDevis = await Devis.findOne({ order: [['id_devis', 'DESC']] });
    const nextNum = (lastDevis ? lastDevis.id_devis : 0) + 1;
    const numeroDevis = 'DEV-' + new Date().getFullYear() + '-' + String(nextNum).padStart(4, '0');
    const devis = await Devis.create({
      numero_devis: numeroDevis,
      id_client: client.id_client,
      date_validite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      id_utilisateur: req.user.id_utilisateur,
      statut: 'brouillon',
      montant_ht: montant_ht || 0,
      montant_tva: montant_tva || 0,
      montant_ttc: montant_ttc || 0,
      taux_tva: taux_tva || 21,
      notes: notes || ''
    });
    if (lignes && lignes.length > 0) {
      for (const ligne of lignes) {
        try {
          await LigneDevis.create({
            id_devis: devis.id_devis,
            description_personnalisee: ligne.description_personnalisee || 'Produit',
            quantite: ligne.quantite || 1,
            prix_unitaire: ligne.prix_unitaire || 0
          });
        } catch (e) {
          console.log('Erreur ligne:', e.message);
        }
      }
    }
    res.status(201).json({ success: true, message: 'Devis cree', data: devis });
  } catch (error) {
    console.error('Erreur creation devis:', error);
    res.status(500).json({ success: false, message: 'Erreur creation devis' });
  }
};

exports.updateDevis = async (req, res) => {
  try {
    const devis = await Devis.findByPk(req.params.id);
    if (!devis) return res.status(404).json({ success: false, message: 'Devis non trouve' });
    await devis.update(req.body);
    res.json({ success: true, message: 'Devis mis a jour', data: devis });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStatut = async (req, res) => {
  try {
    const devis = await Devis.findByPk(req.params.id);
    if (!devis) return res.status(404).json({ success: false, message: 'Devis non trouve' });
    await devis.update({ statut: req.body.statut });
    res.json({ success: true, message: 'Statut mis a jour', data: devis });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Appliquer une remise sur un devis
exports.appliquerRemise = async (req, res) => {
  try {
    const { remise, raison_remise } = req.body;
    const devis = await Devis.findByPk(req.params.id, {
      include: [{ model: LigneDevis }]
    });
    
    if (!devis) {
      return res.status(404).json({ success: false, message: 'Devis non trouve' });
    }

    // Calculer le sous-total HTVA original (somme des lignes)
    let sousTotal = 0;
    if (devis.LigneDevis && devis.LigneDevis.length > 0) {
      sousTotal = devis.LigneDevis.reduce((sum, ligne) => {
        return sum + (parseFloat(ligne.prix_unitaire) * parseInt(ligne.quantite));
      }, 0);
    } else {
      // Si pas de lignes, utiliser le montant_ht actuel comme base
      sousTotal = parseFloat(devis.montant_ht) / (1 - (parseFloat(devis.remise || 0) / 100));
    }

    // Appliquer la remise
    const pourcentageRemise = parseFloat(remise) || 0;
    const montantRemise = sousTotal * (pourcentageRemise / 100);
    const nouveauHT = sousTotal - montantRemise;
    const tauxTVA = parseFloat(devis.taux_tva) || 21;
    const nouvelleTVA = nouveauHT * (tauxTVA / 100);
    const nouveauTTC = nouveauHT + nouvelleTVA;

    await devis.update({
      remise: pourcentageRemise,
      raison_remise: raison_remise || '',
      montant_ht: nouveauHT.toFixed(2),
      montant_tva: nouvelleTVA.toFixed(2),
      montant_ttc: nouveauTTC.toFixed(2)
    });

    res.json({ 
      success: true, 
      message: `Remise de ${pourcentageRemise}% appliquee`, 
      data: devis 
    });
  } catch (error) {
    console.error('Erreur application remise:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

async function generatePDFBuffer(facture, lignes) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // En-tête entreprise
    doc.fontSize(24).fillColor('#667eea').text('Anneessens & Co', 50, 50);
    doc.fontSize(10).fillColor('#666').text('Solutions Panneaux Solaires', 50, 80);
    doc.text('Place Anneessens 11', 50, 95);
    doc.text('1000 Bruxelles', 50, 110);
    doc.text('TVA: BE0123456789', 50, 125);

    // Titre FACTURE
    doc.fontSize(28).fillColor('#333').text('FACTURE', 400, 50);
    doc.fontSize(10).fillColor('#666').text('No ' + facture.numero_facture, 400, 85);
    doc.text('Date: ' + new Date(facture.date_emission).toLocaleDateString('fr-FR'), 400, 100);
    doc.text('Echeance: ' + new Date(facture.date_echeance).toLocaleDateString('fr-FR'), 400, 115);

    // Ligne séparatrice
    doc.moveTo(50, 160).lineTo(550, 160).stroke('#667eea');

    // Infos client
    doc.fontSize(12).fillColor('#667eea').text('Facture a:', 50, 180);
    doc.fontSize(11).fillColor('#333');
    var clientNom = facture.Client ? facture.Client.nom : '';
    var clientPrenom = facture.Client ? facture.Client.prenom : '';
    doc.text(clientNom + ' ' + clientPrenom, 50, 200);
    if (facture.Client && facture.Client.adresse) doc.text(facture.Client.adresse, 50, 215);
    if (facture.Client && (facture.Client.code_postal || facture.Client.ville)) {
      doc.text((facture.Client.code_postal || '') + ' ' + (facture.Client.ville || ''), 50, 230);
    }
    if (facture.Client && facture.Client.numero_tva) doc.text('TVA: ' + facture.Client.numero_tva, 50, 245);

    // Tableau des produits
    var yPos = 290;
    
    // En-tête tableau
    doc.fillColor('#667eea').rect(50, yPos, 500, 25).fill();
    doc.fillColor('#fff').fontSize(10);
    doc.text('Description', 60, yPos + 8);
    doc.text('Qte', 350, yPos + 8);
    doc.text('Prix unit.', 400, yPos + 8);
    doc.text('Total', 480, yPos + 8);

    yPos += 25;

    // Lignes du tableau
    if (lignes && lignes.length > 0) {
      for (var i = 0; i < lignes.length; i++) {
        var ligne = lignes[i];
        var bgColor = i % 2 === 0 ? '#f9f9f9' : '#ffffff';
        doc.fillColor(bgColor).rect(50, yPos, 500, 25).fill();
        doc.fillColor('#333').fontSize(9);
        
        var description = ligne.description_personnalisee || 'Produit';
        var quantite = parseFloat(ligne.quantite) || 1;
        var prixUnit = parseFloat(ligne.prix_unitaire) || 0;
        var total = quantite * prixUnit;
        
        doc.text(description.substring(0, 50), 60, yPos + 8, { width: 280 });
        doc.text(String(quantite), 355, yPos + 8);
        doc.text(prixUnit.toFixed(2) + ' EUR', 395, yPos + 8);
        doc.text(total.toFixed(2) + ' EUR', 475, yPos + 8);
        yPos += 25;
      }
    } else {
      doc.fillColor('#f9f9f9').rect(50, yPos, 500, 25).fill();
      doc.fillColor('#999').fontSize(9);
      doc.text('Produits selon devis', 60, yPos + 8);
      yPos += 25;
    }

    // Remise si applicable
    if (facture.remise && parseFloat(facture.remise) > 0) {
      yPos += 10;
      doc.fillColor('#ff9800').fontSize(10);
      doc.text('Remise (' + facture.remise + '%):', 380, yPos);
      var montantRemise = parseFloat(facture.montant_ht) * parseFloat(facture.remise) / (100 - parseFloat(facture.remise));
      doc.text('-' + montantRemise.toFixed(2) + ' EUR', 480, yPos);
      yPos += 15;
    }

    // Totaux
    yPos += 10;
    doc.fontSize(10);
    doc.fillColor('#666').text('Total HTVA:', 380, yPos);
    doc.fillColor('#333').text(parseFloat(facture.montant_ht || 0).toFixed(2) + ' EUR', 480, yPos);
    
    yPos += 20;
    doc.fillColor('#666').text('TVA (21%):', 380, yPos);
    doc.fillColor('#333').text(parseFloat(facture.montant_tva || 0).toFixed(2) + ' EUR', 480, yPos);
    
    yPos += 25;
    doc.fillColor('#667eea').rect(370, yPos - 5, 180, 30).fill();
    doc.fillColor('#fff').fontSize(12).text('Total TVAC:', 380, yPos + 3);
    doc.text(parseFloat(facture.montant_ttc || 0).toFixed(2) + ' EUR', 480, yPos + 3);

    // Pied de page
    yPos += 60;
    doc.fillColor('#666').fontSize(9);
    doc.text('Conditions de paiement: 30 jours', 50, yPos);
    doc.text('IBAN: BE00 0000 0000 0000 - BIC: GEBABEBB', 50, yPos + 15);
    doc.text('Merci pour votre confiance!', 50, yPos + 35);

    doc.end();
  });
}

exports.convertirEnFacture = async (req, res) => {
  try {
    const devis = await Devis.findByPk(req.params.id, { include: [{ model: Client }, { model: LigneDevis }] });
    if (!devis) {
      return res.status(404).json({ success: false, message: 'Devis non trouve' });
    }
    const lastFacture = await Facture.findOne({ order: [['id_facture', 'DESC']] });
    const nextNum = (lastFacture ? lastFacture.id_facture : 0) + 1;
    const numeroFacture = 'FACT-' + new Date().getFullYear() + '-' + String(nextNum).padStart(4, '0');
    const dateEcheance = new Date();
    dateEcheance.setDate(dateEcheance.getDate() + 30);
    const facture = await Facture.create({
      numero_facture: numeroFacture,
      date_emission: new Date(),
      date_echeance: dateEcheance,
      montant_ht: devis.montant_ht || 0,
      montant_tva: devis.montant_tva || 0,
      montant_ttc: devis.montant_ttc || 0,
      montant_restant: devis.montant_ttc || 0,
      remise: devis.remise || 0,
      raison_remise: devis.raison_remise || '',
      statut_paiement: 'non_payee',
      id_devis: devis.id_devis,
      id_client: devis.id_client
    });
    const factureComplete = await Facture.findByPk(facture.id_facture, { include: [{ model: Client }] });
    if (devis.Client && devis.Client.email) {
      try {
        const pdfBuffer = await generatePDFBuffer(factureComplete, devis.LigneDevis);
        await transporter.sendMail({
          from: '"Anneessens & Co" <rabia1.ozcelik@gmail.com>',
          to: devis.Client.email,
          subject: 'Votre facture ' + numeroFacture,
          html: '<h1>Bonjour</h1><p>Votre facture est en piece jointe.</p><p>Montant: ' + parseFloat(facture.montant_ttc).toFixed(2) + ' EUR</p>',
          attachments: [{ filename: 'facture-' + numeroFacture + '.pdf', content: pdfBuffer, contentType: 'application/pdf' }]
        });
        console.log('Email envoye a ' + devis.Client.email);
      } catch (emailError) {
        console.error('Erreur envoi email:', emailError.message);
      }
    }
    res.status(201).json({ success: true, message: 'Facture creee', data: facture });
  } catch (error) {
    console.error('Erreur conversion facture:', error);
    res.status(500).json({ success: false, message: 'Erreur: ' + error.message });
  }
};

exports.deleteDevis = async (req, res) => {
  try {
    const devis = await Devis.findByPk(req.params.id);
    if (!devis) return res.status(404).json({ success: false, message: 'Devis non trouve' });
    await LigneDevis.destroy({ where: { id_devis: req.params.id } });
    await devis.destroy();
    res.json({ success: true, message: 'Devis supprime' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = exports;
