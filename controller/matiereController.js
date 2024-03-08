// matiereController.js

const MatiereModel = require('../models/matiereModel');

// Créer une matière
exports.createMatiere = async (req, res) => {
  try {
    const { nom } = req.body;
    const matiere = new MatiereModel({ nom });
    await matiere.save();
    res.status(201).send(matiere);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Récupérer toutes les matières
exports.getAllMatieres = async (req, res) => {
  try {
    const matieres = await MatiereModel.find();
    res.send(matieres);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Récupérer une matière par son ID
exports.getMatiereById = async (req, res) => {
  try {
    const matiere = await MatiereModel.findById(req.params.id);
    if (!matiere) {
      return res.status(404).send();
    }
    res.send(matiere);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Mettre à jour une matière par son ID
exports.updateMatiereById = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['nom'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Mise à jour invalide !' });
  }

  try {
    const matiere = await MatiereModel.findById(req.params.id);
    if (!matiere) {
      return res.status(404).send();
    }

    updates.forEach((update) => {
      matiere[update] = req.body[update];
    });
    await matiere.save();
    res.send(matiere);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Supprimer une matière par son ID
exports.deleteMatiereById = async (req, res) => {
  try {
    const matiere = await MatiereModel.findByIdAndDelete(req.params.id);
    if (!matiere) {
      return res.status(404).send();
    }
    res.send(matiere);
  } catch (error) {
    res.status(500).send(error);
  }
};


// Supprimer toutes les notes des élèves ayant une certaine matière
exports.deleteNotesByMatiereId = async (req, res) => {
  try {
    const matiereId = req.params.id;
    const result = await EleveModel.updateMany(
      { 'notes.matiere': matiereId }, // Critère de recherche
      { $pull: { 'notes': { matiere: matiereId } } } // Mise à jour pour retirer les notes de cette matière
    );
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};