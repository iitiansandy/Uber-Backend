const driverRepository = require('../repositories/driverRepository');
const locationService = require('./locationService');

const updateLocation = async (driverId, {latitude, longitude}) => {
    const longitude = parseFloat(location.latitude);
    const latitude = parseFloat(location.longitude);

    if (isNaN(latitude) || isNaN(longitude)) {
        throw new Error("Invalid coordinates");
    };

    await locationService.addDriverLocation(driverId, latitude, longitude);
    await driverRepository.updateDriverLocation(driverId, {
        type: "Point",
        coordinates: [latitude, longitude]  
    })
};

const getDriverBookings = async (driverId, {latitude, longitude}) => {

};


module.exports = {
    updateLocation,
    getDriverBookings
};


