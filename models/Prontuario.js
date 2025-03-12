const mongoose = require('mongoose');

const prontuarioSchema = new mongoose.Schema({
    paciente: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }, // 1:N
    historico: String,
    diagnostico: String,
    tratamento: String,
    data: { type: Date, default: Date.now } // data de criação
});

module.exports = mongoose.model('Prontuario', prontuarioSchema);