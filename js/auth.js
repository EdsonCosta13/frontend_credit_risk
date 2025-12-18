// Auth Module - CreditScore

// Input masks
document.addEventListener('DOMContentLoaded', () => {
    setupInputMasks();
    setupEnterKey();
});

function setupInputMasks() {
    const cpfInput = document.getElementById('signupCPF');
    const phoneInput = document.getElementById('signupPhone');

    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '').slice(0, 11);
            v = v.replace(/(\d{3})(\d)/, '$1.$2');
            v = v.replace(/(\d{3})(\d)/, '$1.$2');
            v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = v;
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '').slice(0, 11);
            v = v.replace(/(\d{2})(\d)/, '($1) $2');
            v = v.replace(/(\d{5})(\d)/, '$1-$2');
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
        alert('Preencha todos os campos.');
        return;
    }

    if (!validateEmail(email)) {
        alert('Email inválido.');
        return;
    }

    // Simulated auth
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'dashboard.html';
    } else {
        alert('Email ou senha incorretos.');
    }
}

function handleSignup() {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const cpf = document.getElementById('signupCPF').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const acceptTerms = document.getElementById('acceptTerms').checked;

    if (!name || !email || !cpf || !phone || !password || !confirmPassword) {
        alert('Preencha todos os campos.');
        return;
    }

    if (!validateEmail(email)) {
        alert('Email inválido.');
        return;
    }

    if (cpf.length < 14) {
        alert('CPF inválido.');
        return;
    }

    if (phone.length < 14) {
        alert('Telefone inválido.');
        return;
    }

    if (password.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres.');
        return;
    }

    if (password !== confirmPassword) {
        alert('As senhas não coincidem.');
        return;
    }

    if (!acceptTerms) {
        alert('Você deve aceitar os termos de uso.');
        return;
    }

    // Check if user exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
        alert('Este email já está cadastrado.');
        return;
    }

    // Create user
    const newUser = { id: Date.now(), name, email, cpf, phone, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Conta criada com sucesso!');
    window.location.href = 'signin.html';
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'signin.html';
}