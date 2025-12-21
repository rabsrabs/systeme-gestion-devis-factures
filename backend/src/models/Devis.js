const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Devis = sequelize.define('Devis', {
  id_devis: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero_devis: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  date_creation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  date_maj: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  date_validite: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  taux_tva: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 21.00
  },
  remise: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  statut: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'brouillon',
    validate: {
      isIn: [['brouillon', 'envoye', 'accepte', 'refuse', 'expire', 'facture']]
    }
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
  conditions_reglement: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  id_client: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_utilisateur: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'devis',
  timestamps: false
});

module.exports = Devis;
