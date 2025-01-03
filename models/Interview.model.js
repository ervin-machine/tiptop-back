const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
    candidatePosition: {
        type: String,
        required: true
    },
    candidateFirstName: {
        type: String,
        required: true
    },
    candidateLastName: {
        type: String,
        required: true
    },
    candidateEmail: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    shortId: {
        type: String,
        required: true,
    },
    longUrl: {
        type: String,
        required: true,
    },
    questions: {
        type: Array,
        required: true,
    },
    isFinished: {
        type: Boolean,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Interview', InterviewSchema);
