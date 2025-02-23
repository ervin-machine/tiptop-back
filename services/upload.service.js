const { getGfsBucket } = require("../config/db");
const { uploadToAssemblyAI } = require('./transcription.service');
const { Readable } = require("stream");
const fs = require("fs");


async function uploadAndTranscribeAudio(file, interviewBody) {
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
                await uploadToAssemblyAI(tempFilePath, interviewBody, uploadStream.id);

                resolve();
            } catch (err) {
                console.error("Error during upload and transcription:", err);
                reject(err);
            }
        });

        uploadStream.on("error", reject);
    });
}

module.exports = { uploadAndTranscribeAudio };
