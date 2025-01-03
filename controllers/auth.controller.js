const { status } = require('http-status');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const { userService, authService, uploadService } = require('../services')

const register = catchAsync(async(req, res) => {

    const user = await userService.createUser(req.body)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(status.CREATED).send({ token, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email } });
    
})

const login = catchAsync(async(req, res) => {

    const user = await authService.loginUsingCredentials(req.body);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(status.CREATED).send({ token, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email } });

})

const changePassword = catchAsync(async(req, res) => {
    console.log(req.body)
    await authService.changePassword(req.body._id);
    res.status(status.OK).send("Password changed");
})

const uploadAvatar = catchAsync(async(req, res) => {
    try {
        const avatar = await uploadService.uploadAvatar(req.file)
        res.status(status.CREATED).json({ avatar })
    } catch(err) {
        console.log("Error", err)
        res.status(status.INTERNAL_SERVER_ERROR).send("Failed to upload avatar", err)
    }
})

module.exports = {
    register,
    login,
    changePassword,
    uploadAvatar
}