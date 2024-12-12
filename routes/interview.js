
const express = require('express');
const Interview = require('../models/Interview');

const router = express.Router();

// Interview Route
router.get('/', async (req, res) => {
    try {
        const interviews = await Interview.find({});
        res.json({ interviews })
    } catch (err) {
        console.log(err)
    }
    
});



module.exports = router;
