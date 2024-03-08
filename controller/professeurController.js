// professeurController.js

const bcrypt = require('bcrypt');
const ProfesseurModel = require('../models/professeurModel');

// Créer un professeur
exports.createProfesseur = async (req, res) => {
  try {
    const { nom, surnom, email, number, adresse, matieres, classes, password } = req.body;

    // Vérifier si un professeur avec le même email existe déjà
    const existingProfesseur = await ProfesseurModel.findOne({ email });
    if (existingProfesseur) {
      return res.status(400).json({ message: 'Un professeur avec cet email existe déjà' });
    }

    // Vérifier si une matière a déjà un enseignant associé
    // for (const matiereId of matieres) {
    //   const existingProfesseurForMatiere = await ProfesseurModel.findOne({ matieres: matiereId });
    //   if (existingProfesseurForMatiere) {
    //     return res.status(400).json({ message: `La matière avec l'ID ${matiereId} a déjà un enseignant associé` });
    //   }
    // }

    // Vérifier si une clé générée aléatoirement existe déjà
    let cle;
    let existingProfesseurCle;
    do {

      
      cle = `${nom.substring(0, 3)}${surnom.substring(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`;


      existingProfesseurCle = await ProfesseurModel.findOne({ cle });
    } while (existingProfesseurCle);

    // Hash du mot de passe avec bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    const professeur = new ProfesseurModel({
      nom,
      surnom,
      email,
      number,
      adresse,
      matieres,
      classes,
      cle,
      password: hashedPassword
    });

    await professeur.save();
    res.status(201).json({ professeur });
  } catch (error) {
    res.status(400).json({ error });
  }
};


// Récupérer tous les professeurs
exports.getAllProfesseurs = async (req, res) => {
  try {
    const professeurs = await ProfesseurModel.find()
      .populate({
        path: 'classes',
        select: 'nom', // Sélectionnez les champs que vous souhaitez afficher de la classe
      })
      .populate({
        path: 'matieres',
        select: 'nom', // Sélectionnez les champs que vous souhaitez afficher de la matière
      });
    res.json({ professeurs });
  } catch (error) {
    res.status(500).json(error);
  }
};


// Récupérer un professeur par son ID
exports.getProfesseurById = async (req, res) => {
  try {
    const professeur = await ProfesseurModel.findById(req.params.id).populate({
      path: 'classes',
      select: 'nom', // Sélectionnez les champs que vous souhaitez afficher de la classe
    })
    .populate({
      path: 'matieres',
      select: 'nom', // Sélectionnez les champs que vous souhaitez afficher de la matière
    });
    if (!professeur) {
      return res.status(404).json();
    }
    res.json({professeur});
  } catch (error) {
    res.status(500).json(error);
  }
};

// Mettre à jour un professeur par son ID
exports.updateProfesseurById = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['nom', 'surnom', 'email', 'number', 'adresse', 'password', 'matieres', 'classes'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Mise à jour invalide !' });
  }

  try {
    const professeur = await ProfesseurModel.findById(req.params.id);
    if (!professeur) {
      return res.status(404).json();
    }

    updates.forEach((update) => {
      // Vérifie si l'update est le mot de passe et le hache
      if (update === 'password') {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
      }
      professeur[update] = req.body[update];
    });
    await professeur.save();
    res.json({ professeur });
  } catch (error) {
    res.status(400).json(error);
  }
};

// Supprimer un professeur par son ID
exports.deleteProfesseurById = async (req, res) => {
  try {
    const professeur = await ProfesseurModel.findByIdAndDelete(req.params.id);
    if (!professeur) {
      return res.status(404).json();
    }
    res.json(professeur);
  } catch (error) {
    res.status(500).json({error});
  }
};
