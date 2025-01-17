const mongoose = require("mongoose");
const { MongoClient, GridFSBucket } = require("mongodb");
const { GridFsStorage } = require('multer-gridfs-storage');
const path = require('path');
const crypto = require('crypto');

let gfsBucket;

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.AZURE_COSMOS_CONNECTIONSTRING || process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Mongoose connection successful");

        const db = connection.connection.db; // Access db directly
        gfsBucket = new GridFSBucket(db, { bucketName: "audio" });

        console.log("gfsBucket initialized successfully");

    } catch (err) {
        console.error("Error connecting to MongoDB:", err.message);
        process.exit(1);
    }
};


// Getter function to access gfsBucket
const getGfsBucket = () => {
    return gfsBucket;
};

module.exports = { connectDB, getGfsBucket };
