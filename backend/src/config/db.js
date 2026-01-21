import * as mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
    try {
    const conn = await mongoose.connect(ENV.MONGO_URL);
    console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
    }
    catch(e) {
        console.log("DB Error!",e);
        process.exit(1);
    }
}