const axios = require("axios");
const fs = require("fs");
const { ASSEMBLYAI_API_KEY, ASSEMBLYAI_API_URL } = require("../config/assemblyAIConfig");
const ApiError = require('../utils/ApiError');
const { status } = require('http-status');

async function uploadToAssemblyAI(filePath) {
    try {
        const fileData = fs.createReadStream(filePath);

        const response = await axios.post(
            `${ASSEMBLYAI_API_URL}/upload`,
            fileData,
            {
                headers: { authorization: ASSEMBLYAI_API_KEY },
            }
        );
        return response.data.upload_url;
    } catch (err) {
        console.log("Error: ", err)
        throw new ApiError(status.INTERNAL_SERVER_ERROR, 'Error uploading audio.');
    }
}

async function transcribeAudio(audioUrl) {
    try {
        const response = await axios.post(
            `${ASSEMBLYAI_API_URL}/transcript`,
            {
                audio_url: audioUrl,
                summarization: true,
            },
            {
                headers: { authorization: ASSEMBLYAI_API_KEY },
            }
        );
    
        return response.data.id;
    } catch (err) {
        console.log("Error: ", err)
        throw new ApiError(status.INTERNAL_SERVER_ERROR, 'Error retrieving id transcription.');
    }
}

async function getTranscription(transcriptId) {
    try {
        const response = await axios.get(
            `${ASSEMBLYAI_API_URL}/transcript/${transcriptId}`,
            {
                headers: { authorization: ASSEMBLYAI_API_KEY },
            }
        );

        return response.data
    } catch(error) {
        console.error("Error:", error);
        throw new ApiError(status.INTERNAL_SERVER_ERROR, 'Error retrieving the transcription.');
    }
}

module.exports = { uploadToAssemblyAI, transcribeAudio, getTranscription };
