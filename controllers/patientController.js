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
