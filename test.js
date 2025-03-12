const bcrypt = require('bcrypt');

// Aqui você coloca a senha fornecida (que o usuário passou)
const senhaFornecida = '123456';

// Aqui você pega o hash armazenado no banco (por exemplo)
const hashArmazenado = '$2b$10$uUogrQZFK/KmTSXHQvcdDu5NOw9RIK94tVDJPUIHmfM6ci92LAsQu'; // Esse valor deve vir do banco de dados

// Comparando a senha fornecida com o hash armazenado
bcrypt.compare(senhaFornecida, hashArmazenado, function(err, result) {
    if (err) {
        console.log('Erro na comparação:', err);
    } else {
        console.log('Senha válida?', result); // Deve retornar true se as senhas forem iguais
    }
});
