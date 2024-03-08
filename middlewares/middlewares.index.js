const {User} = require("../models/model.index")
const jwt = require("jsonwebtoken");

// Middleware pour vérifier le statut d'administrateur
module.exports.isAdmin = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Recherchez l'utilisateur dans la base de données pour obtenir le statut admin.
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found. Please login first." });
    }

    if (user.isAdmin) {
      // Si l'utilisateur est administrateur, continuez vers la prochaine étape.
      next();
    } else {
      // Si l'utilisateur n'est pas administrateur, renvoyez une erreur d'accès interdit (403).
      return res.status(403).json({
        message:
          "You do not have permission to access this resource as an administrator.",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to check admin status", error: error.message });
  }
};

module.exports.verifyToken = (req, res, next) => {
  if (req.path === '/login' || req.path === '/auth_login') {
    // Si l'utilisateur accède à la page de connexion ou d'authentification, passez à la prochaine middleware sans vérification du token JWT
    next();
  } else {
    // Pour toutes les autres routes, vérifiez le token JWT avant de permettre l'accès
    const token = req.cookies.schoolwebapp; // Récupérer le token JWT depuis le cookie

    if (!token) {
      // Rediriger vers la page de connexion si le token n'est pas fourni
      return res.redirect('/login');
    }

    try {
      // Vérifier et décoder le token JWT
      const decoded = jwt.verify(token, process.env.JSONWEBTOKEN);

      // Ajouter les informations d'utilisateur au corps de la requête
      req.user = decoded.user;

      // Passer à la prochaine middleware
      next();
    } catch (error) {
      // Rediriger vers la page de connexion si le token est invalide
      return res.redirect('/login');
    }
  }
}
