const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require("cors");
const helmet = require('helmet');
const dotenv = require('dotenv');
// const rateLimit = require('express-rate-limit');
const compression = require('compression');
// const xss = require('xss');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

const socketIO = require('socket.io');
const locationService = require('./services/locationService');
// const driverService = require('./services/')

dotenv.config();



const { ServerConfig, ConnectToDB } = require('./config');
// const apiRoutes = require('./routes');

const { redisClient } = require('./config/redis-config');

const app = express();
const server = http.createServer(app);

const io = socketIO(server, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"]
    }
});
// const { port } = require('./src/config/config');
// const { connectToDatabase } = require('./src/config/db.config');
const { errorHandler } = require('./utils/common/errorHandler');

app.use(helmet());
app.use(cors());
app.use(compression());
// app.use(xss());
app.use(mongoSanitize());
app.use(hpp()); // HTTP Parameter Pollution prevention
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.text());
app.use(fileUpload());
app.use(cors());
app.use(express.static('public'));

const authRoutes = require('./routes/v1/authRoutes');
const bookingRoutes = require('./routes/v1/bookingRoutes');
const driverRoutes = require('./routes/v1/driverRoutes');
const passengerRoutes = require('./routes/v1/passengerRoutes');

// Content Security Policy
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    })
);

// HTTP Strict Transport Security (HSTS)
app.use(
    helmet.hsts({
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
    })
);

app.use("/uploads", express.static(__dirname + "/uploads"));

// app.use('/api', apiRoutes);
app.use("/", authRoutes);
app.use("/", bookingRoutes(io));
app.use("/", driverRoutes);
app.use("/", passengerRoutes);


app.get("/", (req, res) => {
    res.send("<h1>Uber Backend is Up and Running</h1>");
});

// Last middleware if any error comes
app.use(errorHandler);

server.listen(ServerConfig.port, async () => {
    console.log(`App is running on port ${ServerConfig.port}`);
    await ConnectToDB;
    await redisClient;
});

io.on("connection", (socket) => {
    socket.on('registerDriver', async (driverId) => {
        await locationService.setDeiverSocket(driverId, socket.id);
    });

    socket.on('disconnect', async () => {
        const driverId = await locationService.getDeiverSocket(`driver:${socket.id}`);
        if (driverId) {
            await locationService.deleteDeiverSocket(`driver:${driverId}`);
        }
    })
})


// // Handling unhandled promise rejections
// process.on('unhandledRejection', (reason, promise) => {
//     console.error('Unhandled Rejection at:', promise, 'reason:', reason);
//     // Close the server and exit the process
//     server.close(() => {
//         process.exit(1);
//     });
// });

// // Handling uncaught exceptions
// process.on('uncaughtException', (err) => {
//     console.error('Uncaught Exception thrown:', err);
//     // Close the server and exit the process
//     server.close(() => {
//         process.exit(1);
//     });
// });

// // Handling process termination signals for graceful shutdown
// process.on('SIGTERM', () => {
//     console.log('SIGTERM signal received: closing HTTP server');
//     server.close(() => {
//         console.log('HTTP server closed');
//         process.exit(0);
//     });
// });

// process.on('SIGINT', () => {
//     console.log('SIGINT signal received: closing HTTP server');
//     server.close(() => {
//         console.log('HTTP server closed');
//         process.exit(0);
//     });
// });
