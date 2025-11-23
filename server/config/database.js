import mongoose from "mongoose";
const URI = process.env.URI;

export const connectDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};
