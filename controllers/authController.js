const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Função para gerar token JWT
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Função para enviar resposta de erro de forma padronizada
const sendErrorResponse = (res, statusCode, message, error = null) => {
    const response = { message };
    if (error) response.error = error.message || error;
    return res.status(statusCode).send(response);
};

// Registro de usuário com criptografia de senha
exports.register = async (req, res) => {
    try {
        const { nome, cpf, email, senha, role } = req.body;
        if (!nome || !cpf || !email || !senha || !role) {
            return sendErrorResponse(res, 400, 'Campos obrigatórios não preenchidos');
        }

        // Verifica se o usuário já existe
        const existingUser = await User.findOne({ cpf });
        if (existingUser) {
            return sendErrorResponse(res, 400, 'Usuário já cadastrado com este CPF');
        }

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(senha, 10);

        // Cria o usuário com a senha criptografada
        const user = new User({ nome, cpf, email, senha: hashedPassword, role });
        await user.save();

        // Gera o token JWT para o usuário registrado
        const token = generateToken(user._id);

        return res.status(201).send({ user, token });
    } catch (error) {
        return sendErrorResponse(res, 500, 'Erro ao registrar usuário', error);
    }
};

// Login de usuário com validação de senha e JWT
exports.login = async (req, res) => {
    try {
        const { cpf, senha } = req.body;

        if (!cpf || !senha) {
            return sendErrorResponse(res, 400, 'CPF e senha são obrigatórios');
        }

        // Verifica se o usuário existe
        const user = await User.findOne({ cpf });
        if (!user) {
            return sendErrorResponse(res, 404, 'Usuário não encontrado');
        }

        // Valida a senha
        const isPasswordValid = await bcrypt.compare(senha, user.senha);
        if (!isPasswordValid) {
            return sendErrorResponse(res, 401, 'Senha incorreta');
        }

        // Gera o token JWT para o usuário logado
        const token = generateToken(user._id);
        return res.send({ user, token });
    } catch (error) {
        return sendErrorResponse(res, 500, 'Erro ao fazer login', error);
    }
};

// Busca usuário por CPF
exports.getUserByCpf = async (req, res) => {
    try {
        const user = await User.findOne({ cpf: req.params.cpf });
        if (!user) {
            return sendErrorResponse(res, 404, 'Usuário não encontrado');
        }
        return res.send(user);
    } catch (error) {
        return sendErrorResponse(res, 500, 'Erro ao buscar usuário', error);
    }
};

// Busca todos os usuários
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Buscar todos os usuários
        if (!users || users.length === 0) {
            return sendErrorResponse(res, 404, 'Nenhum usuário encontrado');
        }
        return res.send(users);
    } catch (error) {
        return sendErrorResponse(res, 500, 'Erro ao buscar todos os usuários', error);
    }
};

// Atualiza usuário por CPF
exports.updateUser = async (req, res) => {
    try {
        const { cpf } = req.params;
        const updates = req.body;

        // Se a senha for atualizada, criptografa a nova senha
        if (updates.senha) {
            updates.senha = await bcrypt.hash(updates.senha, 10);
        }

        const user = await User.findOneAndUpdate({ cpf }, updates, { new: true });
        if (!user) {
            return sendErrorResponse(res, 404, 'Usuário não encontrado');
        }
        return res.send(user);
    } catch (error) {
        return sendErrorResponse(res, 500, 'Erro ao atualizar usuário', error);
    }
};

// Deleta usuário por CPF
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ cpf: req.params.cpf });
        if (!user) {
            return sendErrorResponse(res, 404, 'Usuário não encontrado');
        }
        return res.send({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
        return sendErrorResponse(res, 500, 'Erro ao deletar usuário', error);
    }
};
