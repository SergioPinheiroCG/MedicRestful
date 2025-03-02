const mongoose = require('mongoose');

const ProntuarioSchema = new mongoose.Schema({
    data: { type: Date, default: Date.now },
    medico: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    diagnostico: { type: String, required: true },
    prescricao: { type: String, required: true }
});

const PatientSchema = new mongoose.Schema({
    cpf: { type: String, unique: true, required: true },
    nome: { type: String, required: true },
    telefone: { type: String, required: true },
    endereco: { type: String, required: true },
    remedios: { type: [String], default: [] },
    sintomas: { type: [String], default: [] },
    prontuarios: { type: [ProntuarioSchema], default: [] } // Lista de prontuários
});

module.exports = mongoose.model('Patient', PatientSchema);
