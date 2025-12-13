const Utilisateur = require('./Utilisateur');
const Client = require('./Client');
const PrestationService = require('./PrestationService');
const Devis = require('./Devis');
const LigneDevis = require('./LigneDevis');
const Facture = require('./Facture');

// Relations
Client.hasMany(Devis, { foreignKey: 'id_client' });
Devis.belongsTo(Client, { foreignKey: 'id_client' });

Utilisateur.hasMany(Devis, { foreignKey: 'id_utilisateur' });
Devis.belongsTo(Utilisateur, { foreignKey: 'id_utilisateur' });

Devis.hasMany(LigneDevis, { foreignKey: 'id_devis' });
LigneDevis.belongsTo(Devis, { foreignKey: 'id_devis' });

LigneDevis.belongsTo(PrestationService, { foreignKey: 'id_prestation' });

Client.hasMany(Facture, { foreignKey: 'id_client' });
Facture.belongsTo(Client, { foreignKey: 'id_client' });

Devis.hasOne(Facture, { foreignKey: 'id_devis' });
Facture.belongsTo(Devis, { foreignKey: 'id_devis' });

module.exports = {
  Utilisateur,
  Client,
  PrestationService,
  Devis,
  LigneDevis,
  Facture
};
