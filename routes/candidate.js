const express = require('express');
const { nanoid } = require('nanoid');
const axios = require('axios');
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();
const multer = require("multer");
const { Readable } = require("stream");
const { getGfsBucket } = require("../config/db");
const Interview = require('../models/Interview');


const router = express.Router();
const ASSEMBLYAI_API_KEY = process.env.ASSEMBLY_API_KEY;
const ASSEMBLYAI_API_URL = process.env.ASSEMBLY_API_URL;

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Interview Route
router.post('/interview', async (req, res) => {
    const { longUrl, questions } = req.body;
    try {
        const shortId = nanoid(6);
        const isFinished = false;
        const interview = new Interview({ shortId, longUrl, questions, isFinished });
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

router.post("/upload-audio", upload.single("audio"), async (req, res) => {
    try {
        const gfsBucket = await getGfsBucket();
        const readableStream = new Readable();
        readableStream.push(req.file.buffer);
        readableStream.push(null);

        const uploadStream = gfsBucket.openUploadStream(req.file.originalname, {
            contentType: req.file.mimetype,
        });

        readableStream.pipe(uploadStream);

        uploadStream.on("finish", async () => {
            const fileCursor = gfsBucket.find({}).sort({ uploadDate: -1 }).limit(1);
            const files = await fileCursor.toArray();

        if(files.length === 0) {
            return res.status(404).send("No audio files find");
        }
            const downloadStream = await gfsBucket.openDownloadStream(uploadStream.id);
            const tempFilePath = `./temp_${req.file.originalname}.mp3`;
    
            const writeStream = fs.createWriteStream(tempFilePath);
            downloadStream.pipe(writeStream);
    
            await new Promise((resolve, reject) => {
                writeStream.on("finish", resolve);
                writeStream.on("error", reject);
            });
    
            const fileData = fs.createReadStream(tempFilePath);
    
            const uploadResponse = await axios.post(
                `${ASSEMBLYAI_API_URL}/upload`,
                fileData,
                {
                    headers: {
                        authorization: ASSEMBLYAI_API_KEY
                    },
                }
            );
    
            const audioUrl = uploadResponse.data.upload_url;
    
            const transcriptionResponse = await axios.post(
                `${ASSEMBLYAI_API_URL}/transcript`,
                {
                    audio_url: audioUrl,
                    summarization: true
                },
                {
                    headers: { authorization: ASSEMBLYAI_API_KEY },
                }
            );
    
            const transcriptId = transcriptionResponse.data.id;
            res.json({ transcriptId, audioID: uploadStream.id });
        });

        uploadStream.on("error", (err) => {
            res.status(500).send("Error uploading file: " + err);
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error uploading or transcribing the audio.");
    }
});

router.get("/transcription/:id", async (req, res) => {
    const transcriptId = req.params.id;
    try {
        const response = await axios.get(
            `${ASSEMBLYAI_API_URL}/transcript/${transcriptId}`,
            {
                headers: { authorization: ASSEMBLYAI_API_KEY },
            }
        );

        res.json(response.data);
    } catch(error) {
        console.error("Error:", error);
        res.status(500).send("Error retrieving the transcription.");
    }
})

router.put("/:shortId", async (req, res) => {
    const { questions, shortId } = req.body;
    try {
        const interview = await Interview.findOne({ shortId });
        const filter = { _id: interview._id };
        const update = { questions: questions };

        const result = await Interview.findByIdAndUpdate(filter, update, { new: true });
        if (result) {
            res.json({ update });
          } else {
            console.log("No item found with the given ID.");
          }
    } catch(error) {
        console.error("Error:", error);
        res.status(500).send("Error retrieving the transcription.");
    }
})

router.get('/audio/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const gfsBucket = await getGfsBucket();

        const audioId = new mongoose.Types.ObjectId(id);

        const downloadStream = gfsBucket.openDownloadStream(audioId);

        res.set({
            'Content-Type': 'audio/mpeg',
        });

        downloadStream.pipe(res);

        downloadStream.on('error', (err) => {
            console.error("Error streaming file", err);
            res.status(500).send("Error streaming file");
        });

        
    } catch (err) {
        console.log(err)
    }
})

module.exports = router;
