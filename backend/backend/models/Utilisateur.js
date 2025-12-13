const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const Utilisateur = sequelize.define('Utilisateur', {
  id_utilisateur: {
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
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  mot_de_passe: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'client'),
    defaultValue: 'client'
  },
  telephone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  actif: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  derniere_connexion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  date_creation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  id_client: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'client',
      key: 'id_client'
    }
  }
}, {
  tableName: 'utilisateur',
  timestamps: false,
  hooks: {
    beforeCreate: async (utilisateur) => {
      if (utilisateur.mot_de_passe) {
        const salt = await bcrypt.genSalt(10);
        utilisateur.mot_de_passe = await bcrypt.hash(utilisateur.mot_de_passe, salt);
      }
    },
    beforeUpdate: async (utilisateur) => {
      if (utilisateur.changed('mot_de_passe')) {
        const salt = await bcrypt.genSalt(10);
        utilisateur.mot_de_passe = await bcrypt.hash(utilisateur.mot_de_passe, salt);
      }
    }
  }
});

// Méthode pour comparer le mot de passe
Utilisateur.prototype.comparePassword = async function(motDePasse) {
  return await bcrypt.compare(motDePasse, this.mot_de_passe);
};

module.exports = Utilisateur;
