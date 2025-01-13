
const express = require('express');
const { interviewController } = require('../controllers')

const router = express.Router();

// Interview Route
router.get('/', interviewController.allInterviews);
router.post('/', interviewController.newInterview);
router.get('/check', interviewController.checkInterview);
router.post('/template', interviewController.newInterviewTemplate);
router.get('/templates', interviewController.allInterviewTemplates);
router.get('/:shortId', interviewController.Interview);
router.put('/', interviewController.updateInterview);
router.delete('/:shortId', interviewController.deleteInterview);
router.get('/audio/:id', interviewController.getAudio);

module.exports = router;