// classeController.js

const ClasseModel = require('../models/classeModel');
const EleveModel = require('../models/eleveModel');
const ProfesseurModel = require('../models/professeurModel');

// Créer une classe
exports.createClasse = async (req, res) => {
  try {
    const { nom } = req.body;
    const classe = new ClasseModel({ nom });
    await classe.save();
    res.status(201).send(classe);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.addMatiereWithCoef = async (req, res) => {
  try {
    const { classeId, matiereId, coef } = req.body;

    // Vérifier si la classe existe
    const classe = await ClasseModel.findById(classeId);
    if (!classe) {
      return res.status(404).json({ error: 'Classe not found' });
    }

    // Rechercher la matière dans la classe
    const existingMatiereIndex = classe.coefInfo.findIndex(info => info.matiere.toString() === matiereId);

    // Si la matière existe déjà, mettre à jour son coefficient
    if (existingMatiereIndex !== -1) {
      classe.coefInfo[existingMatiereIndex].coef = coef;
    } else {
      // Ajouter la matière avec le coefficient à la classe si elle n'existe pas encore
      classe.coefInfo.push({ matiere: matiereId, coef: coef });
    }

    await classe.save();

    res.status(200).json({ message: 'Matiere added with coefficient successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer toutes les classes
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await ClasseModel.find().populate({
      path: 'coefInfo.matiere', // Utilisez le bon chemin vers le champ matieres
      select: 'nom coef', // Sélectionnez le nom et le coef de la matière
    });
    res.json({classes});
  } catch (error) {
    res.status(500).send(error);
  }
};

// Récupérer une classe par son ID
exports.getClasseById = async (req, res) => {
  try {
    const classe = await ClasseModel.findById(req.params.id).populate({
      path: 'coefInfo.matiere', // Utilisez le bon chemin vers le champ matieres
      select: 'nom coef', // Sélectionnez le nom et le coef de la matière
    });
    
    if (!classe) {
      return res.status(404).json({ message: 'Classe non introuvable' });
    }
    res.json({ classe });
  } catch (error) {
    res.status(500).send(error);
  }
};



// Mettre à jour une classe par son ID
exports.updateClasseById = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['nom'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Mise à jour invalide !' });
  }

  try {
    const classe = await ClasseModel.findById(req.params.id);
    if (!classe) {
      return res.status(404).send();
    }

    updates.forEach((update) => {
      classe[update] = req.body[update];
    });
    await classe.save();
    res.send(classe);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Supprimer une classe par son ID
exports.deleteClasseById = async (req, res) => {
  try {
    const classe = await ClasseModel.findByIdAndDelete(req.params.id);
    if (!classe) {
      return res.status(404).send();
    }
    res.send(classe);
  } catch (error) {
    res.status(500).send(error);
  }
};



/* autre controller */

// Contrôleur pour récupérer tous les élèves d'une classe
exports.getElevesByClasse = async (req, res) => {
  try {
    const { classeId } = req.params;

    // Recherche des élèves par ID de classe et population de la classe associée
    const eleves = await EleveModel.find({ classe: classeId }).populate({
      path: 'classe',
      select: 'nom', // Sélectionnez les champs que vous souhaitez afficher de la classe
    }).populate({
      path: 'notes',
      populate: {
        path: 'trimestre matiere', // Assurez-vous que les champs de la matière et du trimestre sont corrects
        select: 'nom', // Sélectionnez les champs que vous souhaitez afficher de la matière et du trimestre
      }
    });

    if (!eleves || eleves.length === 0) {
      return res.status(404).json({ message: 'Aucun élève trouvé pour cette classe.' });
    }

    res.status(200).json({ eleves });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des élèves de la classe', message: error.message });
  }
};

// Récupérer tous les enseignants d'une classe
exports.getProfesseursByClasse = async (req, res) => {
  try {
    const { classeId } = req.params;

    // Recherche des enseignants par ID de classe
    const professeurs = await ProfesseurModel.find({ classes: classeId }).populate({
      path: 'classes',
      select: 'nom', // Sélectionnez les champs que vous souhaitez afficher de la classe
    })
    .populate({
      path: 'matieres',
      select: 'nom', // Sélectionnez les champs que vous souhaitez afficher de la matière
    });

    if (!professeurs) {
      return res.status(404).json({ message: 'Aucun enseignant trouvé pour cette classe.' });
    }

    res.status(200).json({ professeurs });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des enseignants de la classe', message: error.message });
  }
};

/* effacer une classe avec les elves et les maitres qui s'y trouvesnt */
// Supprimer une classe avec les élèves et les professeurs associés
exports.deleteClasseWithRelatedData = async (req, res) => {
  try {
    // const { classeId } = req.params;

    // console.log('ts', req.params.id)

    // Supprimer les élèves de la classe
    await EleveModel.deleteMany({ classe: req.params.id });

    // Supprimer les professeurs associés à la classe
    // await ProfesseurModel.updateMany(
    //   { $pull: { classes: classeId } },
    //   { multi: true }
    // );

    // Supprimer la classe elle-même
    const classe = await ClasseModel.findByIdAndDelete(req.params.id);

    if (!classe) {
      return res.status(404).json({message: "Classe not found"});
    }

    res.send(classe);
  } catch (error) {
    res.status(500).json({message: 'Error:',error});
  }
};


//=======================================//

// Mettre à jour le coefficient d'une matière dans une classe
exports.updateCoef = async (req, res) => {
  try {
    const { classeId, matiereId, newCoef } = req.body;

    // Recherche de la classe
    const classe = await ClasseModel.findById(classeId);
    if (!classe) {
      return res.status(404).json({ error: 'Classe not found' });
    }

    // Recherche du coefficient à mettre à jour
    const coefToUpdate = classe.coefInfo.find(coef => coef.matiere.toString() === matiereId);
    if (!coefToUpdate) {
      return res.status(404).json({ error: 'Coefficient not found' });
    }

    // Mise à jour du coefficient
    coefToUpdate.coef = newCoef;
    await classe.save();

    res.status(200).json({ message: 'Coefficient updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer le coefficient d'une matière dans une classe
exports.deleteCoef = async (req, res) => {
  try {
    const { classeId, matiereId } = req.body;

    // Recherche de la classe
    const classe = await ClasseModel.findById(classeId);
    if (!classe) {
      return res.status(404).json({ error: 'Classe not found' });
    }

    // Filtrer les coefficients pour supprimer celui correspondant à la matière
    classe.coefInfo = classe.coefInfo.filter(coef => coef.matiere.toString() !== matiereId);
    await classe.save();

    res.status(200).json({ message: 'Coefficient deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};