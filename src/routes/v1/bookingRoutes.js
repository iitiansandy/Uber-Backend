const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../middlewares/authMiddleware');

const { createBooking, confirmBooking } = require('../../controllers/bookingController');

module.exports = (io) => {
    router.post('/', authMiddleware, createBooking(io));
    router.post('/confirm', authMiddleware, confirmBooking(io));
    
    return router;
};