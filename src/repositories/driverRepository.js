const User = require('../models/user-model');

const updateDriverLocation = async (driverId, location) => {
    return User.findByIdAndUpdate(driverId, {location}, { new: true });
};


module.exports = {
    updateDriverLocation
}