// Auth Module - CreditScore

// Input masks
document.addEventListener('DOMContentLoaded', () => {
    setupInputMasks();
    setupEnterKey();
});

function setupInputMasks() {
    const biInput = document.getElementById('signupBI');

    if (biInput) {
        biInput.addEventListener('input', (e) => {
            let v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 14);
            e.target.value = v;
        });
    }
}

function setupEnterKey() {
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const isSignin = document.getElementById('signinEmail');
                const isSignup = document.getElementById('signupName');
                if (isSignin) handleSignin();
                else if (isSignup) handleSignup();
            }
        });
    });
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function handleSignin() {
    const email = document.getElementById('signinEmail').value.trim();
    const password = document.getElementById('signinPassword').value;

    if (!email || !password) {
        Toast.error('Por favor, preencha todos os campos.');
        return;
    }

    if (!validateEmail(email)) {
        Toast.error('Email inválido. Verifique e tente novamente.');
        return;
    }

    // Simulated auth
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        Toast.success('Login realizado com sucesso!');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        Toast.error('Email ou palavra-passe incorretos. Tente novamente.');
    }
}

function handleSignup() {
    const name = document.getElementById('signupName').value.trim();
    const bi = document.getElementById('signupBI').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    if (!name || !bi || !email || !password) {
        Toast.error('Por favor, preencha todos os campos.');
        return;
    }

    if (name.length < 3) {
        Toast.error('O nome deve ter pelo menos 3 caracteres.');
        return;
    }

    if (bi.length < 10) {
        Toast.error('Nº Bilhete de Identidade inválido.');
        return;
    }

    if (!validateEmail(email)) {
        Toast.error('Email inválido. Verifique e tente novamente.');
        return;
    }

    if (password.length < 6) {
        Toast.error('A palavra-passe deve ter pelo menos 6 caracteres.');
        return;
    }

    // Check if user exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
        Toast.error('Este email já está cadastrado. Faça login ou use outro email.');
        return;
    }

    if (users.find(u => u.bi === bi)) {
        Toast.error('Este Bilhete de Identidade já está cadastrado.');
        return;
    }

    // Create user
    const newUser = { id: Date.now(), name, bi, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    Toast.success('Conta criada com sucesso! Redirecionando...');
    setTimeout(() => {
        window.location.href = 'signin.html';
    }, 1500);
}

function handleLogout() {
    if (confirm('Deseja realmente sair?\n\nVocê poderá continuar navegando como visitante.')) {
        localStorage.removeItem('currentUser');
        Toast.info('Sessão encerrada.');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}
