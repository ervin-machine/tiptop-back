const mongoose = require("mongoose");
const { MongoClient, GridFSBucket } = require("mongodb");
const { GridFsStorage } = require('multer-gridfs-storage');
const path = require('path');
const crypto = require('crypto');

let gfsBucket;
let gfsBucketAvatar;
let gfsStorageAvatar;

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.AZURE_COSMOS_CONNECTIONSTRING || process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Mongoose connection successful");

        const db = connection.connection.db; // Access db directly
        gfsBucket = new GridFSBucket(db, { bucketName: "audio" });

        gfsBucketAvatar = new GridFSBucket(db, { bucketName: "avatar" });

        gfsStorageAvatar = new GridFsStorage({
            url: process.env.AZURE_COSMOS_CONNECTIONSTRING || process.env.MONGO_URI,
            file: (req, file) => {
                return new Promise((resolve, reject) => {
                    crypto.randomBytes(16, (err, buf) => {
                        if (err) {
                            return reject(err);
                        }
                        const filename = buf.toString('hex') + path.extname(file.originalname);
                        const fileInfo = {
                            filename: filename,
                            bucketName: 'avatar' // Should match the collection name
                        };
                        resolve(fileInfo);
                    });
                });
            }
        });

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

const getGfsBucketAvatar = () => {
    return gfsBucketAvatar;
};

const getGfsStorateAvatar = () => {
    return gfsStorageAvatar
}

module.exports = { connectDB, getGfsBucket, getGfsBucketAvatar, getGfsStorateAvatar };
