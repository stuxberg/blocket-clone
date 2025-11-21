import mongoose from "mongoose";
const URI = process.env.URI;

export const connectDB = async () => {
  try {
    await mongoose.connect(URI);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};
