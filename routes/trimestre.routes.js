const express = require('express');
const router = express.Router();
const trimestreController = require('../controller/trimestreController');

// Route pour récupérer tous les trimestres
router.get('/trimestre', trimestreController.getAllTrimestres);

// Route pour créer un nouveau trimestre
router.post('/trimestre', trimestreController.createTrimestre);

// Route pour mettre a jou un trimestre
router.put('/trimestre/:id', trimestreController.updateTrimestre);

// Route pour récupérer un trimestre par ID
router.get('/trimestre/:id', trimestreController.getTrimestreById);

// Route pour supprimer un trimestre par ID
router.delete('/trimestre/:id', trimestreController.deleteTrimestre);

module.exports = router;

