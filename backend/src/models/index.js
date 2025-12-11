const Utilisateur = require('./Utilisateur');
const Client = require('./Client');
const PrestationService = require('./PrestationService');
const Devis = require('./Devis');
const LigneDevis = require('./LigneDevis');
const SousLigneDevis = require('./SousLigneDevis');
const DocumentTechnique = require('./DocumentTechnique');
const Facture = require('./Facture');
const NoteCredit = require('./NoteCredit');
const Paiement = require('./Paiement');
const Notification = require('./Notification');

// ============================================
// RELATIONS ENTRE LES MODÈLES
// ============================================

// Relations Utilisateur
Utilisateur.hasMany(Client, { foreignKey: 'id_utilisateur', as: 'clients' });
Utilisateur.hasMany(Devis, { foreignKey: 'id_utilisateur', as: 'devis' });
Utilisateur.hasMany(Facture, { foreignKey: 'id_utilisateur', as: 'factures' });
Utilisateur.hasMany(Paiement, { foreignKey: 'id_utilisateur', as: 'paiements' });
Utilisateur.hasMany(Notification, { foreignKey: 'id_utilisateur', as: 'notifications' });
Utilisateur.hasMany(NoteCredit, { foreignKey: 'id_utilisateur', as: 'notesCredit' });

// Relations Client
Client.belongsTo(Utilisateur, { foreignKey: 'id_utilisateur', as: 'gestionnaire' });
Client.hasMany(Devis, { foreignKey: 'id_client', as: 'devis' });
Client.hasMany(Facture, { foreignKey: 'id_client', as: 'factures' });
Client.hasMany(Paiement, { foreignKey: 'id_client', as: 'paiements' });

// Relations Devis
Devis.belongsTo(Client, { foreignKey: 'id_client', as: 'client' });
Devis.belongsTo(Utilisateur, { foreignKey: 'id_utilisateur', as: 'createur' });
Devis.hasMany(LigneDevis, { foreignKey: 'id_devis', as: 'lignes', onDelete: 'CASCADE' });
Devis.hasMany(Notification, { foreignKey: 'id_devis', as: 'notifications' });
Devis.hasOne(Facture, { foreignKey: 'id_devis', as: 'facture' });

// Relations LigneDevis
LigneDevis.belongsTo(Devis, { foreignKey: 'id_devis', as: 'devis' });
LigneDevis.belongsTo(PrestationService, { foreignKey: 'id_prestation', as: 'prestation' });
LigneDevis.hasMany(SousLigneDevis, { foreignKey: 'id_ligne_devis', as: 'sousLignes', onDelete: 'CASCADE' });
LigneDevis.hasMany(DocumentTechnique, { foreignKey: 'id_ligne_devis', as: 'documents', onDelete: 'CASCADE' });

// Relations SousLigneDevis
SousLigneDevis.belongsTo(LigneDevis, { foreignKey: 'id_ligne_devis', as: 'ligneDevis' });

// Relations PrestationService
PrestationService.hasMany(LigneDevis, { foreignKey: 'id_prestation', as: 'lignesDevis' });

// Relations DocumentTechnique
DocumentTechnique.belongsTo(LigneDevis, { foreignKey: 'id_ligne_devis', as: 'ligneDevis' });

// Relations Facture
Facture.belongsTo(Devis, { foreignKey: 'id_devis', as: 'devis' });
Facture.belongsTo(Client, { foreignKey: 'id_client', as: 'client' });
Facture.belongsTo(Utilisateur, { foreignKey: 'id_utilisateur', as: 'emetteur' });
Facture.hasMany(Paiement, { foreignKey: 'id_facture', as: 'paiements' });
Facture.hasMany(NoteCredit, { foreignKey: 'id_facture', as: 'notesCredit' });
Facture.hasMany(Notification, { foreignKey: 'id_facture', as: 'notifications' });

// Relations NoteCredit
NoteCredit.belongsTo(Facture, { foreignKey: 'id_facture', as: 'facture' });
NoteCredit.belongsTo(Utilisateur, { foreignKey: 'id_utilisateur', as: 'emetteur' });

// Relations Paiement
Paiement.belongsTo(Facture, { foreignKey: 'id_facture', as: 'facture' });
Paiement.belongsTo(Client, { foreignKey: 'id_client', as: 'client' });
Paiement.belongsTo(Utilisateur, { foreignKey: 'id_utilisateur', as: 'enregistreur' });
Paiement.hasMany(Notification, { foreignKey: 'id_paiement', as: 'notifications' });

// Relations Notification
Notification.belongsTo(Utilisateur, { foreignKey: 'id_utilisateur', as: 'destinataire' });
Notification.belongsTo(Devis, { foreignKey: 'id_devis', as: 'devis' });
Notification.belongsTo(Facture, { foreignKey: 'id_facture', as: 'facture' });
Notification.belongsTo(Paiement, { foreignKey: 'id_paiement', as: 'paiement' });

module.exports = {
  Utilisateur,
  Client,
  PrestationService,
  Devis,
  LigneDevis,
  SousLigneDevis,
  DocumentTechnique,
  Facture,
  NoteCredit,
  Paiement,
  Notification
};
