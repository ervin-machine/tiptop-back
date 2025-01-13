const { status } = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { interviewService } = require('../services')

const newInterview = catchAsync(async(req, res) => {
    
    try {
        const newInterview = await interviewService.createInterview(req.body)

        res.status(status.CREATED).send({ shortUrl: newInterview })

    } catch (err) {
        console.log("Error", err);
        res.status(status.INTERNAL_SERVER_ERROR).send("Failed to create new Interview", err)
    }
})

const newInterviewTemplate = catchAsync(async(req, res) => {
    
    try {
        const newInterview = await interviewService.createInterviewTemplate(req.body)

        res.status(status.CREATED).send({ shortUrl: newInterview })

    } catch (err) {
        console.log("Error", err);
        res.status(status.INTERNAL_SERVER_ERROR).send("Failed to create new Interview template", err)
    }
})

const allInterviews = catchAsync(async(req, res) => {
    try {
        
        const interviews = await interviewService.getAllInterviews(req.query)

        res.status(status.OK).send({ interviews });
    } catch (err) {
        console.log(err)
        res.status(status.INTERNAL_SERVER_ERROR).send("Failed to get all interviews", err);
    }
})

const checkInterview = catchAsync(async (req, res) => {
    try {

        const result = await interviewService.checkInterview(req.query.interview)
        res.status(status.OK).send(result);
    } catch (err) {
        console.error("Error in checkInterview:", err);
        res.status(status.INTERNAL_SERVER_ERROR).send("Failed to get all interviews");
    }
})

const allInterviewTemplates = catchAsync(async(req, res) => {
    try {
        const interviewTemplates= await interviewService.getAllInterviewTemplates(req.query)

        res.status(status.OK).send({ interviewTemplates });
    } catch (err) {
        res.status(status.INTERNAL_SERVER_ERROR).send("Failed to get all interview templates", err);
    }
})

const Interview = catchAsync(async(req, res) => {
    try {
        const interview = await interviewService.getInterview(req.params)

        res.status(status.OK).send({ interview });
    } catch (err) {
        res.status(status.INTERNAL_SERVER_ERROR).send("Failed to get all interview", err);
    }
})

const getAudio = catchAsync(async(req, res) => {
    const { id } = req.params;

    try {
        await interviewService.streamAudioFile(id, res);
    } catch( err ) {
        console.log("Error", err);
        res.status(status.INTERNAL_SERVER_ERROR).send("Failed to stream the audio file", err)
    }
})

const deleteInterview = catchAsync(async(req, res) => {
    const { shortId } = req.params;

    try {
        await interviewService.deleteInterview(shortId)

        res.status(status.OK).send("Interview delete: ");
    } catch (err) {
        console.log("Error", err);
        res.status(status.INTERNAL_SERVER_ERROR).send("Failed to delete interview", err)
    }
})

const updateInterview = catchAsync(async(req, res) => {

    try {
        await interviewService.updateInterview(req.body.interview)

        res.status(status.OK).send("Interview update: ");
    } catch (err) {
        console.log("Error", err);
        res.status(status.INTERNAL_SERVER_ERROR).send("Failed to update interview", err)
    }
})


module.exports = {
    getAudio,
    newInterview,
    checkInterview,
    allInterviews,
    newInterviewTemplate,
    allInterviewTemplates,
    deleteInterview,
    Interview,
    updateInterview,
};