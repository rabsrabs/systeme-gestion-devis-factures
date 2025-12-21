const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Facture = sequelize.define('Facture', {
  id_facture: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero_facture: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  date_emission: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  date_echeance: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  statut_paiement: {
    type: DataTypes.ENUM('non_payee', 'partielle', 'payee', 'en_retard'),
    defaultValue: 'non_payee'
  },
  montant_ht: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  montant_tva: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  montant_ttc: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  montant_paye: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  montant_restant: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  remise: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  conditions_paiement: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  id_client: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  id_devis: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  id_utilisateur: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'facture',
  timestamps: false
});

module.exports = Facture;
