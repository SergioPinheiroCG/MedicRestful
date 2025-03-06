// index.js - Ponto de entrada do servidor
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');

const app = express();

// Configuração do Middleware
app.use(express.json());
app.use(cors());

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI, {
    //useNewUrlParser: true,
    //useUnifiedTopology: true
}).then(() => console.log('MongoDB conectado!'))
  .catch(err => console.log(err));

// Rotas
app.use('/auth', authRoutes);
app.use('/patients', patientRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

