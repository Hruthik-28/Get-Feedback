import mongoose, { Mongoose } from "mongoose";

type ConnecttionObject = {
    isConnected?: number;
};

const connection: ConnecttionObject = {};

export default async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("DB already connection");
        return;
    }

    try {
        const url = `${process.env.MONGODB_URI}/${process.env.COLLECTION_NAME}`;
        const db = await mongoose.connect(url || "");
        
        connection.isConnected = db.connections[0].readyState;
        console.log("Database Connected Successfuly!!!");
    } catch (error) {
        console.log("Database Connection Failed", error);
        process.exit(1);
    }
}
