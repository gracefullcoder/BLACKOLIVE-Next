import mongoose from "mongoose"

interface Connection {
    isConnected?: number
}

const connection: Connection = {};

const connectToDatabase = async () => {
    if (connection.isConnected) {
        console.log("Already Connected To Database");
        return;
    }
    const MongoUri = process.env.MONGO_URI_PROD || "";

    if (!MongoUri) console.log("Please enter database url");

    const db = await mongoose.connect(MongoUri)

    connection.isConnected = db.connections[0].readyState

    console.log("Connected to database Successfully!")
    return;
}

export default connectToDatabase;