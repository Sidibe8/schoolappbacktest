// roleModel.js

const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  }
});

const RoleModel = mongoose.model('Role', roleSchema);

module.exports = RoleModel;
