## 📌 Sistema de Atendimento Médico - API RESTful

## 📖 Sobre o Projeto

Este é um sistema de atendimento médico desenvolvido com Node.js, Express, MongoDB (Mongoose) e JWT para autenticaçãos solicitado pela **Professora Samara Sonale Santos Sampaio**, os alunos responsaveis pelo projeto são: **Alexsandra Batista de Luna, Bruna Rafaela de Menezes Paulino, Gustavo Tomio Magalhaes Kubo,Sérgio Magno Castor Pinheiro, Thiago Limeira de Alencar**.  
O sistema segue a arquitetura RESTful e permite que atendentes e médicos cadastrem e gerenciem pacientes, com funcionalidade para criar e visualizar prontuários médicos.


## 📚 Tecnologias Utilizadas

- ✅ Node.js + Express
- ✅ MongoDB + Mongoose
- ✅ JWT para autenticação
- ✅ Bcrypt para hash de senhas
- ✅ Dotenv para configurações sensíveis
- ✅ Middlewares para autenticação e validação


## 📌 RESTful no Sistema
A aplicação segue o padrão RESTful, onde cada recurso (“Paciente”, “Usuário”, “Prontuário”) possui seus próprios endpoints e responde a diferentes métodos HTTP:

- ✅ GET para buscar dados  
- ✅ POST para criar novos registros  
- ✅ PUT para atualizar  
- ✅ DELETE para remover registros  
- ✅ Uso de status codes HTTP apropriados (200 OK, 400 Bad Request, 401 Unauthorized, etc.).

Os dados são estruturados em coleções no MongoDB, respeitando os relacionamentos definidos entre entidades.

## 🔹 Endpoints da API

**✅ 1 Validação dos Dados**

Login
POST /auth/login

Body:
{
  "email": "usuario@email.com",
  "senha": "123456"
}

Resposta:
{
  "token": "JWT_TOKEN_AQUI"
}


**📋 2 Usuários (Atendentes e Médicos)**
Criar um usuário

POST /users/register

Body:

{
  "nome": "Dr. João",
  "email": "joao@email.com",
  "senha": "123456",
  "tipo": "medico"  
}

**📝 3 Pacientes**
Cadastro de Paciente

POST /patients

Body:

{
  "nome": "Carlos Silva",
  "cpf": "12345678901",
  "telefone": "11999999999",
  "endereco": "Rua ABC, 123"
}

Buscar Paciente por CPF

GET /patients/:cpf

**📋 4 Prontuários**
Criar Prontuário para um Paciente

POST /records

Body:

{
  "cpf": "12345678901",
  "diagnostico": "Gripe",
  "prescricao": "Antitérmico e Repouso"
}


Buscar Histórico de Prontuários


## ✅ Validação dos Dados
O sistema utiliza Middlewares para validação de dados antes do processamento:

Express Validator para garantir formato correto de CPF, email e campos obrigatórios.

Bcrypt para hash seguro de senhas.

## 🔑 Autenticação com JWT
Cada requisição protegida requer um token JWT no cabeçalho:

Authorization: Bearer JWT_TOKEN_AQUI

Caso o token seja inválido, o acesso é negado.

## 🔗 Relacionamentos entre Entidades
### **📌 Paciente e Prontuário (1:N)**
Usuário (Atendente/Médico) pode cadastrar pacientes e prontuários.

Paciente possui vários Prontuários.

Prontuário pertence a um único Paciente.

### **Como funciona?**
1️⃣ O usuário faz login (`POST /login`) enviando email e senha.  
2️⃣ Se as credenciais forem corretas, um **token JWT** é gerado e enviado.  
3️⃣ O usuário deve incluir esse token nos headers (`Authorization: Bearer <token>`) para acessar rotas protegidas.  
4️⃣ O **middleware de autenticação** verifica o token antes de liberar o acesso.


## 🚀 Como Executar o Projeto

1️⃣ **Clone o repositório**
```
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

2️⃣ **Instale as dependências**
```
npm install
```

3️⃣ **Crie um arquivo `.env`** com as configurações:
```
JWT_SECRET=sua_chave_secreta
dbURI=mongodb+srv://usuario:senha@cluster.mongodb.net/meubanco
```

4️⃣ **Inicie o servidor**
```bash
node index.js
```


🔥 **Desenvolvido por [Alexsandra Batista de Luna, Bruna Rafaela de Menezes Paulino, Gustavo Tomio Magalhaes Kubo,Sérgio Magno Castor Pinheiro, Thiago Limeira de Alencar]** 🔥

