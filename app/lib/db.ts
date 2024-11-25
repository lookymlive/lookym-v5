import mongoose from "mongoose";

let isConnected = false;

const startDb = async () => {
  try {
    if (isConnected) {
      console.log("Using existing database connection");
      return;
    }

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

export default startDb;
