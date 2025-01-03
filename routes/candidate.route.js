const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const multer = require("multer");
const { candidateController } = require('../controllers')
const { candidateValidation } = require('../validations')
const validate = require('../middlewares/validate')

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/:shortId', validate(candidateValidation.interviewUrl), candidateController.interviewUrl)
router.post("/upload-audio", upload.single("audio"), candidateController.uploadAudio);
router.get("/transcription/:id", candidateController.transcriptionAudio);
router.put("/:shortId", candidateController.updateInterview)

module.exports = router;
