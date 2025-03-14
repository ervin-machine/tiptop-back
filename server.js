require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require("http");
const { connectDB } = require('./config/db');
const routes = require('./routes');
require('./services/transcriptionQueue');
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const { REDIS_HOST, REDIS_PORT, REDIS_ACCESS, REDIS_URL } = require("./config/dotenv");
// Allowed CORS origins
const allowedOrigins = [
    'http://localhost:3000', 
    'https://tiptop-front.vercel.app', 
    "https://tiptop-front-dnde0pfl6-ervin-hodzics-projects.vercel.app", 
    "https://tiptop-front-f57vabm2w-ervin-hodzics-projects.vercel.app"
];

// CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
    changeOrigin: true,
    onProxyRes: function (proxyRes, req, res) {
       proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
};

const startServer = async () => {
    app.use(cors(corsOptions));
    app.use(bodyParser.json());
    
    // Connect to DB
    await connectDB();
    console.log("MongoDB connected. Starting server...");
    // Routes
    app.use('', routes);

    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startServer();
