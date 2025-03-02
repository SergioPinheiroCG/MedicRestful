// routes/patientRoutes.js - Rotas de Pacientes
const express = require('express');
const { createPatient, getPatientByCPF } = require('../controllers/patientController.js');
const authMiddleware = require('../middlewares/authMiddleware');
const isMedico = require('../middlewares/isMedico');  // Importando o middleware de verificação do médico
const Patient = require('../models/Patient');

const router = express.Router();

// Middleware para verificar se o usuário é médico
// const isMedico = (req, res, next) => {
//     if (req.user.role !== 'medico') {
//         return res.status(403).json({ msg: 'Acesso negado. Apenas médicos podem adicionar prontuários.' });
//     }
//     next();
// };

// Rota para cadastrar um paciente (somente atendentes)
router.post('/register', authMiddleware, createPatient);

// Rota para buscar um paciente pelo CPF (acesso permitido para médicos e atendentes)
router.get('/:cpf', authMiddleware, getPatientByCPF);

// Rota para adicionar um prontuário a um paciente (somente médicos)
router.post('/:cpf/prontuario', authMiddleware, isMedico, async (req, res) => {
    try {
        const { diagnostico, prescricao } = req.body;
        const { cpf } = req.params;

        // Buscar paciente pelo CPF
        const paciente = await Patient.findOne({ cpf });
        if (!paciente) {
            return res.status(404).json({ msg: 'Paciente não encontrado' });
        }

        // Criar novo prontuário
        const novoProntuario = {
            medico: req.user.id, // ID do médico autenticado
            diagnostico,
            prescricao,
            data: new Date()
        };

        // Adicionar prontuário ao paciente
        if (!paciente.prontuarios) {
            paciente.prontuarios = []; // Garante que a chave prontuarios exista
        }
        paciente.prontuarios.push(novoProntuario);
        await paciente.save();

        res.status(201).json({ msg: 'Prontuário adicionado com sucesso', prontuario: novoProntuario });
    } catch (error) {
        res.status(500).json({ msg: 'Erro ao adicionar prontuário', error });
    }
});

// Rota para listar todos os prontuários de um paciente pelo CPF (somente médicos)
router.get('/:cpf/prontuarios', authMiddleware, isMedico, async (req, res) => {
    try {
        const { cpf } = req.params;

        // Buscar paciente pelo CPF
        const paciente = await Patient.findOne({ cpf });
        if (!paciente) {
            return res.status(404).json({ msg: 'Paciente não encontrado' });
        }

        res.status(200).json({ prontuarios: paciente.prontuarios || [] });
    } catch (error) {
        res.status(500).json({ msg: 'Erro ao buscar prontuários', error });
    }
});

module.exports = router;
