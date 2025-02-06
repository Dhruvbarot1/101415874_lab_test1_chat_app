const socket = io('http://localhost:5000');
const username = localStorage.getItem('username');

document.getElementById('user').textContent = username;

// Join Room
document.getElementById('joinRoom').addEventListener('click', () => {
    const room = document.getElementById('rooms').value;
    socket.emit('joinRoom', room);
    localStorage.setItem('room', room);
    alert(`Joined ${room} room!`);
});

// Send Message
document.getElementById('sendMessage').addEventListener('click', () => {
    const message = document.getElementById('messageInput').value;
    const room = localStorage.getItem('room');

    if (message.trim() !== "") {
        socket.emit('sendMessage', { username, message, room });
        document.getElementById('messageInput').value = "";
    }
});

// Display Messages
socket.on('receiveMessage', (data) => {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('p');
    messageElement.textContent = `${data.username}: ${data.message}`;
    messagesDiv.appendChild(messageElement);
});

// Typing Indicator
document.getElementById('messageInput').addEventListener('keypress', () => {
    const room = localStorage.getItem('room');
    socket.emit('typing', { username, room });
});

socket.on('displayTyping', (data) => {
    document.getElementById('typingIndicator').textContent = `${data.username} is typing...`;
    setTimeout(() => {
        document.getElementById('typingIndicator').textContent = "";
    }, 1000);
});

document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('username');
    window.location.href = 'login.html';
});
