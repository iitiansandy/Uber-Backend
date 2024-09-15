const bookingService = require('../services/bookingService');
const { io } = require('../index');
const locationService = require('../services/locationService');
const { StatusCodes } = require('http-status-codes');
const { SuccessResponse, ErrorResponse } = require('../utils/common');

const createBooking = (io) => async (req, res) => {
    try {
        const { source, destination } = req.body;

        const booking = await bookingService.createBooking({
            passengerId: req.user._id,
            source,
            destination
        });

        const nearbyDrivers = await bookingService.findNearbyDrivers(source);
        const driverIds = [];
        for (let driver of nearbyDrivers) {
            const driverSocketId = await locationService.getDeiverSocket(driver[0]);
            if (driverSocketId) {
                driverIds.push(driver[0]);
                io.to(driverSocketId).emit('newBooking', { bookingId: booking._id, source, destination, fare: booking.fare });
            }
        };

        await locationService.storeNotifiedDrivers(booking._id, driverIds);

        SuccessResponse.data = booking;
        return res.status(StatusCodes.OK).send({SuccessResponse});

    } catch (error) {
        console.log("error: ", error);
        ErrorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ErrorResponse});
    }
};


const confirmBooking = (io) => async (req, res) => {
    try {
        const { bookingId } = req.body;

        const booking = await bookingService.assignDriver(bookingId, req.user._id);
        const notifiedDriverIds = await locationService.getNotifiedDrivers(bookingId);

        for (const driverId of notifiedDriverIds) {
            const driverSocketId = await locationService.getDeiverSocket(driverId);

            if (driverSocketId) {
                if (driverId === req.user._id) {
                    io.to(driverSocketId).emit('rideConfirmed', { bookingId, driverId: req.user._id});
                } else {
                    io.to(driverSocketId).emit('removeBooking', { bookingId });
                }
            };
        };

        SuccessResponse.data = booking;
        return res.status(StatusCodes.OK).send({SuccessResponse});
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode).send({ErrorResponse});
    }
}



module.exports = {
    createBooking,
    confirmBooking
}