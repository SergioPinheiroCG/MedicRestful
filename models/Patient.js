const mongoose = require('mongoose');
const Endereco = require('./Endereco');
const Prontuario = require('./Prontuario');
const User = require('./User');

const patientSchema = new mongoose.Schema({
    nome: { type: String, required: true }, 
    cpf: { type: String, unique: true, required: true },
    endereco: { type: mongoose.Schema.Types.ObjectId, ref: 'Endereco' }, // Relacionamento 1:1 com Endereco
    prontuarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prontuario' }], // Relacionamento 1:N com Prontuário
    medicos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Relacionamento N:N com User (médicos)
});

module.exports = mongoose.model('Patient', patientSchema);
