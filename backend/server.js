require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const userRoutes = require('./routes/userRoutes');
const Message = require('./models/Message'); // Import Message model

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

// Middleware
app.use(express.json());
app.use(cors());
app.use('/api/users', userRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.log('❌ MongoDB Connection Error:', err));

// WebSocket Connection
io.on('connection', (socket) => {
    console.log(`⚡ User connected: ${socket.id}`);

    // Join Room
    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`👤 User ${socket.id} joined room: ${room}`);
    });

    socket.on('sendMessage', async (data) => {
        console.log(`📩 Message received from ${data.username}: ${data.message} in room ${data.room}`);
    
        try {
            // Save message to MongoDB
            const newMessage = new Message({ from_user: data.username, room: data.room, message: data.message });
            await newMessage.save();
    
            // Emit message to all users in the room
            io.to(data.room).emit('receiveMessage', { username: data.username, message: data.message });
        } catch (error) {
            console.log('❌ Error saving message:', error);
        }
    });
    
    // Typing Indicator
    socket.on('typing', (data) => {
        socket.to(data.room).emit('displayTyping', { username: data.username });
    });

    // Disconnect Event
    socket.on('disconnect', () => {
        console.log(`🚪 User disconnected: ${socket.id}`);
    });
});

// Start Server
server.listen(5000, () => console.log('🚀 Server running on port 5000'));
