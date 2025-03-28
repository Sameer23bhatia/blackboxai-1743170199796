document.addEventListener('DOMContentLoaded', () => {
    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.errors?.[0]?.msg || 'Login failed');
                }
                
                // Store token and redirect
                localStorage.setItem('token', data.token);
                window.location.href = 'index.html';
            } catch (error) {
                alert(error.message);
                console.error('Login error:', error);
            }
        });
    }

    // Handle registration form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, password })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.errors?.[0]?.msg || 'Registration failed');
                }
                
                // Store token and redirect
                localStorage.setItem('token', data.token);
                window.location.href = 'index.html';
            } catch (error) {
                alert(error.message);
                console.error('Registration error:', error);
            }
        });
    }

    // Check authentication status on protected pages
    const protectedPages = ['index.html'];
    if (protectedPages.includes(window.location.pathname.split('/').pop())) {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
        }
    }
});