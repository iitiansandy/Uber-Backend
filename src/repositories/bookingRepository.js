const Booking = require('../models/booking-model');

const findBooking = async (query) => {
    return await Booking.findOne(query);
};

const createBooking = async (bookingData) => {
    const booking = new Booking(bookingData);
    await booking.save();
    return booking;
};

const updateBookingStatus = async (bookingId, driverId, status) => {
    return Booking.findByIdAndUpdate(
        {_id: bookingId, status: 'PENDING'},
        {driver: driverId, status},
        {new: true}
    );
};


module.exports = {
    findBooking,
    createBooking,
    updateBookingStatus
}