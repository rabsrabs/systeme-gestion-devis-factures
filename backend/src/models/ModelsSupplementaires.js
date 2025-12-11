const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// ============================================
// LIGNE DEVIS
// ============================================
const LigneDevis = sequelize.define('LigneDevis', {
  id_ligne_devis: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_devis: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'devis', key: 'id_devis' }
  },
  id_prestation: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'prestation_service', key: 'id_prestation' }
  },
  ordre: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantite: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  prix_unitaire: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  montant_ligne: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  description_personnalisee: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  date_creation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'ligne_devis',
  timestamps: false
});

// ============================================
// SOUS LIGNE DEVIS
// ============================================
const SousLigneDevis = sequelize.define('SousLigneDevis', {
  id_sous_ligne_devis: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_ligne_devis: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'ligne_devis', key: 'id_ligne_devis' }
  },
  ordre: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  description_detaillee: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  note_complementaire: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  valeur_technique: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  date_creation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'sous_ligne_devis',
  timestamps: false
});

// ============================================
// DOCUMENT TECHNIQUE
// ============================================
const DocumentTechnique = sequelize.define('DocumentTechnique', {
  id_document: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_ligne_devis: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'ligne_devis', key: 'id_ligne_devis' }
  },
  nom_fichier: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  type_fichier: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  chemin_fichier: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  taille_fichier: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  date_upload: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'document_technique',
  timestamps: false
});

// ============================================
// FACTURE
// ============================================
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
  date_creation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  date_maj: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  date_echeance: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  statut: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['brouillon', 'emise', 'payee', 'partiellement_payee', 'annulee']]
    }
  },
  montant_ht: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  montant_tva: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  montant_ttc: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  montant_accompte: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  solde_restant: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  remise: {
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
  id_devis: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'devis', key: 'id_devis' }
  },
  id_client: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'client', key: 'id_client' }
  },
  id_utilisateur: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'utilisateur', key: 'id_utilisateur' }
  },
  envoyee_peppol: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  date_envoi_peppol: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'facture',
  timestamps: false
});

// ============================================
// NOTE DE CREDIT
// ============================================
const NoteCredit = sequelize.define('NoteCredit', {
  id_note_credit: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero_note_credit: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  id_facture: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'facture', key: 'id_facture' }
  },
  montant: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  motif: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date_emission: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  id_utilisateur: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'utilisateur', key: 'id_utilisateur' }
  }
}, {
  tableName: 'note_credit',
  timestamps: false
});

// ============================================
// PAIEMENT
// ============================================
const Paiement = sequelize.define('Paiement', {
  id_paiement: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_facture: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'facture', key: 'id_facture' }
  },
  id_client: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'client', key: 'id_client' }
  },
  date_paiement: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  montant: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  mode_paiement: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['virement', 'carte', 'especes', 'cheque', 'prelevement']]
    }
  },
  statut: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['en_attente', 'valide', 'rejete']]
    }
  },
  reference_paiement: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  id_utilisateur: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'utilisateur', key: 'id_utilisateur' }
  },
  date_creation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'paiement',
  timestamps: false
});

// ============================================
// NOTIFICATION
// ============================================
const Notification = sequelize.define('Notification', {
  id_notification: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      isIn: [['devis_cree', 'devis_envoye', 'devis_accepte', 'devis_refuse', 'facture_creee', 'facture_emise', 'paiement_recu', 'rappel_echeance']]
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  statut: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['non_lu', 'lu', 'archive']]
    }
  },
  date_envoi: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  mode_notification: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      isIn: [['systeme', 'email', 'sms']]
    }
  },
  id_utilisateur: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'utilisateur', key: 'id_utilisateur' }
  },
  id_devis: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'devis', key: 'id_devis' }
  },
  id_facture: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'facture', key: 'id_facture' }
  },
  id_paiement: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'paiement', key: 'id_paiement' }
  }
}, {
  tableName: 'notification',
  timestamps: false
});

module.exports = {
  LigneDevis,
  SousLigneDevis,
  DocumentTechnique,
  Facture,
  NoteCredit,
  Paiement,
  Notification
};
