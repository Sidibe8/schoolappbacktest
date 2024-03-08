const mongoose = require('mongoose');

const trimestreSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
 
}, { timestamps: true });

const trimestreModel = mongoose.model('Trimestre', trimestreSchema);

module.exports = trimestreModel;
