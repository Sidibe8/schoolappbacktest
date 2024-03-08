// matiereModel.js

const mongoose = require('mongoose');

const matiereSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
}, { timestamps: true });

const MatiereModel = mongoose.model('Matiere', matiereSchema);

module.exports = MatiereModel;
