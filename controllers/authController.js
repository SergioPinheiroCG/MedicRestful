// controllers/authController.js - Controlador de Autenticação
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { nome, email, senha, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(senha, 10);
        const novoUsuario = new User({ nome, email, senha: hashedPassword, role });
        await novoUsuario.save();
        res.status(201).json({ msg: 'Usuário criado com sucesso!' });
    } catch (err) {
        res.status(400).json({ msg: 'Erro ao criar usuário', erro: err });
    }
};

exports.login = async (req, res) => {
    const { email, senha } = req.body;
    try {
        const usuario = await User.findOne({ email });
        if (!usuario) return res.status(404).json({ msg: 'Usuário inexistente' });

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) return res.status(401).json({ msg: 'Senha inválida' });

        const token = jwt.sign({ id: usuario._id, role: usuario.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log("Token gerado:", token);
        res.json({ token, role: usuario.role });
    } catch (err) {
        res.status(500).json({ msg: 'Erro no servidor', erro: err });
    }
};
