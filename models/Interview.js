const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
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
}, { timestamps: true });

module.exports = mongoose.model('Interview', InterviewSchema);
