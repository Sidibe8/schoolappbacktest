
const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');


exports.createUser = async (req, res) => {
  try {
    const { nom, prenom, adresse, email, numero, password } = req.body;

    // Vérifier si une clé générée aléatoirement existe déjà
    let cle;
    let existingUserCle;
    do {
      cle = `${nom.substring(0, 2)}${prenom.substring(2, 3)}-LP-${numero.toString().substring(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`;
      existingUserCle = await UserModel.findOne({ cle });
    } while (existingUserCle);

    // Hash du mot de passe avec bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      nom,
      prenom,
      adresse,
      email,
      numero,
      cle,
      password: hashedPassword, // Stocker le mot de passe haché
    });

    await user.save();
    res.status(201).json({ user });
  } catch (error) {
    console.log("Error: ",error);
    res.status(400).json({ error });
  }
};
  
// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json({users});
  } catch (error) {
    res.status(500).json({error});
  }
};

// Récupérer un utilisateur par son ID
exports.getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }
    res.json({user});
  } catch (error) {
    res.status(500).json({error});
  }
};

// Mettre à jour un utilisateur par son ID
exports.updateUserById = async (req, res) => {
  const updates = Object.keys(req.body);
  console.log(updates, 'updateUserById');
  const allowedUpdates =['nom', 'email', 'prenom', 'numero', 'adresse', 'password'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Mise à jour invalide !' });
  }

  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found"});
    }

    updates.forEach((update) => {
      if(update === 'password'){
        const salt =  bcrypt.genSalt(10);
        user[update] = bcrypt.hash(req.body[update], salt);
      } else {
        user[update] = req.body[update];
      }
    });
    await user.save();
    res.json({user});
  } catch (error) {
    res.status(400).send(error);
  }
};

// Supprimer un utilisateur par son ID
exports.deleteUserById = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }
    res.json({user});
  } catch (error) {
    res.status(500).json({error});
  }
};
