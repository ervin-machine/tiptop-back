const express = require('express');
const multer = require('multer');
const { authController } = require('../controllers')
const { authValidation } = require('../validations');
const validate = require('../middlewares/validate')
const { getGfsStorateAvatar } = require('../config/db')

const router = express.Router();

// Set up storage engine
const upload = multer({ avatar: getGfsStorateAvatar() });

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.put('/change-password', validate(authValidation.changePassword), authController.changePassword);
router.post('/upload', upload.single('avatar'), authController.uploadAvatar);

module.exports = router;
