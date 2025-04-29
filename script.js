// Verificar autenticação
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    // Exibir nome do usuário logado
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const header = document.querySelector('header h1');
        header.innerHTML += `<span class="user-info"> (${currentUser.username})</span>`;
    }

    displayServices();
});

// Função para fazer logout
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Array para armazenar os serviços
let services = JSON.parse(localStorage.getItem('services')) || [];

// Função para salvar os serviços no localStorage
function saveServices() {
    localStorage.setItem('services', JSON.stringify(services));
}

// Função para adicionar um novo serviço
function addService(event) {
    event.preventDefault();

    const service = {
        id: Date.now(),
        clientName: document.getElementById('clientName').value,
        clientEmail: document.getElementById('clientEmail').value,
        serviceType: document.getElementById('serviceType').value,
        serviceDate: document.getElementById('serviceDate').value,
        nextMaintenance: document.getElementById('nextMaintenance').value,
        notes: document.getElementById('notes').value,
        createdBy: JSON.parse(localStorage.getItem('currentUser')).username
    };

    services.push(service);
    saveServices();
    displayServices();
    event.target.reset();
}

// Função para exibir os serviços
function displayServices() {
    const servicesList = document.getElementById('servicesList');
    servicesList.innerHTML = '';

    if (services.length === 0) {
        servicesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <p>Nenhum serviço registrado ainda.</p>
            </div>
        `;
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    services.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';

        const maintenanceDate = new Date(service.nextMaintenance);
        const today = new Date();
        const daysUntilMaintenance = Math.ceil((maintenanceDate - today) / (1000 * 60 * 60 * 24));

        serviceCard.innerHTML = `
            <div class="service-header">
                <h3><i class="fas fa-user"></i> ${service.clientName}</h3>
                ${currentUser.username === service.createdBy || currentUser.isAdmin ? `
                    <button onclick="deleteService(${service.id})" class="delete-btn">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                ` : ''}
            </div>
            <div class="service-info">
                <i class="fas fa-envelope"></i> ${service.clientEmail}
            </div>
            <div class="service-info">
                <i class="fas fa-cog"></i> ${service.serviceType}
            </div>
            <div class="service-info">
                <i class="fas fa-calendar-alt"></i> Data do Serviço: ${formatDate(service.serviceDate)}
            </div>
            <div class="service-info">
                <i class="fas fa-clock"></i> Próxima Manutenção: ${formatDate(service.nextMaintenance)}
            </div>
            ${service.notes ? `
                <div class="service-info">
                    <i class="fas fa-sticky-note"></i> ${service.notes}
                </div>
            ` : ''}
            <div class="service-info">
                <i class="fas fa-user-circle"></i> Registrado por: ${service.createdBy}
            </div>
            ${daysUntilMaintenance <= 30 ? `
                <div class="maintenance-alert">
                    <i class="fas fa-exclamation-triangle"></i>
                    Manutenção programada em ${daysUntilMaintenance} dias!
                </div>
            ` : ''}
        `;

        servicesList.appendChild(serviceCard);

        // Enviar notificação se a manutenção estiver próxima
        if (daysUntilMaintenance <= 30) {
            notifyMaintenance(service);
        }
    });
}

// Função para formatar a data
function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
}

// Função para excluir um serviço
function deleteService(id) {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
        services = services.filter(service => service.id !== id);
        saveServices();
        displayServices();
    }
}

// Função para notificar sobre manutenção próxima
function notifyMaintenance(service) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Lembrete de Manutenção', {
            body: `A manutenção do serviço para ${service.clientName} está se aproximando!`,
            icon: 'https://cdn-icons-png.flaticon.com/512/2097/2097743.png'
        });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                notifyMaintenance(service);
            }
        });
    }
}

// Event Listeners
document.getElementById('serviceForm').addEventListener('submit', addService); 