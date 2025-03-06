const mongoose = require('mongoose');

const prontuarioSchema = new mongoose.Schema({
    medico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia o modelo User para identificar o médico que criou o prontuário
        required: true
    },
    diagnostico: {
        type: String,
        required: true
    },
    prescricao: {
        type: String,
        required: true
    },
    data: {
        type: Date,
        default: Date.now
    }
});

// Modelo baseado no schema de Prontuario
const Prontuario = mongoose.model('Prontuario', prontuarioSchema);

module.exports = Prontuario;
