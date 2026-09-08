import mongoose from "mongoose";
import "dotenv/config";

export const connectDB = async () => {
  try {
    const myconnection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDb connected:${myconnection.connection.host}`);
  } catch (error) {
    console.log("error occured while connecting to db", error.message);
    process.exit(1);
  }
};