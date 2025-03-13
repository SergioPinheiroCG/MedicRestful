const mongoose = require('mongoose');

const prontuarioSchema = new mongoose.Schema({
    paciente: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    medico: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Médico responsável
    descricao: { type: String, required: true },
    diagnostico: { type: String, required: true },
    tratamento: { type: String, required: true },
    observacoes: { type: String },
    data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prontuario', prontuarioSchema);

