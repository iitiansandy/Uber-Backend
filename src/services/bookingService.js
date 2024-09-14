const bookingRepository = require('../repositories/bookingRepository');
const { calculateDistance } = require('../utils/helpers/distanceCalculator');
const locationService = require('./locationService');

const basic_fare = 50;
const fare_per_km = 20;

const createBooking = async ({ passengerId, source, destination}) => {
    const distance = calculateDistance(source.latitude, source.longitude, destination.latitude, destination.longitude);
    const totalFare = basic_fare + (distance * fare_per_km);
    const bookingData = {
        passenger: passengerId,
        source,
        destination,
        status: 'PENDING',
        fare: totalFare
    };
    const booking = await bookingRepository.createBooking(bookingData);
    return booking;
};


const findNearbyDrivers = async (location, radius = 5) => {
    const longitude = parseFloat(location.latitude);
    const latitude = parseFloat(location.longitude);
    const radiusKm = parseFloat(radius);

    if (isNaN(latitude) || isNaN(longitude) || isNaN(radiusKm)) {
        throw new Error("Invalid coordinates or radius");
    };

    const nearbyDrivers = await locationService.findNearbyDrivers(latitude, longitude, radiusKm);
    return nearbyDrivers;
};


const assignDriver = async (bookingId, driverId) => {
    const booking = await bookingRepository.updateBookingStatus(bookingId, driverId, "CONFIRMED");
    if (!booking) {
        throw new Error("Booking already confirmed or does not exists");
    };
    return booking;
}


module.exports = {
    createBooking,
    findNearbyDrivers,
    assignDriver
}

