const { status } = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { candidateService, uploadService, transcriptionService } = require('../services')

const interviewUrl = catchAsync(async(req, res) => {
    try {

        const interview = await candidateService.getInterviewUrl(req.params)
        res.status(status.OK).json({interview});

    } catch (err) {
        console.log("Error", err)
        res.status(status.INTERNAL_SERVER_ERROR).send("Failed to get Interview", err)
    }
})

const uploadAudio = catchAsync(async (req, res) => {
    try {
        const result = await uploadService.uploadAndTranscribeAudio(req.file, req.body);
        res.status(200).json({ jobId: result, message: "Transcription job started" });
    } catch (err) {
        console.error("Error", err); // Print the error to debug

        // Respond properly with a status code
        res.status(status.INTERNAL_SERVER_ERROR).send({ message: "Failed to upload audio", error: err.message });
    }
});


const transcriptionAudio = catchAsync(async(req, res) => {
    try {
        const data = await transcriptionService.getTranscription(req.params.id);
    
        res.status(status.OK).send({ data });
    } catch(err) {
        console.error("Error", err); // Print the error to debug

        // Respond properly with a status code
        res.status(status.INTERNAL_SERVER_ERROR).send({ message: "Failed to transcribe audio", error: err.message });
    }
    
})

const updateInterview = catchAsync(async(req, res) => {
    const data = await candidateService.updateInterviewByShortId(req.body);

    res.status(status.OK).send({ data });
})

module.exports = {
    interviewUrl,
    uploadAudio,
    transcriptionAudio,
    updateInterview,
}