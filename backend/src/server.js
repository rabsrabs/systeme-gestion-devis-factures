require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { testConnection } = require('./config/database');

// Routes
const authRoutes = require('./routes/auth.routes');
const clientRoutes = require('./routes/client.routes');
const devisRoutes = require('./routes/devis.routes');
const factureRoutes = require('./routes/facture.routes');
const paiementRoutes = require('./routes/paiement.routes');
const prestationRoutes = require('./routes/prestation.routes');
const notificationRoutes = require('./routes/notification.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARES
// ============================================
app.use(helmet()); // Sécurité des headers HTTP
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logging des requêtes

// ============================================
// ROUTES
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API OMC fonctionnelle' });
});

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/devis', devisRoutes);
app.use('/api/factures', factureRoutes);
app.use('/api/paiements', paiementRoutes);
app.use('/api/prestations', prestationRoutes);
app.use('/api/notifications', notificationRoutes);

// ============================================
// GESTION DES ERREURS
// ============================================
app.use((err, req, res, next) => {
  console.error('Erreur:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur interne du serveur';
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Route 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// ============================================
// DÉMARRAGE DU SERVEUR
// ============================================
const startServer = async () => {
  try {
    // Test de connexion à la base de données
    await testConnection();
    
    // Démarrage du serveur
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║   🚀 Serveur OMC démarré              ║
║   📡 Port: ${PORT}                        ║
║   🌍 Environnement: ${process.env.NODE_ENV || 'development'}      ║
║   📊 API: http://localhost:${PORT}/api    ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Erreur au démarrage:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
