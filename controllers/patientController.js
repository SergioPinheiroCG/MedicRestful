const Patient = require('../models/Patient');
const Endereco = require('../models/Endereco');
const mongoose = require('mongoose');

// Função para enviar resposta de erro de forma padronizada
const sendErrorResponse = (res, statusCode, message, error = null) => {
    const response = { message };
    if (error) response.error = error.message || error;
    return res.status(statusCode).send(response);
};

// Função para enviar resposta de sucesso
const sendSuccessResponse = (res, data, message = 'Operação realizada com sucesso') => {
    return res.status(200).send({ message, data });
};

// Criação de paciente com endereço
exports.createPatient = async (req, res) => {
    try {
        const { cpf, endereco, ...patientData } = req.body;

        // Verifica se o paciente já existe
        const existingPatient = await Patient.findOne({ cpf });
        if (existingPatient) {
            return res.status(400).send({ message: 'Paciente já cadastrado com este CPF.' });
        }

        // Cria o endereço
        const newEndereco = new Endereco(endereco);
        await newEndereco.save();

        // Cria o paciente com o endereço associado
        const patient = new Patient({
            cpf,
            ...patientData,
            endereco: newEndereco._id
        });
        await patient.save();

        res.status(201).send(patient);
    } catch (error) {
        res.status(400).send({ message: 'Erro ao criar paciente.', error: error.message });
    }
};

// Busca paciente por CPF
exports.getPatientByCpf = async (req, res) => {
    try {
        const patient = await Patient.findOne({ cpf: req.params.cpf })
            .populate('endereco')
            .populate('medicos')
            .populate('prontuarios');

        if (!patient) {
            return sendErrorResponse(res, 404, 'Paciente não encontrado');
        }

        return sendSuccessResponse(res, patient);
    } catch (error) {
        return sendErrorResponse(res, 500, 'Erro ao buscar paciente', error);
    }
};

// Atualiza paciente por CPF
exports.updatePatient = async (req, res) => {
    try {
        const { cpf } = req.params;
        const updates = req.body;

        // Atualiza o paciente
        const patient = await Patient.findOneAndUpdate({ cpf }, updates, { new: true })
            .populate('endereco')
            .populate('medicos')
            .populate('prontuarios');

        if (!patient) {
            return sendErrorResponse(res, 404, 'Paciente não encontrado');
        }

        return sendSuccessResponse(res, patient, 'Paciente atualizado com sucesso');
    } catch (error) {
        return sendErrorResponse(res, 400, 'Erro ao atualizar paciente', error);
    }
};

// Deleta paciente por CPF e seu endereço associado
exports.deletePatient = async (req, res) => {
    try {
        const { cpf } = req.params;

        // Deleta o paciente e seu endereço associado
        const patient = await Patient.findOneAndDelete({ cpf });
        if (!patient) {
            return sendErrorResponse(res, 404, 'Paciente não encontrado');
        }

        // Deleta o endereço associado ao paciente
        await Endereco.findByIdAndDelete(patient.endereco);

        return sendSuccessResponse(res, null, 'Paciente deletado com sucesso');
    } catch (error) {
        return sendErrorResponse(res, 500, 'Erro ao deletar paciente', error);
    }
};

// Função para buscar todos os pacientes
exports.getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find()
            .populate('endereco')
            .populate('medicos')
            .populate('prontuarios');
        
        if (!patients || patients.length === 0) {
            return sendErrorResponse(res, 404, 'Nenhum paciente encontrado');
        }

        return sendSuccessResponse(res, patients);
    } catch (error) {
        return sendErrorResponse(res, 500, 'Erro ao buscar pacientes', error);
    }
};
