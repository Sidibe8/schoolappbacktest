const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const professeurSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  surnom: String,
  email: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    require: true
  },
  adresse: String,
  matieres: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Matiere'
  }],
  classes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classe'
  }],
  cle: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'teacher'
  }
}, { timestamps: true , strictPopulate: false});

const ProfesseurModel = mongoose.model('Professeur', professeurSchema);

module.exports = ProfesseurModel;
