// controllers/patientController.js - Controlador de Pacientes
const Patient = require('../models/Patient');

exports.createPatient = async (req, res) => {
    const { cpf, nome, telefone, endereco, remedios, sintomas } = req.body;
    try {
        const novoPaciente = new Patient({ cpf, nome, telefone, endereco, remedios, sintomas });
        await novoPaciente.save();
        res.status(201).json({ msg: 'Paciente cadastrado com sucesso!' });
    } catch (err) {
        res.status(400).json({ msg: 'Erro ao cadastrar paciente', erro: err });
    }
};

exports.getPatientByCPF = async (req, res) => {
    const { cpf } = req.params;
    try {
        const paciente = await Patient.findOne({ cpf });
        if (!paciente) return res.status(404).json({ msg: 'Paciente não encontrado' });
        res.json(paciente);
    } catch (err) {
        res.status(500).json({ msg: 'Erro no servidor', erro: err });
    }
};

exports.deletePatient = async (req, res) => {
    const { cpf } = req.params;
    try {
        const paciente = await Patient.findOneAndDelete({ cpf });
        if (!paciente) return res.status(404).json({ msg: 'Paciente não encontrado' });
        res.json({ msg: 'Paciente excluído com sucesso!' });
    } catch (err) {
        res.status(500).json({ msg: 'Erro no servidor', erro: err });
    }
};

exports.updatePatient = async (req, res) => {
    const { cpf } = req.params;
    const { nome, telefone, endereco, remedios, sintomas } = req.body;
    try {
        const paciente = await Patient.findOne({ cpf });
        if (!paciente) return res.status(404).json({ msg: 'Paciente não encontrado' });

        // Atualizar as informações do paciente
        paciente.nome = nome || paciente.nome;
        paciente.telefone = telefone || paciente.telefone;
        paciente.endereco = endereco || paciente.endereco;
        paciente.remedios = remedios || paciente.remedios;
        paciente.sintomas = sintomas || paciente.sintomas;

        await paciente.save();
        res.json({ msg: 'Paciente atualizado com sucesso!' });
    } catch (err) {
        res.status(500).json({ msg: 'Erro no servidor', erro: err });
    }
};
