const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Client = sequelize.define('Client', {
  id_client: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero_interne: {
    type: DataTypes.STRING(50),
    unique: true
  },
  societe: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  numero_tva: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  prenom: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  adresse_facturation: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  adresse_livraison: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  code_postal: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  ville: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  pays: {
    type: DataTypes.STRING(100),
    defaultValue: 'Belgique'
  },
  telephone: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  id_utilisateur: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'utilisateur',
      key: 'id_utilisateur'
    }
  },
  date_creation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  date_modification: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  actif: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'client',
  timestamps: false,
  hooks: {
    beforeUpdate: (client) => {
      client.date_modification = new Date();
    }
  }
});

module.exports = Client;
