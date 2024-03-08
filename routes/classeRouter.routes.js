// classeRouter.js

const express = require('express');
const router = express.Router();
const classeController = require('../controller/classeModel');

router.post('/classes', classeController.createClasse);
router.get('/classes', classeController.getAllClasses);
router.get('/classes/:id', classeController.getClasseById);
router.put('/classes/:id', classeController.updateClasseById);


// Route pour ajouter un coefficient à une matière dans une classe
router.put('/classe/:id/add-matiere', classeController.addMatiereWithCoef);
// Route pour mettre à jour le coefficient d'une matière dans une classe
router.put('/classe/:id/update-coef', classeController.updateCoef);
// Route pour supprimer le coefficient d'une matière dans une classe
router.delete('/classe/:id/delete-coef', classeController.deleteCoef);



// delete classes by id 
router.delete('/classes/:id', classeController.deleteClasseWithRelatedData);
// router.delete('/classes/:id', classeController.deleteClasseById);

router.get('/eleves/classe/:classeId', classeController.getElevesByClasse);
// Route pour récupérer tous les enseignants d'une classe
router.get('/professeurs/classe/:classeId', classeController.getProfesseursByClasse);

module.exports = router;
