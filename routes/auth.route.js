const express = require('express');
const { authController } = require('../controllers')
const { authValidation } = require('../validations');
const validate = require('../middlewares/validate')

const router = express.Router();


router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.put('/change-password', validate(authValidation.changePassword), authController.changePassword);

module.exports = router;
