// models/User.js - Modelo de Usuário
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nome: String,
    email: { type: String, unique: true, required: true },
    senha: { type: String, required: true },
    role: { type: String, enum: ['atendente', 'medico'], required: true }
});

module.exports = mongoose.model('User', UserSchema);
