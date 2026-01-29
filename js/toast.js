// Toast Notification System - CreditScore
// Componente reutilizável para notificações

const Toast = {
    container: null,

    // Inicializa o container de toasts
    init() {
        if (this.container) return;
        
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    },

    // Mostra toast de sucesso
    success(message, duration = 4000) {
        return this.show(message, 'success', duration);
    },

    // Mostra toast de erro
    error(message, duration = 4000) {
        return this.show(message, 'error', duration);
    },

    // Mostra toast de aviso
    warning(message, duration = 4000) {
        return this.show(message, 'warning', duration);
    },

    // Mostra toast informativo
    info(message, duration = 4000) {
        return this.show(message, 'info', duration);
    },

    // Método principal para mostrar toast
    show(message, type = 'info', duration = 4000) {
        this.init();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Ícones para cada tipo
        const icons = {
            success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
            </svg>`,
            error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>`,
            warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>`,
            info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>`
        };

        toast.innerHTML = `
            <div class="toast-icon">${icons[type]}</div>
            <div class="toast-content">
                <p class="toast-message">${message}</p>
            </div>
            <button class="toast-close" onclick="Toast.dismiss(this.parentElement)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
            <div class="toast-progress">
                <div class="toast-progress-bar" style="animation-duration: ${duration}ms"></div>
            </div>
        `;

        this.container.appendChild(toast);

        // Controle de timeout
        let timeoutId = null;
        let remainingTime = duration;
        let startTime = Date.now();
        const progressBar = toast.querySelector('.toast-progress-bar');

        // Função para iniciar o timer
        const startTimer = () => {
            startTime = Date.now();
            progressBar.style.animationPlayState = 'running';
            timeoutId = setTimeout(() => {
                this.dismiss(toast);
            }, remainingTime);
        };

        // Função para pausar o timer
        const pauseTimer = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            remainingTime -= (Date.now() - startTime);
            progressBar.style.animationPlayState = 'paused';
        };

        // Event listeners para hover
        toast.addEventListener('mouseenter', pauseTimer);
        toast.addEventListener('mouseleave', startTimer);

        // Anima entrada
        requestAnimationFrame(() => {
            toast.classList.add('toast-show');
        });

        // Inicia o timer
        startTimer();

        return toast;
    },

    // Remove toast com animação
    dismiss(toast) {
        if (!toast || toast.classList.contains('toast-hide')) return;
        
        toast.classList.remove('toast-show');
        toast.classList.add('toast-hide');
        
        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
        }, 300);
    },

    // Remove todos os toasts
    dismissAll() {
        if (!this.container) return;
        
        const toasts = this.container.querySelectorAll('.toast');
        toasts.forEach(toast => this.dismiss(toast));
    }
};

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => Toast.init());
