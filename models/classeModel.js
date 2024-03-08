// classeModel.js

const mongoose = require('mongoose');

const classeSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  coefInfo: [{
    
    matiere: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Matiere',
        required: true
      },
      coef: {
        type: Number,
        required: true
      }
    }]
}, { timestamps: true });

const ClasseModel = mongoose.model('Classe', classeSchema);

module.exports = ClasseModel;
