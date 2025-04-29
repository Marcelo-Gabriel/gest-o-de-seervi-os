// Verificar autenticação
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    // Exibir nome do usuário logado
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const header = document.querySelector('header h1 .user-info');
        header.textContent = `(${currentUser.username})`;
    }

    // Carregar filtros
    loadFilters();
    // Gerar relatório inicial
    generateReport();
});

// Função para fazer logout
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Carregar opções de filtro
async function loadFilters() {
    try {
        const response = await fetch('http://localhost:3000/api/services');
        if (!response.ok) {
            throw new Error('Erro ao carregar serviços');
        }
        const services = await response.json();

        const clientFilter = document.getElementById('clientFilter');
        const serviceTypeFilter = document.getElementById('serviceTypeFilter');

        // Obter clientes únicos
        const uniqueClients = [...new Set(services.map(service => service.clientName))];
        uniqueClients.forEach(client => {
            const option = document.createElement('option');
            option.value = client;
            option.textContent = client;
            clientFilter.appendChild(option);
        });

        // Obter tipos de serviço únicos
        const uniqueServiceTypes = [...new Set(services.map(service => service.serviceType))];
        uniqueServiceTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            serviceTypeFilter.appendChild(option);
        });

        // Configurar data inicial e final
        const today = new Date();
        const startDate = document.getElementById('startDate');
        const endDate = document.getElementById('endDate');
        
        startDate.value = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        endDate.value = today.toISOString().split('T')[0];

        // Configurar evento para mostrar/esconder datas personalizadas
        document.getElementById('dateRange').addEventListener('change', function() {
            const customDateRange = document.querySelector('.custom-date-range');
            customDateRange.style.display = this.value === 'custom' ? 'block' : 'none';
        });
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar filtros. Por favor, tente novamente.');
    }
}

// Gerar relatório
async function generateReport() {
    try {
        const response = await fetch('http://localhost:3000/api/services');
        if (!response.ok) {
            throw new Error('Erro ao carregar serviços');
        }
        const services = await response.json();

        const dateRange = document.getElementById('dateRange').value;
        const clientFilter = document.getElementById('clientFilter').value;
        const serviceTypeFilter = document.getElementById('serviceTypeFilter').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        // Filtrar serviços
        let filteredServices = services.filter(service => {
            const serviceDate = new Date(service.serviceDate);
            let dateMatch = true;

            if (dateRange !== 'custom') {
                const days = parseInt(dateRange);
                const cutoffDate = new Date();
                cutoffDate.setDate(cutoffDate.getDate() - days);
                dateMatch = serviceDate >= cutoffDate;
            } else {
                dateMatch = serviceDate >= new Date(startDate) && serviceDate <= new Date(endDate);
            }

            const clientMatch = clientFilter === 'all' || service.clientName === clientFilter;
            const typeMatch = serviceTypeFilter === 'all' || service.serviceType === serviceTypeFilter;

            return dateMatch && clientMatch && typeMatch;
        });

        // Atualizar resumo
        updateSummary(filteredServices);
        // Atualizar tabela
        updateTable(filteredServices);
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao gerar relatório. Por favor, tente novamente.');
    }
}

// Atualizar resumo
function updateSummary(services) {
    const totalServices = services.length;
    const uniqueClients = new Set(services.map(service => service.clientName)).size;
    const uniqueServiceTypes = new Set(services.map(service => service.serviceType)).size;
    
    const today = new Date();
    const upcomingMaintenance = services.filter(service => {
        const maintenanceDate = new Date(service.nextMaintenance);
        const daysUntilMaintenance = Math.ceil((maintenanceDate - today) / (1000 * 60 * 60 * 24));
        return daysUntilMaintenance <= 30;
    }).length;

    document.getElementById('totalServices').textContent = totalServices;
    document.getElementById('totalClients').textContent = uniqueClients;
    document.getElementById('totalServiceTypes').textContent = uniqueServiceTypes;
    document.getElementById('upcomingMaintenance').textContent = upcomingMaintenance;
}

// Atualizar tabela
function updateTable(services) {
    const tbody = document.getElementById('servicesTableBody');
    tbody.innerHTML = '';

    services.forEach(service => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${service.clientName}</td>
            <td>${service.clientEmail}</td>
            <td>${service.serviceType}</td>
            <td>${formatDate(service.serviceDate)}</td>
            <td>${formatDate(service.nextMaintenance)}</td>
            <td>${service.createdBy}</td>
        `;
        tbody.appendChild(row);
    });
}

// Função para formatar data
function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
}

// Exportar para PDF
function exportToPDF() {
    // Aqui você pode implementar a exportação para PDF usando uma biblioteca como jsPDF
    alert('Funcionalidade de exportação para PDF será implementada em breve!');
} 