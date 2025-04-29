// Verificar se o usuário já está logado
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'index.html';
    }
});

// Array para armazenar os usuários (em um sistema real, isso seria no backend)
let users = JSON.parse(localStorage.getItem('users')) || [];

// Adicionar usuário admin padrão se não existir nenhum
if (users.length === 0) {
    users.push({
        username: 'admin',
        password: 'admin123',
        isAdmin: true
    });
    localStorage.setItem('users', JSON.stringify(users));
}

// Função para verificar o login
function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Login bem-sucedido
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify({
            username: user.username,
            isAdmin: user.isAdmin
        }));
        
        // Redirecionar para a página principal
        window.location.href = 'index.html';
    } else {
        // Login falhou
        alert('Usuário ou senha incorretos!');
    }
}

// Event Listeners
document.getElementById('loginForm').addEventListener('submit', handleLogin);

// Redirecionar para a página de registro
document.getElementById('registerLink').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'register.html';
}); 