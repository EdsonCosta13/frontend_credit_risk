// Dashboard Module - CreditScore

let assessments = [];
let currentFilter = 'all';
let selectedAssessment = null;

document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
    loadAssessments();
    setupFilterTabs();
    updateDashboardSubtitle();
});

function updateDashboardSubtitle() {
    const user = localStorage.getItem('currentUser');
    const subtitleEl = document.getElementById('dashboardSubtitle');
    
    if (!subtitleEl) return;
    
    if (!user) {
        subtitleEl.innerHTML = 'Acompanhe e gerencie suas avaliações de crédito<br><small style="color: var(--text-muted); font-size: 12px;">Modo Visitante: Suas avaliações serão salvas apenas neste navegador</small>';
    }
}

function initDashboard() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        try {
            const userData = JSON.parse(user);
            document.getElementById('headerUserName').textContent = userData.name.split(' ')[0];
            document.getElementById('loginLink').style.display = 'none';
            document.getElementById('signupLink').style.display = 'none';
            document.getElementById('logoutLink').style.display = 'block';
        } catch (e) {
            // Se houver erro ao parsear, usa visitante
            document.getElementById('headerUserName').textContent = 'Visitante';
            document.getElementById('loginLink').style.display = 'block';
            document.getElementById('signupLink').style.display = 'block';
            document.getElementById('logoutLink').style.display = 'none';
        }
    } else {
        // Usuário não logado - permite acesso como visitante
        document.getElementById('headerUserName').textContent = 'Visitante';
        document.getElementById('loginLink').style.display = 'block';
        document.getElementById('signupLink').style.display = 'block';
        document.getElementById('logoutLink').style.display = 'none';
    }
}

function toggleUserMenu() {
    document.getElementById('dropdownMenu').classList.toggle('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-dropdown')) {
        document.getElementById('dropdownMenu')?.classList.remove('show');
    }
});

function setupFilterTabs() {
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter;
            renderAssessments();
        });
    });
}

function loadAssessments() {
    assessments = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
    updateStats();
    renderAssessments();
}

function updateStats() {
    const total = assessments.length;
    const approved = assessments.filter(a => a.statusClass === 'approved').length;
    const pending = assessments.filter(a => a.statusClass === 'pending').length;
    const rejected = assessments.filter(a => a.statusClass === 'rejected').length;

    document.getElementById('statTotal').textContent = total;
    document.getElementById('statApproved').textContent = approved;
    document.getElementById('statPending').textContent = pending;
    document.getElementById('statRejected').textContent = rejected;
}

