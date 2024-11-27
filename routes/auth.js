const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Registration Route
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ firstName, lastName, email, password });
        await user.save();
        
        res.cookie('token', token, {

            httpOnly: true,
            
            secure: true, // Use true if your site is served over HTTPS
            
            sameSite: 'None', // Set to 'None' for cross-origin access
            
            }); 

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.cookie('token', token, {

            httpOnly: true,
            
            secure: true, // Use true if your site is served over HTTPS
            
            sameSite: 'None', // Set to 'None' for cross-origin access
            
            }); 

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
