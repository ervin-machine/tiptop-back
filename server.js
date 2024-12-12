require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { connectDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const candidateRoutes = require('./routes/candidate')
const interviewRoutes = require('./routes/interview')

const app = express();
const PORT = process.env.PORT || 5000;

// Define allowed origins (e.g., http://localhost:3000 for React frontend)
const allowedOrigins = ['http://localhost:3000', 'https://tiptop-front.vercel.app', "https://tiptop-front-dnde0pfl6-ervin-hodzics-projects.vercel.app/login"];

// CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    target: 'http://localhost:5000/', //original url
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow cookies or authorization headers
    optionsSuccessStatus: 204, // For legacy browsers
    changeOrigin: true, 
    //secure: false,
    onProxyRes: function (proxyRes, req, res) {
       proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
};

const startServer = async () => {
    // Use CORS middleware
    app.use(cors(corsOptions));

    // Connect to DB
    await connectDB();
    console.log("MongoDB connected. Starting server...");
    // Middleware
    app.use(bodyParser.json());

// Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/candidate', candidateRoutes);
    app.use('/api/interview', interviewRoutes);

    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}


startServer();