require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const interviewRoutes = require('./routes/candidate')

const app = express();
const PORT = process.env.PORT || 5000;

// Define allowed origins (e.g., http://localhost:3000 for React frontend)
const allowedOrigins = ['http://localhost:3000', 'https://tiptop-front.vercel.app', 'http://localhost:5000'];

// CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow cookies or authorization headers
    optionsSuccessStatus: 204, // For legacy browsers
};

// Use CORS middleware
app.use(cors(corsOptions));

// Connect to DB
connectDB();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/candidate', interviewRoutes);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
