require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env
const bodyParser = require("body-parser");
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const prontuarioRoutes = require('./routes/prontuarioRoutes');
const db = require("./db/db.js");

const app = express();
app.use(bodyParser.json()); // Permite o uso do body-parser para interpretar requisições POST com JSON
app.use('/api', authRoutes);
app.use('/api', patientRoutes);
app.use('/api', prontuarioRoutes);


// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Aplicação rodando na porta ${PORT}`);
});