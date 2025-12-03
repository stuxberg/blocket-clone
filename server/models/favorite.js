import mongoose from "mongoose";
import { Product } from "./product.js";

const favoriteSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

// Unique compound index - user can only favorite a product once
favoriteSchema.index({ user: 1, product: 1 }, { unique: true });

// Indexes for queries
favoriteSchema.index({ user: 1 });
favoriteSchema.index({ product: 1 });

// Hook: Increment product favoritesCount when favorite is created
favoriteSchema.post("save", async function () {
  try {
    await Product.findByIdAndUpdate(this.product, {
      $inc: { favoritesCount: 1 },
    });
  } catch (error) {
    console.error("Error updating favoritesCount:", error);
  }
});

// Hook: Decrement product favoritesCount when favorite is deleted
favoriteSchema.post("deleteOne", { document: true }, async function () {
  try {
    await Product.findByIdAndUpdate(this.product, {
      $inc: { favoritesCount: -1 },
    });
  } catch (error) {
    console.error("Error updating favoritesCount:", error);
  }
});

export const Favorite = mongoose.model("Favorite", favoriteSchema);
