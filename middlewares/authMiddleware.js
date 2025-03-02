const jwt = require('jsonwebtoken'); // Certifique-se de que essa linha está presente

async function fetchData() {
const data = await response.json();
console.log(data); // Adicione esta linha para depuração
}

module.exports = (req, res, next) => {
    let token = req.header('Authorization');
    console.log("Token recebido:", token); 

    if (!token) return res.status(401).json({ msg: 'Acesso negado' });

    // Removendo o prefixo "Bearer " se estiver presente
    if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log("Erro ao verificar token:", err);
        res.status(400).json({ msg: 'Token inválido' });
    }
};
