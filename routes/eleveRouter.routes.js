const express = require('express');
const { createEleve, getAllEleves, getEleveById, updateEleveById, deleteEleveById } = require('../controller/eleveController');
const router = express.Router();

// Créer un élève
router.post('/eleves', createEleve);

// Récupérer tous les élèves
router.get('/eleves', getAllEleves);

// Récupérer un élève par son ID
router.get('/eleves/:id', getEleveById);

// Mettre à jour un élève par son ID
router.put('/eleves/:id', updateEleveById);

// Supprimer un élève par son ID
router.delete('/eleves/:id', deleteEleveById);

module.exports = router;
