const express = require('express');
const { nanoid } = require('nanoid')
const Interview = require('../models/Interview')

const router = express.Router();

// Interview Route
router.post('/interview', async (req, res) => {
    const { longUrl, questions } = req.body;
    try {
        const shortId = nanoid(6);
        const interview = new Interview({ shortId, longUrl, questions });
        await interview.save();
        res.status(201).json({ shortUrl: `https://tiptop-front.vercel.app/${shortId}` })
    } catch (err) {
        console.log(err)
    }
    
});

// Redirect to the long URL
router.get('/:shortId', async (req, res) => {
    const { shortId } = req.params;
    try {
        const interview = await Interview.findOne({ shortId });
        if(interview) {
            res.status(200).send(interview.questions);
        } else {
            res.status(404).send('URL not found');
        }
    } catch (err) {
        console.log(err);
    }
    
})

module.exports = router;
