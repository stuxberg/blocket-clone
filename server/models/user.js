import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://images.blocketcdn.se/dynamic/220x220c/profile_placeholders/default",
    },
    location: {
      city: {
        type: String,
      },
      postalCode: {
        type: String,
      },
    },

    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
