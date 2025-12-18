// Dashboard Module - CreditScore

let assessments = [];
let currentFilter = 'all';
let selectedAssessment = null;

document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
    loadAssessments();
    setupFilterTabs();
});

function initDashboard() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        const userData = JSON.parse(user);
        document.getElementById('headerUserName').textContent = userData.name.split(' ')[0];
        document.getElementById('loginLink').style.display = 'none';
        document.getElementById('signupLink').style.display = 'none';
        document.getElementById('logoutLink').style.display = 'block';
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

// Modal: Nova Avaliação
function openNewAssessmentModal() {
    document.getElementById('newAssessmentModal').classList.add('show');
}

function closeModal() {
    document.getElementById('newAssessmentModal').classList.remove('show');
}

function startAssessment() {
    window.location.href = 'assessment.html';
}

// Modal: Detalhes
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
    if (confirm('Tem certeza que deseja excluir esta avaliação? Esta ação não pode ser desfeita.')) {
        deleteAssessmentByProtocol(protocol);
    }
}

function deleteAssessment() {
    if (!selectedAssessment) return;
    if (confirm('Tem certeza que deseja excluir esta avaliação?')) {
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

// Close modals on overlay click
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