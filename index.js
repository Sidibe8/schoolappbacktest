// Importations des modules
const express = require("express");
const cookieParser = require('cookie-parser');
// const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");

// Initialisation de l'application Express
const app = express();

// Configuration de dotenv pour charger les variables d'environnement depuis un fichier .env
require("dotenv").config();

// Configuration de la base de données MongoDB
const db = require("./config/db");
db();

// Importation des middlewares et des routes


// Utilisation du middleware cookie-parser pour gérer les cookies
app.use(cookieParser());

// Utilisation du middleware CORS pour autoriser les requêtes cross-origin
const cors = require("cors");
app.use(cors());

// routes
const authRouter = require("./routes/auth.routes");
const classeRouter = require("./routes/classeRouter.routes");
const matiereRouter = require("./routes/matiereRouter.routes");
const noteRouter = require("./routes/noteRouter.routes");
const eleveRouter = require("./routes/eleveRouter.routes");
const professeurRouter = require("./routes/professeurRouter.routes");
const login = require("./routes/login.routes");
const trimestre = require("./routes/trimestre.routes");


// Configuration de la gestion des données JSON dans les requêtes Express
app.use(express.json());
// app.use(bodyParser.json());

// Configuration des routes
app.use('/api', professeurRouter);
app.use('/api', eleveRouter);
app.use('/api', authRouter);
app.use('/api', classeRouter);
app.use('/api', noteRouter);
app.use('/api', matiereRouter);
app.use('/api', login);
app.use('/api', trimestre);

// Démarrage du serveur Express sur le port spécifié dans les variables d'environnement
app.listen(process.env.PORT, () => {
  console.log("Server listening on port", `http://localhost:${process.env.PORT}/` );
});
