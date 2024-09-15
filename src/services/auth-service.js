const jwt = require('jsonwebtoken');
const User = require('../models/user-model');
const { StatusCodes } = require('http-status-codes');
const AppError = require("../utils/errors/app-error");

const secretsManagerService = require('./secretManagerService');

// const { tokenSecretKey } = require('../config/server-config');


const register = async (userData) => {
    const user = new User(userData);
    await user.save();
    const secrets = await secretsManagerService.getSecret('my-uber-app-secrets');
    const token = jwt.sign({id: user._id}, secrets.JWT_SECRET, {expiresIn: '1h'}); // secrets.JWT_SECRET is comming from AWS key vault, we can also use here process.env.secrets.JWT_SECRET;
    return { user, token };
};


const login = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        throw new AppError('Invalid email or password', StatusCodes.BAD_REQUEST);
    };
    const secrets = await secretsManagerService.getSecret('my-uber-app-secrets');

    const token = jwt.sign({id: user._id}, secrets.JWT_SECRET, {expiresIn: '1h'});
    return { user, token };
};


module.exports = {
    register,
    login
};