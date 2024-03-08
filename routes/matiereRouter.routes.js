// matiereRouter.js

const express = require('express');
const router = express.Router();
const matiereController = require('../controller/matiereController');

router.post('/matieres', matiereController.createMatiere);
router.get('/matieres', matiereController.getAllMatieres);
router.get('/matieres/:id', matiereController.getMatiereById);
router.put('/matieres/:id', matiereController.updateMatiereById);
router.delete('/matieres/:id', matiereController.deleteMatiereById);
router.delete('/matieres/:id/delete-notes', matiereController.deleteNotesByMatiereId);

module.exports = router;
