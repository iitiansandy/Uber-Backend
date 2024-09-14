const driverService = require('../services/bookingService');
const { io } = require('../index');
const locationService = require('../services/locationService');
const { StatusCodes } = require('http-status-codes');
const { SuccessResponse, ErrorResponse } = require('../utils/common');


const updateLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;

        await driverService.updateLocation(req.user._id, {latitude, longitude});
        return res.status(StatusCodes.OK).send({SuccessResponse});
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode).send({ErrorResponse});
    }
};


const getDriverBookings = async (req, res) => {
    try {
        
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode).send({ErrorResponse});
    }
};


module.exports = {
    updateLocation,
    getDriverBookings
}