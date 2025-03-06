// routes/patientRoutes.js - Rotas de Pacientes
const express = require('express');
const { createPatient, getPatientByCPF } = require('../controllers/patientController.js');
const authMiddleware = require('../middlewares/authMiddleware');
const isMedico = require('../middlewares/isMedico');  // Importando o middleware de verificação do médico
const Patient = require('../models/Patient');

const router = express.Router();

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

// Rota para excluir um paciente pelo CPF (acesso permitido para atendentes e médicos)
router.delete('/:cpf', authMiddleware, isMedico, async (req, res) => {
    try {
        const { cpf } = req.params;

        // Buscar paciente pelo CPF
        const paciente = await Patient.findOne({ cpf });
        if (!paciente) {
            return res.status(404).json({ msg: 'Paciente não encontrado' });
        }

        // Remover o paciente do banco de dados
        await Patient.deleteOne({ cpf });

        res.status(200).json({ msg: 'Paciente excluído com sucesso' });
    } catch (error) {
        console.error("Erro ao tentar deletar paciente:", error); // Log detalhado
        res.status(500).json({ msg: 'Erro ao excluir paciente', error: error.message });
    }
});

// Rota para atualizar um paciente pelo CPF (acesso permitido para atendentes e médicos)
router.put('/:cpf', authMiddleware, isMedico, async (req, res) => {
    try {
        const { cpf } = req.params;
        const { nome, telefone, endereco, remedios, sintomas } = req.body;

        // Verificar se os dados obrigatórios foram enviados
        if (!nome && !data_nascimento && !endereco) {
            return res.status(400).json({ msg: 'Nenhum dado válido fornecido para atualização.' });
        }

        // Buscar paciente pelo CPF
        const paciente = await Patient.findOne({ cpf });
        if (!paciente) {
            return res.status(404).json({ msg: 'Paciente não encontrado' });
        }

        // Atualizar os dados do paciente
        paciente.nome = nome || paciente.nome;
        paciente.telefone = telefone || paciente.telefone;
        paciente.endereco = endereco || paciente.endereco;
        paciente.remedios = remedios || paciente.remedios;
        paciente.sintomas = sintomas || paciente.sintomas;

        await paciente.save();

        res.status(200).json({ msg: 'Paciente atualizado com sucesso', paciente });
    } catch (error) {
        res.status(500).json({ msg: 'Erro ao atualizar paciente', error });
    }
});

module.exports = router;
