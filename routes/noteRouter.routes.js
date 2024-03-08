// noteRouter.js

const express = require('express');
const router = express.Router();
const noteController = require('../controller/noteController');

router.post('/notes', noteController.createNote);
router.get('/notes', noteController.getAllNotesByEleveId);
router.get('/notes/:id/matieres', noteController.getNotesByMatiereId);
// router.patch('/notes/:id', noteController.updateNoteById);
// router.delete('/notes/:id', noteController.deleteNoteById);

module.exports = router;
