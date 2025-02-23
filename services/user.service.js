const { status } = require('http-status');
const { User } = require('../models');
const mongoose = require('mongoose')
const ApiError = require('../utils/ApiError');


const createUser = async (userBody) => {
    const { firstName, lastName, email, password, phone, companyName, companyPosition } = userBody;

    if (await User.isEmailTaken(userBody.email)) {
        throw new ApiError(status.BAD_REQUEST, 'Email already taken');
      }
    const user = new User({ firstName, lastName, email, password, phone, companyName, companyPosition });
    return user.save();
}

const getUserById = async (userBody) => {
    const { userID } = userBody;

    const user = User.findOne({ _id: new mongoose.Types.ObjectId(userID) })
    return user;
}

const updateUser = async (userBody) => {
    const { _id, firstName, lastName, email, phone, companyName, companyPosition } = userBody;

    try {
        const filter = { _id: _id };
        const update = { firstName, lastName, email, phone, companyName, companyPosition };

        const result = await User.findByIdAndUpdate(filter, update, { new: true });
        if (result) {
            return result;
          } else {
            throw new ApiError(status.BAD_REQUEST, 'No item found with the given ID.');
          }
    } catch(error) {
        console.error("Error:", error);
        throw new ApiError(status.BAD_REQUEST, "Error updating user.");
    }
}

module.exports = {
    createUser,
    getUserById,
    updateUser
}