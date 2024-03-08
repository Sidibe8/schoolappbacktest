// ./config/DB.js
const mongoose = require("mongoose");

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("Connexion à MongoDB établie avec succès.");
  } catch (error) {
    console.error("Erreur de connexion à MongoDB :", error.message);
  }
};

module.exports = db;
