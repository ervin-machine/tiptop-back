const mongoose = require("mongoose");
const { getGfsBucket } = require("../config/db");
const { status } = require('http-status');
const ApiError = require('../utils/ApiError');
const { Interview, InterviewTemplate } = require('../models');
const { nanoid } = require('nanoid');
const _ = require('lodash');
const sortArray = require("../utils/sortArray")

async function createInterview(interviewBody) {
    const { candidatePosition, candidateFirstName, candidateLastName, candidateEmail, createdBy, longUrl, questions } = interviewBody;
    
    try {

        const shortId = nanoid(6);
        const isFinished = false;
        const interview = new Interview({ candidatePosition, candidateFirstName, candidateLastName, candidateEmail, createdBy, shortId, longUrl, questions, isFinished });
        await interview.save();
        return `https://tiptop-front.vercel.app/${shortId}`

    } catch (err) {
        console.log(err)
        throw new ApiError(status.BAD_REQUEST, "Error while creating interview");
    }
}

async function getInterviewByPosition(candidatePosition) {
    return await Interview.find({ candidatePosition })
}

async function getInterviewByCandidateMail(candidateEmail, candidateFirstName, candidateLastName) {
    return await Interview.find({ candidateEmail, candidateFirstName, candidateLastName })
}

async function checkInterview(interviewBody) {
    const { candidatePosition, candidateEmail, candidateFirstName, candidateLastName, questions } = interviewBody
    try {
        const interviewByPosition = await getInterviewByPosition(candidatePosition)
        const interviewByCandidateEmail = await getInterviewByCandidateMail(candidateEmail, candidateFirstName, candidateLastName);

        if(interviewByCandidateEmail.length > 0) {
            const areEqual = interviewByCandidateEmail[0].questions.length === questions.length &&
                                interviewByCandidateEmail[0].questions.every((obj, index) => {
                                    return parseInt(obj.id) === parseInt(questions[index].id) && obj.question === questions[index].question;
                                });

            return {
                errorType: "ErrorByQuery",
                areEqual,
                errorText: ""
            }
        }

        if(interviewByPosition.length === 0) {
            return {
                errorType: "candidatePosition",
                areEqual: false,
                errorText: ""
            }
        }

        return {
            errorType: "candidatePosition",
            areEqual: interviewByPosition.length > 0 && interviewByPosition[0].candidatePosition === candidatePosition,
            errorText: interviewByPosition.length > 0 && interviewByPosition[0].candidatePosition === candidatePosition ? "Interview with this position already exist" : ""
        }


    } catch (err) {
        console.error("Error in getting interveiws:", err);
        throw new ApiError(status.BAD_REQUEST, "Could not get interviews");
    }
}

async function createInterviewTemplate(interviewBody) {
    const { createdBy, candidatePosition, questions } = interviewBody;

    try {
        const interviewTemplate = new InterviewTemplate({ createdBy, candidatePosition, questions });
        await interviewTemplate.save();
        return interviewTemplate

    } catch (err) {
        console.log(err)
        throw new ApiError(status.BAD_REQUEST, "Error while creating interview template");
    }
}

async function getAllInterviews(interviewBody) {
    const { userID } = interviewBody

    try {
        const interviews = await Interview.find({ createdBy: userID });
        return interviews;
    } catch (err) {
        console.error("Error in getting interveiws:", err);
        throw new ApiError(status.BAD_REQUEST, "Could not get interviews");
    }
}

async function getAllInterviewTemplates(interviewBody) {
    const { userID } = interviewBody

    try {
        const interviewTemplates = await InterviewTemplate.find({ createdBy: userID });

        return interviewTemplates;
    } catch (err) {
        console.error("Error in getting interveiws:", err);
        throw new ApiError(status.BAD_REQUEST, "Could not get interview templates");
    }
}

async function getInterview(interviewBody) {
    const { shortId } = interviewBody

    try {
        const interview = await Interview.find({ shortId: shortId });
        return interview;
    } catch (err) {
        console.error("Error in getting interveiw:", err);
        throw new ApiError(status.BAD_REQUEST, "Could not get interview");
    }
}

async function deleteInterview(shortId) {

    try {
        const deleteInterview = await Interview.deleteOne({ shortId });

        return deleteInterview;
    } catch (err) {
        console.error("Error in deleting interveiw:", err);
        throw new ApiError(status.BAD_REQUEST, "Could not delete interview");
    }
}

async function updateInterview(interviewBody) {
    const { _id, candidatePosition, candidateFirstName, candidateLastName, candidateEmail, questions } = interviewBody;
    try {

        const filter = { _id: _id };
        const update = { candidatePosition, candidateFirstName, candidateLastName, candidateEmail, questions };

        const result = await Interview.findByIdAndUpdate(filter, update, { new: true });
        if (result) {
            return result;
          } else {
            throw new ApiError(status.BAD_REQUEST, 'No item found with the given ID.');
          }
    } catch (err) {
        console.error("Error in deleting interveiw:", err);
        throw new ApiError(status.BAD_REQUEST, "Could not update interview");
    }
}

async function streamAudioFile(audioId, res) {
    try {
        const gfsBucket = await getGfsBucket();

        const audioObjectId = new mongoose.Types.ObjectId(audioId);

        const downloadStream = gfsBucket.openDownloadStream(audioObjectId);

        res.set({
            "Content-Type": "audio/mpeg",
        });

        // Pipe the file to the response
        downloadStream.pipe(res);

        downloadStream.on("error", (err) => {
            console.error("Error streaming file:", err);
            res.status(status.INTERNAL_SERVER_ERROR).send("Error streaming file");
        });
    } catch (err) {
        console.error("Error in streamAudioFile:", err);
        throw new ApiError(status.BAD_REQUEST, "Could not stream the audio file.");
    }
}

module.exports = { 
    streamAudioFile, 
    getAllInterviews, 
    checkInterview,
    createInterview, 
    createInterviewTemplate, 
    getAllInterviewTemplates, 
    getInterview, 
    deleteInterview, 
    updateInterview,
};
