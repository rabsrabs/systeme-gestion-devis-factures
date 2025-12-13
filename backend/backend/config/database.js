const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuration de la connexion PostgreSQL
const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'omc_db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: false,
    freezeTableName: true
  }
});

// Fonction pour tester la connexion
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à PostgreSQL réussie');
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion à PostgreSQL:', error.message);
    throw error;
  }
};

module.exports = {
  sequelize,
  testConnection
};
