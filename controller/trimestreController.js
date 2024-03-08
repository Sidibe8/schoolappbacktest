const TrimestreModel = require('../models/trimestreModel');

// Controller pour créer un trimestre
exports.createTrimestre = async (req, res) => {
  try {
    const { nom } = req.body;

    // Créer un nouveau trimestre
    const nouveauTrimestre = new TrimestreModel({ nom });

    // Enregistrer le nouveau trimestre dans la base de données
    await nouveauTrimestre.save();

    res.status(201).json({ message: 'Trimestre créé avec succès.', trimestre: nouveauTrimestre });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du trimestre', message: error.message });
  }
};

// Controller pour récupérer tous les trimestres
exports.getAllTrimestres = async (req, res) => {
  try {
    const trimestres = await TrimestreModel.find();
    res.json(trimestres);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des trimestres', message: error.message });
  }
};

// Controller pour récupérer un trimestre par son ID
exports.getTrimestreById = async (req, res) => {
  const trimestreId = req.params.trimestreId;
  
  try {
    const trimestre = await TrimestreModel.findById(trimestreId);
    if (!trimestre) {
      return res.status(404).json({ message: "Trimestre non trouvé." });
    }
    res.json(trimestre);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du trimestre', message: error.message });
  }
};

// Controller pour mettre à jour un trimestre
exports.updateTrimestre = async (req, res) => {
  try {
    // Récupérer les données mises à jour du trimestre à partir du corps de la requête
    const { nom } = req.body;

    // Vérifier si le trimestre existe en utilisant son ID
    const trimestre = await TrimestreModel.findById(req.params.id);
    if (!trimestre) {
      return res.status(404).json({ message: "Trimestre non trouvé." });
    }

    // Mettre à jour les données du trimestre avec les nouvelles données
    trimestre.nom = nom;

    // Enregistrer les modifications dans la base de données
    await trimestre.save();

    // Répondre avec le trimestre mis à jour
    res.json({ message: 'Trimestre mis à jour avec succès.', trimestre });
  } catch (error) {
    // Gérer les erreurs
    res.status(500).json({ error: 'Erreur lors de la mise à jour du trimestre', message: error.message });
  }
};

// Controller pour supprimer un trimestre
exports.deleteTrimestre = async (req, res) => {
  // const trimestreId = req.params.trimestreId;

  // console.log("ID:",trimestreId);
  
  try {
    // Supprimer le trimestre de la base de données
    const deletedTrimestre = await TrimestreModel.findByIdAndDelete(req.params.id);
    if (!deletedTrimestre) {
      return res.status(404).json({ message: "Trimestre non trouvé." });
    }
    res.json({ message: 'Trimestre supprimé avec succès.', trimestre: deletedTrimestre });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du trimestre', message: error.message });
  }
};
