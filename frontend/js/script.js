// js/script.js - Lógica de Autenticação, Cadastro e Pacientes

const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('error-message');
const registerForm = document.getElementById('registerForm');
const registerError = document.getElementById('register-error');
const patientForm = document.getElementById('patientForm');
const searchPatientForm = document.getElementById('searchPatientForm');
const patientInfo = document.getElementById('patientInfo');
const updateProntuario = document.getElementById('updateProntuario');
const token = localStorage.getItem('token');
console.log("Token enviado na requisição:", token); // <-- Adicione para depuração


// Função de Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = 'index.html';
}

// Login
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        const response = await fetch('http://localhost:5000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            
            if (data.role === 'atendente') {
                window.location.href = 'atendente.html';
            } else if (data.role === 'medico') {
                window.location.href = 'medico.html';
            }
        } else {
            errorMessage.textContent = data.msg;
        }
    });
}

// Cadastro de Usuário
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('register-email').value;
        const senha = document.getElementById('register-senha').value;
        const role = document.getElementById('role').value;

        const response = await fetch('http://localhost:5000/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha, role })
        });

        const data = await response.json();
        
        if (response.ok) {
            alert('Cadastro realizado com sucesso! Faça login.');
            window.location.href = 'index.html';
        } else {
            registerError.textContent = data.msg;
        }
    });
}

if (patientForm) {
    patientForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const cpf = document.getElementById('cpf').value;
        const nome = document.getElementById('nome').value;
        const telefone = document.getElementById('telefone').value;
        const endereco = document.getElementById('endereco').value;
        const remedios = document.getElementById('remedios').value;
        const sintomas = document.getElementById('sintomas').value;

        try {

            const token = localStorage.getItem('token');
            console.log("Token enviado na requisição:", token); // <-- Adicione para depuração
            

            const response = await fetch('http://localhost:5000/patients/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ cpf, nome, telefone, endereco, remedios, sintomas })
            });
            const data = await response.json();

            if (response.ok) {
                alert('Paciente cadastrado com sucesso!');
                patientForm.reset();
            } else {
                document.getElementById('patient-error').textContent = data.msg;
            }
        } catch (error) {
            console.error('Erro ao cadastrar paciente:', error);
            document.getElementById('patient-error').textContent = "Erro ao conectar com o servidor.";
        }
    });
}

/*
// Busca de Paciente pelo CPF para Médicos
if (searchPatientForm) {
    searchPatientForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const cpf = document.getElementById('search-cpf').value;

        const response = await fetch(`http://localhost:5000/patients/${cpf}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('patient-nome').textContent = data.nome;
            document.getElementById('patient-telefone').textContent = data.telefone;
            document.getElementById('patient-endereco').textContent = data.endereco;
            document.getElementById('patient-remedios').textContent = data.remedios;
            document.getElementById('patient-sintomas').textContent = data.sintomas;
            patientInfo.classList.remove('hidden');
        } else {
            errorMessage.textContent = data.msg;
        }
    });
}*/

// Busca de Paciente pelo CPF para Médicos
if (searchPatientForm) {
    searchPatientForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const cpf = document.getElementById('search-cpf').value;

        const response = await fetch(`http://localhost:5000/patients/${cpf}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('patient-nome').textContent = data.nome;
            document.getElementById('patient-telefone').textContent = data.telefone;
            document.getElementById('patient-endereco').textContent = data.endereco;
            document.getElementById('patient-remedios').textContent = data.remedios;
            document.getElementById('patient-sintomas').textContent = data.sintomas;
            document.getElementById('patientInfo').classList.remove('hidden');

            // Exibindo o histórico de prontuários
            const historyList = document.getElementById('historyList');
            historyList.innerHTML = ''; // Limpar o histórico atual

            if (data.prontuarios && data.prontuarios.length > 0) {
                data.prontuarios.forEach(prontuario => {
                    const historyItem = document.createElement('div');
                    historyItem.classList.add('history-item');
                    historyItem.innerHTML = `
                        <p><strong>Diagnóstico:</strong> ${prontuario.diagnostico}</p>
                        <p><strong>Prescrição:</strong> ${prontuario.prescricao}</p>
                        <p><strong>Data:</strong> ${new Date(prontuario.data).toLocaleDateString()}</p>
                    `;
                    historyList.appendChild(historyItem);
                });
            } else {
                historyList.innerHTML = '<p>Nenhum prontuário encontrado.</p>';
            }
        } else {
            errorMessage.textContent = data.msg;
        }
    });
}

// Atualização do Prontuário
if (updateProntuario) {
    updateProntuario.addEventListener('click', async () => {
        const cpf = document.getElementById('search-cpf').value;
        const diagnostico = document.getElementById('diagnostico').value;
        const prescricao = document.getElementById('prescricao').value;

        const response = await fetch(`http://localhost:5000/patients/${cpf}/prontuario`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ diagnostico, prescricao })
        });

        const data = await response.json();
        
        if (response.ok) {
            alert('Prontuário criado com sucesso!');
        } else {
            errorMessage.textContent = data.msg;
        }
    });
}
