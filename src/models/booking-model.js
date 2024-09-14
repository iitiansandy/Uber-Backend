const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const bookingSchema = new mongoose.Schema({
    passengerId: {
        type: ObjectId,
        ref: "User"
    },

    driverId: {
        type: ObjectId,
        ref: "User",
        default: null
    },

    source: {
       latitude: { type: Number },
       longitude: { type: Number },
    },

    destination: {
        latitude: { type: Number },
        longitude: { type: Number },
     },

    fare: {
        type: Number
    },

    status: {
        type: String,
        enum: ["PENDING", "CONFIRMED", "CALCELLED", "COMPLETED"],
        default: "PENDING"
    },

    fare: {
        type: Number
    },

    feedback: {
        type: String
    },

}, {timestamps: true});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;