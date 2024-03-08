const EleveModel = require('../models/eleveModel');

// Contrôleur pour créer une note pour un élève
// exports.createNote = async (req, res) => {
//   try {
//     const { eleveId, trimestreId, matiereId, notesDevoir, noteCompo } = req.body;

//     // Recherche de l'élève
//     const eleve = await EleveModel.findById(eleveId);
//     if (!eleve) {
//       return res.status(404).json({ message: 'Élève non trouvé.' });
//     }

//     // Création de la note
//     const nouvelleNote = {
//       trimestre: trimestreId,
//       matiere: matiereId,
//       notesDevoir: notesDevoir,
//       noteCompo: noteCompo
//     };

//     // Ajout de la note à la liste des notes de l'élève
//     eleve.notes.push(nouvelleNote);

//     // Enregistrement des modifications de l'élève
//     await eleve.save();

//     res.status(201).json({ message: 'Note ajoutée avec succès.', note: nouvelleNote });
//   } catch (error) {
//     res.status(400).json({ error: 'Erreur lors de la création de la note', message: error.message });
//   }
// };

exports.createNote = async (req, res) => {
  try {
    const { eleveId, trimestreId, matiereId, notesDevoir, noteCompo } = req.body;

    // Recherche de l'élève
    const eleve = await EleveModel.findById(eleveId);
    if (!eleve) {
      return res.status(404).json({ message: 'Élève non trouvé.' });
    }

    // Vérification si une matière avec le même ID de trimestre existe déjà
    const existingMatiereIndex = eleve.notes.findIndex(note => note.matiere.toString() === matiereId && note.trimestre.toString() === trimestreId);

    if (existingMatiereIndex !== -1) {
      // Mettre à jour les notes existantes
      eleve.notes[existingMatiereIndex].notesDevoir = notesDevoir;
      eleve.notes[existingMatiereIndex].noteCompo = noteCompo;
    } else {
      // Création de la note
      const nouvelleNote = {
        trimestre: trimestreId,
        matiere: matiereId,
        notesDevoir: notesDevoir,
        noteCompo: noteCompo
      };

      // Ajout de la note à la liste des notes de l'élève
      eleve.notes.push(nouvelleNote);
    }

    // Enregistrement des modifications de l'élève
    await eleve.save();

    res.status(201).json({ message: 'Note ajoutée ou mise à jour avec succès.' });
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création/mise à jour de la note', message: error.message });
  }
};



exports.getAllNotesByEleveId = async (req, res) => {
  try {
    const { eleveId } = req.params;

    // Vérifie si l'élève existe
    const eleve = await EleveModel.findById(eleveId);
    if (!eleve) {
      return res.status(404).send({ message: 'Élève non trouvé.' });
    }

    res.json({ notes: eleve.notes });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getNotesByMatiereId = async (req, res) => {
  try {
    const { eleveId, matiereId } = req.params;

    // Vérifie si l'élève existe
    const eleve = await EleveModel.findById(eleveId);
    if (!eleve) {
      return res.status(404).send({ message: 'Élève non trouvé.' });
    }

    // Recherche les notes pour cette matière
    const notesForMatiere = eleve.notes.find(note => note.matiere.equals(matiereId));

    if (!notesForMatiere) {
      return res.status(404).send({ message: 'Aucune note trouvée pour cette matière.' });
    }

    res.send({ notes: notesForMatiere });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};




/* autre controller */