const Utilisateur = require('../models/Utilisateur');
const Client = require('../models/Client');
const jwt = require('jsonwebtoken');

// Inscription
exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, mot_de_passe, role, telephone } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const utilisateurExistant = await Utilisateur.findOne({ where: { email } });
    if (utilisateurExistant) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }
    
    // Créer un client associé si le rôle est 'client'
    let id_client = null;
    if (role === 'client') {
      const client = await Client.create({
        nom,
        prenom,
        email,
        telephone
      });
      id_client = client.id_client;
    }
    
    // Créer l'utilisateur
    const utilisateur = await Utilisateur.create({
      nom,
      prenom,
      email,
      mot_de_passe,
      role: role || 'client',
      telephone,
      id_client
    });
    
    // Générer le token
    const token = generateToken(utilisateur.id_utilisateur);
    
    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: {
        id: utilisateur.id_utilisateur,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        role: utilisateur.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription',
      error: error.message
    });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;
    
    // Validation
    if (!email || !mot_de_passe) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }
    
    // Vérifier si l'utilisateur existe
    const utilisateur = await Utilisateur.findOne({ where: { email } });
    if (!utilisateur) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }
    
    // Vérifier le mot de passe
    const isMatch = await utilisateur.comparePassword(mot_de_passe);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }
    
    // Vérifier si le compte est actif
    if (!utilisateur.actif) {
      return res.status(401).json({
        success: false,
        message: 'Compte désactivé'
      });
    }
    
    // Mettre à jour la dernière connexion
    await utilisateur.update({ derniere_connexion: new Date() });
    
    // Générer le token
    const token = generateToken(utilisateur.id_utilisateur);
    
    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        id: utilisateur.id_utilisateur,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        role: utilisateur.role,
        id_client: utilisateur.id_client
      },
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
};

// Récupérer le profil de l'utilisateur connecté
exports.getMe = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.user.id_utilisateur, {
      attributes: { exclude: ['mot_de_passe'] },
      include: [{ model: Client }]
    });
    
    res.json({
      success: true,
      data: utilisateur
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil',
      error: error.message
    });
  }
};

// Mettre à jour le profil
exports.updateProfile = async (req, res) => {
  try {
    const { nom, prenom, telephone } = req.body;
    
    await req.user.update({
      nom,
      prenom,
      telephone
    });
    
    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil',
      error: error.message
    });
  }
};

// Changer le mot de passe
exports.changePassword = async (req, res) => {
  try {
    const { ancien_mot_de_passe, nouveau_mot_de_passe } = req.body;
    
    // Vérifier l'ancien mot de passe
    const utilisateur = await Utilisateur.findByPk(req.user.id_utilisateur);
    const isMatch = await utilisateur.comparePassword(ancien_mot_de_passe);
    
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Ancien mot de passe incorrect'
      });
    }
    
    // Mettre à jour le mot de passe
    await utilisateur.update({ mot_de_passe: nouveau_mot_de_passe });
    
    res.json({
      success: true,
      message: 'Mot de passe modifié avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors du changement de mot de passe',
      error: error.message
    });
  }
};

// Fonction helper pour générer un token JWT
function generateToken(id) {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'votre_secret_jwt_super_securise',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
}

module.exports = exports;
