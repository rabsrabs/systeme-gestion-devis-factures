const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Utilisateur, Client } = require('../models');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, mot_de_passe, telephone, role, adresse, ville, code_postal, numero_tva, type_client } = req.body;

    const existingUser = await Utilisateur.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé' });
    }

    const utilisateur = await Utilisateur.create({
      nom,
      prenom,
      email,
      mot_de_passe: mot_de_passe,
      telephone,
      role: role || 'client'
    });

    let client = null;
    if (role === 'client' || !role) {
      client = await Client.create({
        nom,
        prenom,
        email,
        telephone,
        adresse,
        ville,
        code_postal,
        numero_tva,
        type_client: type_client || 'particulier',
        id_utilisateur: utilisateur.id_utilisateur
      });
    }

    const token = generateToken(utilisateur.id_utilisateur);

    res.status(201).json({
      success: true,
      token,
      data: {
        id_utilisateur: utilisateur.id_utilisateur,
        id_client: client?.id_client,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        role: utilisateur.role
      }
    });
  } catch (error) {
    console.error('Erreur register:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'inscription', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;
    
    console.log('=== DEBUG LOGIN ===');
    console.log('Email reçu:', email);
    console.log('Mot de passe reçu:', mot_de_passe);

    const utilisateur = await Utilisateur.findOne({ where: { email } });
    if (!utilisateur) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
    }
    
    console.log('Mot de passe en DB:', utilisateur.mot_de_passe);

    const isMatch = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
    console.log('Résultat comparaison:', isMatch);
    
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
    }

    const client = await Client.findOne({ where: { email } });

    const token = generateToken(utilisateur.id_utilisateur);

    res.json({
      success: true,
      token,
      data: {
        id_utilisateur: utilisateur.id_utilisateur,
        id_client: client?.id_client,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        role: utilisateur.role
      }
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la connexion', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.user.id_utilisateur);
    const client = await Client.findOne({ where: { email: utilisateur.email } });
    
    res.json({
      success: true,
      data: {
        ...utilisateur.toJSON(),
        id_client: client?.id_client
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = exports;
