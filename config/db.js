const { MongoClient, GridFSBucket } = require("mongodb");

let gfsBucket;

const connectDB = async () => {
    try {
        // Use Azure Cosmos DB connection string
        const cosmosConnectionString = process.env.AZURE_COSMOS_CONNECTIONSTRING || process.env.MONGO_URI;

        // Connect to Cosmos DB using MongoClient
        const client = new MongoClient(cosmosConnectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await client.connect();

        console.log("Cosmos DB connection successful");

        // Access the database and initialize GridFSBucket
        const dbName = process.env.AZURE_COSMOS_DB_NAME || "tiptop";
        const db = client.db(dbName); // Use database name from environment variables or default

        gfsBucket = new GridFSBucket(db, { bucketName: "audio" });
        console.log("gfsBucket initialized successfully");

    } catch (err) {
        console.error("Error connecting to Cosmos DB:", err.message);
        process.exit(1);
    }
};

// Getter function to access gfsBucket
const getGfsBucket = () => {
    if (!gfsBucket) {
        throw new Error("gfsBucket is not initialized. Ensure connectDB() is called first.");
    }
    return gfsBucket;
};

module.exports = { connectDB, getGfsBucket };
