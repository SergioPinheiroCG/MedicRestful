// middlewares/isMedico.js - Verifica se o usuário é um médico
module.exports = (req, res, next) => {
    if (req.user.role !== 'medico') {
        return res.status(403).json({ msg: 'Acesso permitido apenas para médicos' });
    }
    next();
};
