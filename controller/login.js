const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');
const EleveModel = require('../models/eleveModel');
const ProfesseurModel = require('../models/professeurModel');
const cookieParser = require('cookie-parser');

// Fonction de login
exports.login = async (req, res) => {
  try {
    const { cle, email, password } = req.body;

    // Recherche de l'utilisateur dans les modèles User, Eleve et Professeur
    let user = await UserModel.findOne({ cle, email });
    if (!user) {
      user = await EleveModel.findOne({ cle, email });
    }
    if (!user) {
      user = await ProfesseurModel.findOne({ cle, email });
    }

    // Vérification si l'utilisateur existe
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed. User not found.' });
    }

    // Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
    }

    // Création du token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JSONWEBTOKEN, { expiresIn: '1d' });

    // Enregistrement du token dans les cookies
    res.cookie('token', token, { httpOnly: true });

    // Retourner la réponse avec le token et les informations de l'utilisateur (sans le mot de passe)
    const { password: userPassword, ...userData } = user.toObject(); // Exclure le mot de passe de l'objet user
    res.json({
      userId: user._id,
      token,
      message: 'Login successful',
      user: userData // Envoyer les données de l'utilisateur sans le mot de passe
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({message:'Error during login', error});
  }
};
