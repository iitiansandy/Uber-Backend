const authService = require('../services/auth-service');
const { StatusCodes } = require('http-status-codes');
const { SuccessResponse, ErrorResponse } = require('../utils/common');


const register = async (req, res) => {
    try {
        const { user, token } = await authService.register(req.body);

        SuccessResponse.data = { user, token };
        return res.status(StatusCodes.OK).send({SuccessResponse});
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode).send({ErrorResponse});
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.login({ email, password });
        SuccessResponse.data = { user, token };
        return res.status(StatusCodes.OK).send({SuccessResponse});

    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode).send({ErrorResponse});
    }
};


module.exports = {
    register,
    login
};