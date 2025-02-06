const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Signup Route (Register New User)
router.post('/signup', async (req, res) => {
    try {
        const { username, firstname, lastname, password } = req.body;

        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "❌ Username already taken" });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, firstname, lastname, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: "✅ User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "❌ Error: " + error.message });
    }
});

// Login Route (Simple Authentication)
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "❌ User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "❌ Incorrect password" });

        // No JWT - Just return username
        res.status(200).json({ username: user.username });
    } catch (error) {
        res.status(500).json({ message: "❌ Error: " + error.message });
    }
});

module.exports = router;
