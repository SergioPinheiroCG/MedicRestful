const mongoose = require('mongoose');
const Patient = require('./Patient');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    cpf: { type: String, unique: true, required: true },
    email: { type: String, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }, // Valida o formato do email 
    senha: { type: String, required: true },
    role: { type: String, enum: ['medico', 'admin'], default: 'medico' },
    pacientes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }] // N:N
});


module.exports = mongoose.model('User', userSchema);