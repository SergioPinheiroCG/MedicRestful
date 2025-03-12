const Prontuario = require('../models/Prontuario');
const Patient = require('../models/Patient');
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

// Criação de prontuário
exports.createProntuario = async (req, res) => {
    try {
        const { cpf } = req.params;  // CPF vindo da rota
        const prontuarioData = req.body;

        // Verifica se o paciente existe
        const paciente = await Patient.findOne({ cpf });
        if (!paciente) {
            return sendErrorResponse(res, 404, 'Paciente não encontrado.');
        }

        // Cria o prontuário associado ao paciente pelo CPF
        const prontuario = new Prontuario({
            ...prontuarioData,
            paciente: paciente._id  // Usando o _id do paciente para associar
        });
        await prontuario.save();

        // Adiciona o prontuário ao paciente
        paciente.prontuarios.push(prontuario._id);  // Usando o _id do prontuário
        await paciente.save();

        return sendSuccessResponse(res, prontuario, 'Prontuário criado com sucesso');
    } catch (error) {
        return sendErrorResponse(res, 400, 'Erro ao criar prontuário', error);
    }
};

// Busca prontuários por CPF do paciente
exports.getProntuariosByPatientCpf = async (req, res) => {
    try {
        const { cpf } = req.params;  // CPF vindo da rota

        // Busca o paciente e seus prontuários
        const paciente = await Patient.findOne({ cpf }).populate('prontuarios');
        if (!paciente) {
            return sendErrorResponse(res, 404, 'Paciente não encontrado.');
        }

        return sendSuccessResponse(res, paciente.prontuarios);
    } catch (error) {
        return sendErrorResponse(res, 500, 'Erro ao buscar prontuários', error);
    }
};

// Atualiza o prontuário de um paciente
exports.updateProntuario = async (req, res) => {
    try {
        const { cpf, prontuarioId } = req.params;  // CPF e ID do prontuário vindo da rota
        const updates = req.body;

        // Busca o paciente pelo CPF
        const paciente = await Patient.findOne({ cpf });
        if (!paciente) {
            return sendErrorResponse(res, 404, 'Paciente não encontrado.');
        }

        // Busca e atualiza o prontuário associado ao paciente
        const prontuario = await Prontuario.findOneAndUpdate(
            { _id: prontuarioId, paciente: paciente._id },  // Garantindo que o prontuário é do paciente correto
            updates,
            { new: true }
        );
        if (!prontuario) {
            return sendErrorResponse(res, 404, 'Prontuário não encontrado.');
        }

        return sendSuccessResponse(res, prontuario, 'Prontuário atualizado com sucesso');
    } catch (error) {
        return sendErrorResponse(res, 400, 'Erro ao atualizar prontuário', error);
    }
};

// Deleta o prontuário de um paciente
exports.deleteProntuario = async (req, res) => {
    try {
        const { cpf, prontuarioId } = req.params;  // CPF e ID do prontuário vindo da rota

        // Busca o paciente pelo CPF
        const paciente = await Patient.findOne({ cpf });
        if (!paciente) {
            return sendErrorResponse(res, 404, 'Paciente não encontrado.');
        }

        // Deleta o prontuário
        const prontuario = await Prontuario.findOneAndDelete({ _id: prontuarioId, paciente: paciente._id });
        if (!prontuario) {
            return sendErrorResponse(res, 404, 'Prontuário não encontrado.');
        }

        // Remove o prontuário da lista de prontuários do paciente
        paciente.prontuarios.pull(prontuario._id);
        await paciente.save();

        return sendSuccessResponse(res, null, 'Prontuário deletado com sucesso');
    } catch (error) {
        return sendErrorResponse(res, 500, 'Erro ao deletar prontuário', error);
    }
};

// Busca todos os prontuários
exports.getAllProntuarios = async (req, res) => {
    try {
        const prontuarios = await Prontuario.find();  // Exemplo de consulta
        res.status(200).send(prontuarios);
    } catch (error) {
        res.status(500).send({ message: 'Erro ao buscar prontuários.', error: error.message });
    }
};
