const express = require('express');
const { body, validationResult } = require('express-validator');
const authService = require('../services/auth.service');
const { authentification } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Connexion utilisateur
 * @access  Public
 */
router.post('/login',
  [
    body('email').isEmail().withMessage('Email invalide'),
    body('mot_de_passe').notEmpty().withMessage('Mot de passe requis')
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { email, mot_de_passe } = req.body;
      const result = await authService.login(email, mot_de_passe);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }
);

/**
 * @route   POST /api/auth/register
 * @desc    Inscription utilisateur (admin uniquement)
 * @access  Private (Admin)
 */
router.post('/register',
  authentification,
  [
    body('nom').notEmpty().withMessage('Nom requis'),
    body('email').isEmail().withMessage('Email invalide'),
    body('mot_de_passe')
      .isLength({ min: 6 })
      .withMessage('Mot de passe minimum 6 caractères'),
    body('role')
      .isIn(['admin', 'gestionnaire', 'commercial', 'comptable'])
      .withMessage('Rôle invalide')
  ],
  async (req, res, next) => {
    try {
      // Vérifier que l'utilisateur est admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Accès refusé. Droits administrateur requis.'
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const utilisateur = await authService.register(req.body);

      res.status(201).json({
        success: true,
        data: utilisateur
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);

/**
 * @route   GET /api/auth/profile
 * @desc    Obtenir le profil de l'utilisateur connecté
 * @access  Private
 */
router.get('/profile', authentification, async (req, res, next) => {
  try {
    const utilisateur = await authService.getProfile(req.user.id);

    res.json({
      success: true,
      data: utilisateur
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   PUT /api/auth/password
 * @desc    Modifier le mot de passe
 * @access  Private
 */
router.put('/password',
  authentification,
  [
    body('ancien_mot_de_passe').notEmpty().withMessage('Ancien mot de passe requis'),
    body('nouveau_mot_de_passe')
      .isLength({ min: 6 })
      .withMessage('Nouveau mot de passe minimum 6 caractères')
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { ancien_mot_de_passe, nouveau_mot_de_passe } = req.body;
      const result = await authService.updatePassword(
        req.user.id,
        ancien_mot_de_passe,
        nouveau_mot_de_passe
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);

module.exports = router;
