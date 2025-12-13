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
    allowNull: false
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
    allowNull: false,
    references: {
      model: 'client',
      key: 'id_client'
    }
  },
  id_devis: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'devis',
      key: 'id_devis'
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
  tableName: 'facture',
  timestamps: false
});

// Méthode pour calculer les montants
Facture.prototype.calculerMontants = function() {
  const montantHT = parseFloat(this.montant_ht) - parseFloat(this.remise);
  const montantTVA = (montantHT * 21) / 100;
  const montantTTC = montantHT + montantTVA;
  const montantRestant = montantTTC - parseFloat(this.montant_paye);
  
  this.montant_tva = montantTVA.toFixed(2);
  this.montant_ttc = montantTTC.toFixed(2);
  this.montant_restant = montantRestant.toFixed(2);
  
  // Mise à jour du statut de paiement
  if (montantRestant <= 0) {
    this.statut_paiement = 'payee';
  } else if (this.montant_paye > 0) {
    this.statut_paiement = 'partielle';
  }
};

module.exports = Facture;
