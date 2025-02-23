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
    await authService.changePassword(req.body._id);
    res.status(status.OK).send("Password changed");
})

module.exports = {
    register,
    login,
    changePassword,
}