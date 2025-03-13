const Prontuario = require('../models/Prontuario');
const Patient = require('../models/Patient');
const User = require('../models/User');
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
/*exports.createProntuario = async (req, res) => {
    try {
        const medicoId = req.userId; // Médico logado
        const { pacienteId, descricao, diagnostico, tratamento, observacoes } = req.body;

        if (!medicoId) {
            return res.status(401).send({ message: "Médico não autenticado." });
        }

        // Verifica se o paciente existe
        const paciente = await Patient.findById(pacienteId);
        if (!paciente) {
            return res.status(404).send({ message: "Paciente não encontrado." });
        }

        // Criar novo prontuário
        const newProntuario = new Prontuario({
            paciente: pacienteId,
            medico: medicoId,
            descricao,
            diagnostico,
            tratamento,
            observacoes
        });

        await newProntuario.save();

        // Adicionar o ID do prontuário ao paciente
        paciente.prontuarios.push(newProntuario._id);

        // Se o médico ainda não estiver vinculado ao paciente, adiciona na lista
        if (!paciente.medicos.includes(medicoId)) {
            paciente.medicos.push(medicoId);
        }

        await paciente.save();

        // Adicionar o ID do paciente ao médico, caso ainda não esteja na lista dele
        await User.findByIdAndUpdate(
            medicoId,
            { $addToSet: { pacientes: pacienteId } }, // Evita duplicação
            { new: true }
        );

        res.status(201).send({
            message: "Prontuário criado com sucesso!",
            prontuario: newProntuario
        });
    } catch (error) {
        res.status(400).send({ message: 'Erro ao criar prontuário.', error: error.message });
    }
};*/


exports.createProntuario = async (req, res) => {
    try {
        const medicoId = req.userId; // Pegando o ID do médico autenticado pelo token
        const { descricao, diagnostico, tratamento, observacoes } = req.body;
        const { cpf } = req.params; // Pegando o CPF da URL

        console.log("Médico autenticado:", medicoId);  // Teste para verificar se o médico está autenticado
        console.log("CPF do paciente recebido:", cpf); // Teste para verificar se o CPF está vindo certo

        if (!medicoId) {
            return res.status(401).json({ message: "Médico não autenticado." });
        }

        // Buscar paciente pelo CPF
        const paciente = await Patient.findOne({ cpf });

        if (!paciente) {
            return res.status(404).json({ message: "Paciente não encontrado." });
        }












        
        // Criar prontuário associado ao paciente e ao médico autenticado
        const newProntuario = new Prontuario({
            paciente: paciente._id,
            medico: medicoId,
            descricao,
            diagnostico,
            tratamento,
            observacoes
        });

        await newProntuario.save();

        // Adicionar o prontuário ao array de prontuários do paciente
        paciente.prontuarios.push(newProntuario._id);
        await paciente.save();

        res.status(201).json({
            message: "Prontuário criado com sucesso!",
            prontuario: newProntuario
        });

    } catch (error) {
        res.status(400).json({ message: "Erro ao criar prontuário.", error: error.message });
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
