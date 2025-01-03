const mongoose = require('mongoose');

const InterviewTemplateSchema = new mongoose.Schema({
    candidatePosition: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    questions: {
        type: Array,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('InterviewTemplate', InterviewTemplateSchema);
