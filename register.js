// Array para armazenar os usuários
let users = JSON.parse(localStorage.getItem('users')) || [];

// Função para registrar novo usuário
function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Verificar se o usuário já existe
    if (users.some(u => u.username === username)) {
        alert('Este nome de usuário já está em uso!');
        return;
    }

    // Verificar se as senhas coincidem
    if (password !== confirmPassword) {
        alert('As senhas não coincidem!');
        return;
    }

    // Verificar força da senha
    if (password.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres!');
        return;
    }

    // Adicionar novo usuário
    users.push({
        username: username,
        password: password,
        isAdmin: false
    });

    // Salvar no localStorage
    localStorage.setItem('users', JSON.stringify(users));

    // Redirecionar para a página de login
    alert('Registro realizado com sucesso! Faça login para continuar.');
    window.location.href = 'login.html';
}

// Event Listener
document.getElementById('registerForm').addEventListener('submit', handleRegister); 