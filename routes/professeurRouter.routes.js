// professeurRouter.js

const express = require('express');
const router = express.Router();
const professeurController = require('../controller/professeurController');

router.post('/professeurs', professeurController.createProfesseur);
router.get('/professeurs', professeurController.getAllProfesseurs);
router.get('/professeurs/:id', professeurController.getProfesseurById);
router.put('/professeurs/:id', professeurController.updateProfesseurById);
router.delete('/professeurs/:id', professeurController.deleteProfesseurById);

module.exports = router;
