const jwt = require('jsonwebtoken');
const { Utilisateur } = require('../models');

class AuthService {
  /**
   * Connexion d'un utilisateur
   */
  async login(email, motDePasse) {
    // Rechercher l'utilisateur
    const utilisateur = await Utilisateur.findOne({
      where: { email, actif: true }
    });

    if (!utilisateur) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    const motDePasseValide = await utilisateur.verifierMotDePasse(motDePasse);
    
    if (!motDePasseValide) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Générer le token JWT
    const token = this.genererToken(utilisateur);

    return {
      token,
      utilisateur: {
        id_utilisateur: utilisateur.id_utilisateur,
        nom: utilisateur.nom,
        email: utilisateur.email,
        role: utilisateur.role
      }
    };
  }

  /**
   * Inscription d'un nouvel utilisateur (admin uniquement)
   */
  async register(donnees) {
    // Vérifier si l'email existe déjà
    const utilisateurExistant = await Utilisateur.findOne({
      where: { email: donnees.email }
    });

    if (utilisateurExistant) {
      throw new Error('Cet email est déjà utilisé');
    }

    // Créer le nouvel utilisateur
    const utilisateur = await Utilisateur.create({
      nom: donnees.nom,
      email: donnees.email,
      mot_de_passe: donnees.mot_de_passe,
      role: donnees.role || 'commercial'
    });

    return {
      id_utilisateur: utilisateur.id_utilisateur,
      nom: utilisateur.nom,
      email: utilisateur.email,
      role: utilisateur.role
    };
  }

  /**
   * Générer un token JWT
   */
  genererToken(utilisateur) {
    const payload = {
      id: utilisateur.id_utilisateur,
      email: utilisateur.email,
      role: utilisateur.role
    };

    return jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret_key_default',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
  }

  /**
   * Vérifier et décoder un token JWT
   */
  verifierToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'secret_key_default');
    } catch (error) {
      throw new Error('Token invalide ou expiré');
    }
  }

  /**
   * Obtenir le profil de l'utilisateur connecté
   */
  async getProfile(userId) {
    const utilisateur = await Utilisateur.findByPk(userId);

    if (!utilisateur) {
      throw new Error('Utilisateur non trouvé');
    }

    return utilisateur;
  }

  /**
   * Mettre à jour le mot de passe
   */
  async updatePassword(userId, ancienMotDePasse, nouveauMotDePasse) {
    const utilisateur = await Utilisateur.findByPk(userId);

    if (!utilisateur) {
      throw new Error('Utilisateur non trouvé');
    }

    // Vérifier l'ancien mot de passe
    const motDePasseValide = await utilisateur.verifierMotDePasse(ancienMotDePasse);
    
    if (!motDePasseValide) {
      throw new Error('Ancien mot de passe incorrect');
    }

    // Mettre à jour le mot de passe
    utilisateur.mot_de_passe = nouveauMotDePasse;
    await utilisateur.save();

    return { message: 'Mot de passe mis à jour avec succès' };
  }
}

module.exports = new AuthService();
