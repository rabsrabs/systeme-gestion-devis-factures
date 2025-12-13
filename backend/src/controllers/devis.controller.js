const Devis = require('../models/Devis');
const Facture = require('../models/Facture');
const Client = require('../models/Client');
const LigneDevis = require('../models/LigneDevis');

// Récupérer tous les devis
exports.getAllDevis = async (req, res) => {
  try {
    const { statut, client_id } = req.query;
    
    const where = {};
    if (statut) where.statut = statut;
    if (client_id) where.id_client = client_id;
    
    const devis = await Devis.findAll({
      where,
      include: [
        { model: Client, attributes: ['nom', 'prenom', 'email'] }
      ],
      order: [['date_creation', 'DESC']]
    });
    
    res.json({
      success: true,
      data: devis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des devis',
      error: error.message
    });
  }
};

// Récupérer un devis par ID
exports.getDevisById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const devis = await Devis.findByPk(id, {
      include: [
        { model: Client },
        { model: LigneDevis, include: ['PrestationService'] }
      ]
    });
    
    if (!devis) {
      return res.status(404).json({
        success: false,
        message: 'Devis non trouvé'
      });
    }
    
    res.json({
      success: true,
      data: devis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du devis',
      error: error.message
    });
  }
};

// Créer un nouveau devis
exports.createDevis = async (req, res) => {
  try {
    const { id_client, date_validite, lignes, ...devisData } = req.body;
    
    // Générer le numéro de devis
    const count = await Devis.count();
    const numeroDevis = `DEV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    
    // Créer le devis
    const devis = await Devis.create({
      ...devisData,
      numero_devis: numeroDevis,
      id_client,
      date_validite,
      id_utilisateur: req.user.id_utilisateur,
      statut: 'brouillon'
    });
    
    // Créer les lignes de devis si fournies
    if (lignes && lignes.length > 0) {
      await Promise.all(lignes.map(ligne => 
        LigneDevis.create({
          ...ligne,
          id_devis: devis.id_devis
        })
      ));
      
      // Recalculer les montants
      await calculerMontantsDevis(devis.id_devis);
    }
    
    res.status(201).json({
      success: true,
      message: 'Devis créé avec succès',
      data: devis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du devis',
      error: error.message
    });
  }
};

// Mettre à jour un devis
exports.updateDevis = async (req, res) => {
  try {
    const { id } = req.params;
    const { lignes, ...devisData } = req.body;
    
    const devis = await Devis.findByPk(id);
    
    if (!devis) {
      return res.status(404).json({
        success: false,
        message: 'Devis non trouvé'
      });
    }
    
    // Vérifier si le devis est modifiable
    if (['accepte', 'refuse'].includes(devis.statut)) {
      return res.status(400).json({
        success: false,
        message: 'Ce devis ne peut plus être modifié'
      });
    }
    
    // Mettre à jour le devis
    await devis.update(devisData);
    
    // Mettre à jour les lignes si fournies
    if (lignes) {
      await LigneDevis.destroy({ where: { id_devis: id } });
      await Promise.all(lignes.map(ligne => 
        LigneDevis.create({
          ...ligne,
          id_devis: id
        })
      ));
      
      await calculerMontantsDevis(id);
    }
    
    res.json({
      success: true,
      message: 'Devis mis à jour avec succès',
      data: devis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du devis',
      error: error.message
    });
  }
};

// Changer le statut d'un devis
exports.updateStatut = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;
    
    const devis = await Devis.findByPk(id);
    
    if (!devis) {
      return res.status(404).json({
        success: false,
        message: 'Devis non trouvé'
      });
    }
    
    await devis.update({ statut });
    
    res.json({
      success: true,
      message: 'Statut du devis mis à jour',
      data: devis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut',
      error: error.message
    });
  }
};

// Convertir un devis accepté en facture
exports.convertirEnFacture = async (req, res) => {
  try {
    const { id } = req.params;
    
    const devis = await Devis.findByPk(id, {
      include: [{ model: LigneDevis }]
    });
    
    if (!devis) {
      return res.status(404).json({
        success: false,
        message: 'Devis non trouvé'
      });
    }
    
    if (devis.statut !== 'accepte') {
      return res.status(400).json({
        success: false,
        message: 'Seuls les devis acceptés peuvent être convertis en facture'
      });
    }
    
    // Vérifier si une facture n'existe pas déjà
    const factureExistante = await Facture.findOne({ where: { id_devis: id } });
    if (factureExistante) {
      return res.status(400).json({
        success: false,
        message: 'Une facture existe déjà pour ce devis',
        data: factureExistante
      });
    }
    
    // Générer le numéro de facture
    const count = await Facture.count();
    const numeroFacture = `FACT-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    
    // Calculer la date d'échéance (30 jours par défaut)
    const dateEcheance = new Date();
    dateEcheance.setDate(dateEcheance.getDate() + 30);
    
    // Créer la facture
    const facture = await Facture.create({
      numero_facture: numeroFacture,
      date_emission: new Date(),
      date_echeance: dateEcheance,
      montant_ht: devis.montant_ht,
      montant_tva: devis.montant_tva,
      montant_ttc: devis.montant_ttc,
      montant_restant: devis.montant_ttc,
      remise: devis.remise,
      statut_paiement: 'non_payee',
      id_client: devis.id_client,
      id_devis: devis.id_devis,
      id_utilisateur: req.user.id_utilisateur,
      conditions_paiement: devis.conditions_reglement,
      notes: `Facture générée depuis le devis ${devis.numero_devis}`
    });
    
    res.status(201).json({
      success: true,
      message: 'Facture créée avec succès à partir du devis',
      data: facture
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la conversion en facture',
      error: error.message
    });
  }
};

// Supprimer un devis
exports.deleteDevis = async (req, res) => {
  try {
    const { id } = req.params;
    
    const devis = await Devis.findByPk(id);
    
    if (!devis) {
      return res.status(404).json({
        success: false,
        message: 'Devis non trouvé'
      });
    }
    
    // Supprimer les lignes de devis
    await LigneDevis.destroy({ where: { id_devis: id } });
    
    // Supprimer le devis
    await devis.destroy();
    
    res.json({
      success: true,
      message: 'Devis supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du devis',
      error: error.message
    });
  }
};

// Fonction helper pour calculer les montants
async function calculerMontantsDevis(id_devis) {
  const devis = await Devis.findByPk(id_devis, {
    include: [{ model: LigneDevis }]
  });
  
  let montantHT = 0;
  
  devis.LigneDevis.forEach(ligne => {
    montantHT += parseFloat(ligne.prix_unitaire) * parseFloat(ligne.quantite);
  });
  
  devis.montant_ht = montantHT;
  devis.calculerMontants();
  await devis.save();
}

module.exports = exports;
