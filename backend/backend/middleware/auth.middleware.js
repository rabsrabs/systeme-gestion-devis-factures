const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/Utilisateur');

// Protéger les routes (vérifier le token JWT)
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Récupérer le token depuis le header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Vérifier si le token existe
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé - Token manquant'
      });
    }
    
    try {
      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'votre_secret_jwt_super_securise');
      
      // Récupérer l'utilisateur
      const utilisateur = await Utilisateur.findByPk(decoded.id, {
        attributes: { exclude: ['mot_de_passe'] }
      });
      
      if (!utilisateur) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }
      
      if (!utilisateur.actif) {
        return res.status(401).json({
          success: false,
          message: 'Compte désactivé'
        });
      }
      
      // Ajouter l'utilisateur à la requête
      req.user = utilisateur;
      next();
      
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'authentification'
    });
  }
};

// Autoriser certains rôles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Le rôle ${req.user.role} n'est pas autorisé à accéder à cette ressource`
      });
    }
    next();
  };
};

module.exports = exports;
