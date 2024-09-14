const redisClient = require('../config/redis-config');

class locationService {
    async setDeiverSocket(driverId, socketId) {
        await redisClient.set(`driver: ${driverId}`, socketId);
    };

    async getDeiverSocket(driverId) {
        return await redisClient.get(`driver: ${driverId}`);
    };

    async deleteDeiverSocket(driverId) {
        return await redisClient.del(`driver:${driverId}`);
    };

    async addDriverLocation(driverId, latitude, longitude) {
        try {
            await redisClient.sendCommand([
                'GEOADD',
                'drivers',
                latitude.toString(),
                longitude.toString(),
                driverId.toString()            ])
        } catch (error) {
            throw error;
        }
    };

    async findNearbyDrivers(latitude, longitude, radiusKm) {
        const nearbyDrivers = await redisClient.sendCommand([
            'GEORADIUS',
            'drivers',
            latitude.toString(),
            longitude.toString(),
            radiusKm.toString(),
            'km',
            'WITHCOORD'
        ]);
        return nearbyDrivers;
    };

    async storeNotifiedDrivers(bookingId, driverIds) {
        for (const id of driverIds) {
            await redisClient.sAdd(`notifiedDrivers: ${bookingId}`, id);
        }
    };

    async getNotifiedDrivers(bookingId) {
        return await redisClient.sMembers(`notifiedDrivers: ${bookingId}`);
    };
};

module.exports = new locationService();