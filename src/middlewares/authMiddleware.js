const User = require('../models/user-model');
const jwt = require('jsonwebtoken');

const { StatusCodes } = require('http-status-codes');
const AppError = require("../utils/errors/app-error");

const { tokenSecretKey } = require('../config/server-config');

const { SuccessResponse, ErrorResponse } = require('../utils/common');

// AUTH MIDDLEWARE
const authMiddleware = async (req, res, next) => {
    try {
        console.log("hi")
        const token = req.headers["authorization"].split(" ")[1]; //req.header('Authorization')?.replaceOne('Bearer', '');
        if (!token) {
            throw new AppError('Access denied', StatusCodes.FORBIDDEN);
        };

        console.log("token:", token);
        const verifiedUser = jwt.verify(token, tokenSecretKey);
        req.user = await User.findById(verifiedUser.id);

        next();
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ErrorResponse});
    }
};


module.exports = {
    authMiddleware,
};