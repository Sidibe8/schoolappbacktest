// userRouter.js

const express = require('express');
const router = express.Router();
const userController = require('../controller/auth.index');

// Créer un utilisateur
router.post('/users', userController.createUser);

// Récupérer tous les utilisateurs
router.get('/users', userController.getAllUsers);

// Récupérer un utilisateur par son ID
router.get('/users/:id', userController.getUserById);

// Mettre à jour un utilisateur par son ID
router.put('/users/:id', userController.updateUserById);

// Supprimer un utilisateur par son ID
router.delete('/users/:id', userController.deleteUserById);

module.exports = router;
