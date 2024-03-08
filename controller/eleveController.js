const bcrypt = require('bcrypt');
const EleveModel = require('../models/eleveModel');

exports.createEleve = async (req, res) => {
  try {
    const { nom, surnom, email, numero, nomDuPere, nomDuMere, numeroParent, classe, password } = req.body;

    // Vérifier si un élève avec le même email ou le même numéro existe déjà
    const existingEleve = await EleveModel.findOne({ $or: [{ email }, { numero }] });
    if (existingEleve) {
      return res.status(400).json({ error: 'Un élève avec le même email ou le même numéro existe déjà' });
    }

    // Génération automatique de la clé à partir des informations de l'élève
    let cle;
    let existingEleveCle;
    do {
      cle = `${nom.substring(0, 3)}${surnom.substring(0, 3)}${numero.toString().substring(0, 2)}-${Math.floor(1000 + Math.random() * 9000)}`;
      existingEleveCle = await EleveModel.findOne({ cle });
    } while (existingEleveCle);

    // Hash du mot de passe avec bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const eleve = new EleveModel({
      nom,
      surnom,
      email,
      numero,
      nomDuPere,
      nomDuMere,
      numeroParent,
      classe,
      cle,
      password: hashedPassword // Stocker le mot de passe haché
    });

    await eleve.save();
    res.status(201).json({ message: 'Élève créé avec succès', eleve });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Impossible de créer l\'élève', message: error.message });
  }
};


// Récupérer tous les élèves
exports.getAllEleves = async (req, res) => {
  try {
    const eleves = await EleveModel.find().populate({
      path: 'classe',
      select: 'nom', // Sélectionnez les champs que vous souhaitez afficher de la classe
    }).populate({
      path: 'notes.matiere',
      select: 'nom', // Sélectionnez les champs que vous souhaitez afficher de la matière
    });
    res.json(eleves);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des élèves', message: error.message });
  }
};

// Récupérer un élève par son ID
exports.getEleveById = async (req, res) => {
  try {
    const eleve = await EleveModel.findById(req.params.id).populate({
      path: 'classe',
      select: 'nom', // Sélectionnez les champs que vous souhaitez afficher de la classe
    }).populate({
      path: 'notes.matiere',
      select: 'nom', // Sélectionnez les champs que vous souhaitez afficher de la matière
    });
    if (!eleve) {
      return res.status(404).json({ message: 'Aucun élève trouvé avec cet ID' });
    }
    res.json(eleve);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'élève', message: error.message });
  }
};

// Mettre à jour un élève par son ID
exports.updateEleveById = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['nom', 'surnom', 'email', 'numero', 'nomDuPere', 'nomDuMere', 'numeroParent', 'classe', 'password'];

  // Vérifie si toutes les mises à jour demandées sont autorisées
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Mise à jour invalide !' });
  }

  try {
    // Cherche l'élève par son ID
    const eleve = await EleveModel.findById(req.params.id);
    if (!eleve) {
      return res.status(404).json({ message: 'Aucun élève trouvé avec cet ID' });
    }

    // Met à jour chaque champ de l'élève avec les données envoyées dans le corps de la requête
    updates.forEach((update) => {
      eleve[update] = req.body[update];
    });

    // Vérifier si le mot de passe est inclus dans les mises à jour
    if (updates.includes('password')) {
      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(req.body.password, 10); // 10 est le nombre de tours de hachage

      // Mettre à jour le mot de passe haché dans l'objet eleve
      eleve.password = hashedPassword;
    }

    // Sauvegarde les modifications de l'élève
    await eleve.save();
    
    // Retourne la réponse avec un message de succès et les données de l'élève mis à jour
    res.json({ message: 'Élève mis à jour avec succès', eleve });
  } catch (error) {
    // En cas d'erreur, renvoie une réponse avec le message d'erreur approprié
    res.status(400).json({ error: 'Impossible de mettre à jour l\'élève', message: error.message });
  }
};

// Supprimer un élève par son ID
exports.deleteEleveById = async (req, res) => {
  try {
    const eleve = await EleveModel.findByIdAndDelete(req.params.id);
    if (!eleve) {
      return res.status(404).json({ message: 'Aucun élève trouvé avec cet ID' });
    }
    res.json({ message: 'Élève supprimé avec succès', eleve });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'élève', message: error.message });
  }
};



