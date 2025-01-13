const { getGfsBucket } = require("../config/db");
const { transcriptionService } = require("./");
const { Readable } = require("stream");
const fs = require("fs");
const { ASSEMBLYAI_API_KEY, ASSEMBLYAI_API_URL } = require("../config/assemblyAIConfig");
const ApiError = require('../utils/ApiError');
const { status } = require('http-status');
const axios = require("axios");

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


async function uploadAndTranscribeAudio(file) {
    const gfsBucket = await getGfsBucket();

    // Prepare readable stream
    const readableStream = new Readable();
    readableStream.push(file.buffer);
    readableStream.push(null);

    // Upload to GridFS
    const uploadStream = gfsBucket.openUploadStream(file.originalname, {
        contentType: file.mimetype,
    });

    readableStream.pipe(uploadStream);

    return new Promise((resolve, reject) => {
        uploadStream.on("finish", async () => {
            try {
                const tempFilePath = `./temp_${file.originalname}`;

                // Save uploaded file locally
                const downloadStream = gfsBucket.openDownloadStream(uploadStream.id);
                const writeStream = fs.createWriteStream(tempFilePath);
                downloadStream.pipe(writeStream);
                await new Promise((res, rej) => {
                    writeStream.on("finish", res);
                    writeStream.on("error", rej);
                });

                // Upload to AssemblyAI
                const audioUrl = await uploadToAssemblyAI(tempFilePath);

                const transcriptId = await transcribeAudio(audioUrl);
                resolve({ transcriptId, audioID: uploadStream.id });
            } catch (err) {
                console.error("Error during upload and transcription:", err);
                reject(err);
            }
        });

        uploadStream.on("error", reject);
    });
}

module.exports = { uploadAndTranscribeAudio };
