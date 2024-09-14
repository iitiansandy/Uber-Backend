const User = require('../models/user-model');
const jwt = require('jsonwebtoken');

const { StatusCodes } = require('http-status-codes');
const AppError = require("../utils/errors/app-error");

const { tokenSecretKey } = require('../config/server-config');

const { SuccessResponse, ErrorResponse } = require('../utils/common');

// AUTH MIDDLEWARE
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replaceOne('Bearer', '');
        if (!token) {
            throw new AppError('Access denied', StatusCodes.FORBIDDEN);
        };

        const verifiedUser = jwt.verify(token, tokenSecretKey);
        req.user = await User.findById(verifiedUser.id);

        next();
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode).send({ErrorResponse});
    }
};


module.exports = {
    authMiddleware,
};