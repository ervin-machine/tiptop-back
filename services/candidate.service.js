const { status } = require('http-status');
const { Interview } = require('../models');
const ApiError = require('../utils/ApiError');

const getInterviewUrl = async (interviewBody) => {
    const { shortId } = interviewBody
    
    const interview = await Interview.findOne({ shortId });
    if(interview) {
        return interview
    } else {
        throw new ApiError(status.BAD_REQUEST, 'Interview is not found');
    }
}

const updateInterviewByShortId = async (interviewBody) => {
    const { transcriptionData, activeStep, shortId, uploadID } = interviewBody;

    try {
        const interview = await Interview.findOne({ shortId });

        if (!interview) {
            throw new ApiError(status.BAD_REQUEST, 'No interview found with the given shortId.');
        }
        
        let questions = interview.questions || [];
        if(questions[activeStep]){
        questions[activeStep].transcribe = transcriptionData?.text
        questions[activeStep].summarization = transcriptionData?.summary
        questions[activeStep].answer = uploadID}

        const result = await Interview.findOneAndUpdate(
            { shortId },
            { $set: { questions: questions } },
            { new: true }
        );

        if (!result) {
            throw new ApiError(status.BAD_REQUEST, 'No item found with the given ID.');
        }

        return result;
    } catch (error) {
        console.error("Error updating interview:", error);
    }
};


module.exports = {
    getInterviewUrl,
    updateInterviewByShortId,
}