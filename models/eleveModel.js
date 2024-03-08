const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const eleveSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  surnom: String,
  email: {
    type: String,
    // required: true
  },
  numero: {
    type: Number,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  nomDuPere: String,
  nomDuMere: String,
  numeroParent: Number,
  classe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classe',
    required: true
  },
  cle: {
    type: String,
    unique: true 
  },
  role: {
    type: String,
    default: 'eleve' 
  },
  notes: [{
    trimestre: {
      type: mongoose.Schema.Types.ObjectId, 
      ref:'Trimestre',
      required: true
    },
    matiere: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Matiere',
      required: true
    },
    notesDevoir: Number, 
    noteCompo: Number
  }]
}, { timestamps: true, strictPopulate: false  });


const EleveModel = mongoose.model('Eleve', eleveSchema);

module.exports = EleveModel;
