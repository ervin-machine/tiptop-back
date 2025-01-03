const express = require('express');
const { userController } = require('../controllers')

const router = express.Router();

router.get('/:userID', userController.getUser);
router.put('/', userController.updateUser);

module.exports = router;
