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
    allowNull: false
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
    validate: {
      isIn: [['brouillon', 'envoye', 'accepte', 'refuse', 'expire']]
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
    allowNull: false,
    references: {
      model: 'client',
      key: 'id_client'
    }
  },
  id_utilisateur: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'utilisateur',
      key: 'id_utilisateur'
    }
  }
}, {
  tableName: 'devis',
  timestamps: false,
  hooks: {
    beforeUpdate: (devis) => {
      devis.date_maj = new Date();
    }
  }
});

// Méthode pour calculer les montants
Devis.prototype.calculerMontants = function() {
  const montantHT = parseFloat(this.montant_ht) - parseFloat(this.remise);
  const montantTVA = (montantHT * parseFloat(this.taux_tva)) / 100;
  const montantTTC = montantHT + montantTVA;
  
  this.montant_tva = montantTVA.toFixed(2);
  this.montant_ttc = montantTTC.toFixed(2);
};

module.exports = Devis;
