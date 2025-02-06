document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    };

    const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });

    const data = await response.json();
    if (data.username) {
        localStorage.setItem('username', data.username);
        window.location.href = 'chat.html';
    } else {
        alert(data.message || "Login failed!");
    }
});
