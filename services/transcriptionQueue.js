const { Queue, Worker } = require('bullmq');
const { REDIS_HOST, REDIS_PORT, REDIS_ACCESS } = require("../config/dotenv");
const axios = require("axios");
const { ASSEMBLYAI_API_KEY, ASSEMBLYAI_API_URL } = require("../config/assemblyAIConfig");
const ApiError = require('../utils/ApiError');
const { status } = require('http-status');
const { updateInterviewByShortId } = require('./candidate.service')

const transcriptionQueue = new Queue('transcriptionQueue', {
    connection: { host: REDIS_HOST, port: 6380, password: REDIS_ACCESS, tls: {} }
});

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


const worker = new Worker(
    'transcriptionQueue', 
    async (job) => {
        const { audioUrl, interviewBody, uploadID } = job.data;

        try {
            const transcriptId = await transcribeAudio(audioUrl);

            let transcriptionData;
            do {
                await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
                const statusResponse = await getTranscription(transcriptId);
                transcriptionData = statusResponse.data;
            } while (transcriptionData.status !== "completed" && transcriptionData.status !== "failed");

            await updateInterviewByShortId({ transcriptionData, activeStep: interviewBody.activeStep, shortId: interviewBody.shortId, uploadID });

            return transcriptionData;
        } catch (error) {
            console.error("Transcription Error:", error);
            throw error;
        }
    },
    { connection: { host: REDIS_HOST, port: 6380, password: REDIS_ACCESS, tls: {} } }
);


module.exports = { transcriptionQueue };
