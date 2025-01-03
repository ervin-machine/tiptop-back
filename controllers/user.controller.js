const { status } = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services')

const getUser = catchAsync(async(req, res) => {
    try {
        
        const user = await userService.getUserById(req.params)
        res.status(status.OK).json({ user });

    } catch (err) {
        console.log("Error", err)
        res.status(status.INTERNAL_SERVER_ERROR).send("Failed to get Interview", err)
    }
})

const updateUser = catchAsync(async(req, res) => {
    try {
        
        const user = await userService.updateUser(req.body.user)
        res.status(status.OK).json({ user });

    } catch (err) {
        console.log("Error", err)
        res.status(status.INTERNAL_SERVER_ERROR).send("Failed to update user", err)
    }
})

module.exports = { getUser, updateUser }