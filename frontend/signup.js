document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = {
        username: document.getElementById('username').value,
        firstname: document.getElementById('firstname').value,
        lastname: document.getElementById('lastname').value,
        password: document.getElementById('password').value
    };

    const response = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });

    const data = await response.json();
    alert(data.message);
});