function renderAssessments() {
    const tbody = document.getElementById('assessmentsBody');
    const emptyState = document.getElementById('emptyState');
    const table = document.getElementById('assessmentsTable');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    let filtered = assessments;

    // Apply status filter
    if (currentFilter !== 'all') {
        filtered = filtered.filter(a => a.statusClass === currentFilter);
    }

    // Apply search filter
    if (searchTerm) {
        filtered = filtered.filter(a => 
            a.protocol.toLowerCase().includes(searchTerm) ||
            a.date.toLowerCase().includes(searchTerm)
        );
    }

    if (filtered.length === 0) {
        table.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }

    table.style.display = 'table';
    emptyState.style.display = 'none';

    const statusLabels = {
        approved: 'Aprovado',
        pending: 'Em Análise',
        rejected: 'Rejeitado'
    };

    tbody.innerHTML = filtered.map(a => `
        <tr>
            <td>
                <div class="protocol-cell">
                    <div class="protocol-avatar">
                        ${a.avatar ? `<img src="${a.avatar}" alt="">` : `
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                        `}
                    </div>
                    <span class="protocol-code">${a.protocol}</span>
                </div>
            </td>
            <td>${a.date}</td>
            <td><span class="score-cell">${a.score} pts</span></td>
            <td>${a.duration}</td>
            <td><span class="status-badge ${a.statusClass}">${statusLabels[a.statusClass] || a.status}</span></td>
            <td>
                <div class="actions-cell">
                    <button class="action-btn" onclick="viewAssessment('${a.protocol}')" title="Ver detalhes">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    </button>
                    <button class="action-btn danger" onclick="confirmDelete('${a.protocol}')" title="Excluir">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterAssessments() {
    renderAssessments();
}

function openNewAssessmentModal() {
    const modal = document.getElementById('newAssessmentModal');
    modal.classList.add('show');
    
    // Adicionar aviso se for visitante
    const user = localStorage.getItem('currentUser');
    const modalInfo = modal.querySelector('.modal-info');
    
    if (!user && modalInfo) {
        const existingWarning = modal.querySelector('.visitor-warning');
        if (!existingWarning) {
            const warningDiv = document.createElement('div');
            warningDiv.className = 'modal-info visitor-warning';
            warningDiv.style.marginTop = '12px';
            warningDiv.style.background = 'rgba(255, 179, 0, 0.1)';
            warningDiv.style.borderColor = 'rgba(255, 179, 0, 0.3)';
            warningDiv.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span>Você está no modo visitante. Para salvar permanentemente suas avaliações, <a href="signup.html" style="color: var(--primary); text-decoration: underline;">crie uma conta</a> ou <a href="signin.html" style="color: var(--primary); text-decoration: underline;">faça login</a>.</span>
            `;
            modalInfo.parentNode.insertBefore(warningDiv, modalInfo.nextSibling);
        }
    }
}

function closeModal() {
    document.getElementById('newAssessmentModal').classList.remove('show');
}

function startAssessment() {
    window.location.href = 'assessment.html';
}

function viewAssessment(protocol) {
    selectedAssessment = assessments.find(a => a.protocol === protocol);
    if (!selectedAssessment) return;

    const statusLabels = {
        approved: 'Aprovado',
        pending: 'Em Análise',
        rejected: 'Rejeitado'
    };

    document.getElementById('detailAvatar').innerHTML = selectedAssessment.avatar 
        ? `<img src="${selectedAssessment.avatar}" alt="">` 
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
           </svg>`;
    
    document.getElementById('detailScore').textContent = selectedAssessment.score;
    document.getElementById('detailStatus').textContent = statusLabels[selectedAssessment.statusClass] || selectedAssessment.status;
    document.getElementById('detailStatus').className = `status-badge ${selectedAssessment.statusClass}`;
    document.getElementById('detailMessage').textContent = selectedAssessment.message;
    document.getElementById('detailProtocol').textContent = selectedAssessment.protocol;
    document.getElementById('detailDate').textContent = selectedAssessment.date;
    document.getElementById('detailDuration').textContent = selectedAssessment.duration;
    document.getElementById('detailUser').textContent = selectedAssessment.userName;

    document.getElementById('detailsModal').classList.add('show');
}

function closeDetailsModal() {
    document.getElementById('detailsModal').classList.remove('show');
    selectedAssessment = null;
}

function confirmDelete(protocol) {
    if (confirm('Tem certeza que deseja excluir esta avaliação?\n\nEsta ação não pode ser desfeita e você perderá todos os dados desta avaliação permanentemente.')) {
        deleteAssessmentByProtocol(protocol);
    }
}

function deleteAssessment() {
    if (!selectedAssessment) return;
    if (confirm('Tem certeza que deseja excluir esta avaliação?\n\nEsta ação não pode ser desfeita.')) {
        deleteAssessmentByProtocol(selectedAssessment.protocol);
        closeDetailsModal();
    }
}

function deleteAssessmentByProtocol(protocol) {
    assessments = assessments.filter(a => a.protocol !== protocol);
    localStorage.setItem('assessmentHistory', JSON.stringify(assessments));
    updateStats();
    renderAssessments();
}

function printAssessment() {
    if (!selectedAssessment) return;
    localStorage.setItem('assessmentResult', JSON.stringify(selectedAssessment));
    window.open('result.html', '_blank');
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('show');
        }
    });
});

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('show'));
    }
});