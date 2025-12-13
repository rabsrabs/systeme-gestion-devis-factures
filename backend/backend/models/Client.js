const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Client = sequelize.define('Client', {
  id_client: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  prenom: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  telephone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  adresse: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ville: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  code_postal: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  pays: {
    type: DataTypes.STRING(100),
    defaultValue: 'Belgique'
  },
  numero_tva: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  type_client: {
    type: DataTypes.ENUM('particulier', 'professionnel'),
    defaultValue: 'particulier'
  },
  actif: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  date_creation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'client',
  timestamps: false
});

module.exports = Client;
