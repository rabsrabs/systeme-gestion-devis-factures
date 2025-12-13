const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt');

const Utilisateur = sequelize.define('Utilisateur', {
  id_utilisateur: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    }
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
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  role: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['admin', 'gestionnaire', 'commercial', 'comptable']]
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
      utilisateur.date_modification = new Date();
    }
  }
});

// Méthode d'instance pour vérifier le mot de passe
Utilisateur.prototype.verifierMotDePasse = async function(motDePasse) {
  return await bcrypt.compare(motDePasse, this.mot_de_passe);
};

// Méthode pour obtenir l'utilisateur sans le mot de passe
Utilisateur.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.mot_de_passe;
  return values;
};

module.exports = Utilisateur;
