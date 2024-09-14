const jwt = require('jsonwebtoken');
const User = require('../models/user-model');
const { StatusCodes } = require('http-status-codes');
const AppError = require("../utils/errors/app-error");

const { tokenSecretKey } = require('../config/server-config');


const register = async (userData) => {
    const user = new User(userData);
    await user.save();

    const token = jwt.sign({id: user._id}, tokenSecretKey, {expiresIn: '1h'});
    return { user, token };
};


const login = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        throw new AppError('Invalid email or password', StatusCodes.BAD_REQUEST);
    };

    const token = jwt.sign({id: user._id}, tokenSecretKey, {expiresIn: '1h'});
    return { user, token };
};


module.exports = {
    register,
    login
};