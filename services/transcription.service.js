const axios = require("axios");
const fs = require("fs");
const { ASSEMBLYAI_API_KEY, ASSEMBLYAI_API_URL } = require("../config/assemblyAIConfig");
const ApiError = require('../utils/ApiError');
const { status } = require('http-status');
const { transcriptionQueue } = require("./transcriptionQueue");

async function uploadToAssemblyAI(filePath, interviewBody, uploadID) {
    try {
        const fileData = fs.createReadStream(filePath);
        const response = await axios.post(
            `${ASSEMBLYAI_API_URL}/upload`,
            fileData,
            { headers: { authorization: ASSEMBLYAI_API_KEY } }
        );

        const audioUrl = response.data.upload_url;

        const job = await transcriptionQueue.add("transcribeJob", { audioUrl, interviewBody, uploadID });
        return job.id;
    } catch (err) {
        console.error("Error uploading audio:", err);
        throw new ApiError(status.INTERNAL_SERVER_ERROR, 'Error uploading audio.');
    }
}

async function transcribeAudio(audioUrl) {
    try {
        const response = await axios.post(
            `${ASSEMBLYAI_API_URL}/transcript`,
            { audio_url: audioUrl, summarization: true },
            { headers: { authorization: ASSEMBLYAI_API_KEY } }
        );

        return response.data.id;
    } catch (err) {
        console.error("Error retrieving transcription ID:", err);
        throw new ApiError(status.INTERNAL_SERVER_ERROR, 'Error retrieving transcription ID.');
    }
}

async function getTranscription(transcriptId) {
    try {
        const response = await axios.get(
            `${ASSEMBLYAI_API_URL}/transcript/${transcriptId}`,
            { headers: { authorization: ASSEMBLYAI_API_KEY } }
        );

        return response;
    } catch (error) {
        console.error("Error retrieving transcription:", error);
        throw new ApiError(status.INTERNAL_SERVER_ERROR, 'Error retrieving transcription.');
    }
}

module.exports = { uploadToAssemblyAI, transcribeAudio, getTranscription };
