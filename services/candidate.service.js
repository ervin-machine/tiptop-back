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
    const { questions, shortId } = interviewBody;
    try {
        const interview = await Interview.findOne({ shortId });
        const filter = { _id: interview._id };
        const update = { questions: questions, isFinished: true };

        const result = await Interview.findByIdAndUpdate(filter, update, { new: true });
        if (result) {
            return result;
          } else {
            throw new ApiError(status.BAD_REQUEST, 'No item found with the given ID.');
          }
    } catch(error) {
        console.error("Error:", error);
        res.status(status.INTERNAL_SERVER_ERROR).send("Error updating interview.");
    }
}

module.exports = {
    getInterviewUrl,
    updateInterviewByShortId,
}