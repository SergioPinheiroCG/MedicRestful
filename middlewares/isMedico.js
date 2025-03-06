// middlewares/isMedico.js - Middleware para verificar se o usuário é médico ou atendente
module.exports = (req, res, next) => {
    if (req.user.role === 'medico' || req.user.role === 'atendente') {
        return next();
    }
    res.status(403).json({ msg: 'Acesso negado. Permissão insuficiente.' });
};
