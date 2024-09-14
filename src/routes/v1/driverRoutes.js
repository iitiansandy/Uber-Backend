const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../../middlewares/authMiddleware');

const { getDriverBookings, updateLocation } = require('../../controllers/driverController');

router.get('/bookings', authMiddleware, getDriverBookings);

router.post('/location', authMiddleware, updateLocation);

module.exports = router;