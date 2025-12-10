import express from "express";
import {
  authenticateJWT,
  optionalAuthenticateJWT,
} from "../middleware/auth.js";
import { matchedData, checkSchema, param } from "express-validator";
import { createListingValidationSchema } from "../schemas/validationSchemas.js";
import { handleValidationErrors } from "../middleware/handleValidationErrors.js";
import { Category } from "../models/category.js";
import { Product } from "../models/product.js";
import { Favorite } from "../models/favorite.js";

const router = express.Router();

router.post(
  "/create",
  authenticateJWT,
  checkSchema(createListingValidationSchema),
  handleValidationErrors,
  async (req, res, next) => {
    const data = matchedData(req);

    const category = await Category.findOne({ slug: data.category });

    const product = await Product.create({
      title: data.title,
      description: data.description,
      price: data.price,
      images: data.images || [],
      category: category._id,
      seller: req.user, // From JWT auth
      location: {
        postalCode: data.postalCode,
      },
    });

    res.status(201).json({ success: true, product });
  }
);

router.get("/", optionalAuthenticateJWT, async (req, res, next) => {
  console.log("🏠 HOME ROUTE - req.user:", req.user ? "present" : "null");
  try {
    const listings = await Product.find();
    if (req.user) {
      const userId = req.user._id;
      const userFavorites = await Favorite.find({ user: userId }).select(
        "product"
      );
      const favoritedProductIds = userFavorites.map((fav) =>
        fav.product.toString()
      );
      const listingsWithLikeStatus = listings.map((product) => {
        const productObj = product.toObject();
        productObj.isFavorited = favoritedProductIds.includes(
          product._id.toString()
        );
        return productObj;
      });

      return res.status(200).json(listingsWithLikeStatus);
    }

    const listingsWithFavorites = listings.map((product) => ({
      ...product.toObject(),
      isFavorited: false,
    }));

    res.status(200).json(listingsWithFavorites);
  } catch (error) {
    next(error);
  }
});

router.get("/my-listings", authenticateJWT, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const listings = await Product.find({ seller: userId })
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    const listingsWithFavorites = await Promise.all(
      listings.map(async (listing) => {
        const favoriteCount = await Favorite.countDocuments({
          product: listing._id,
        });
        return {
          ...listing.toObject(),
          favoriteCount,
          isFavorited: true,
        };
      })
    );

    res.status(200).json(listingsWithFavorites);
  } catch (error) {
    next(error);
  }
});

router.get("/favorites", authenticateJWT, async (req, res, next) => {
  console.log("⭐ FAVORITES ROUTE HANDLER REACHED! req.user:", req.user);
  try {
    const userId = req.user._id;
    console.log("⭐ Fetching favorites for userId:", userId);
    const favorites = await Favorite.find({ user: userId })
      .populate("product")
      .sort({ createdAt: -1 });

    console.log("⭐ Found favorites:", favorites.length);
    const products = favorites.map((fav) => ({
      ...fav.product.toObject(),
      isFavorited: true,
    }));
    res.status(200).json(products);
  } catch (error) {
    console.log("⭐ ERROR in favorites route:", error);
    next(error);
  }
});

router.get("/:id", param("id").isMongoId(), async (req, res, next) => {
  try {
    const data = matchedData(req);
    const id = data.id;
    const listing = await Product.findById(id)
      .populate("seller", "username email")
      .populate("category", "name slug");
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/:id/like",
  authenticateJWT,
  param("id").isMongoId(),
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { id } = matchedData(req);
      const userId = req.user._id; // Fixed: use _id instead of id
      const favorite = await Favorite.create({
        user: userId,
        product: id,
      });

      res.status(201).json({ success: true, favorite });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Already favorited",
        });
      }
      next(error);
    }
  }
);

router.delete(
  "/:id/like",
  authenticateJWT,
  param("id").isMongoId(),
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { id } = matchedData(req);
      const userId = req.user._id; // Fixed: use _id instead of id
      const favorite = await Favorite.findOne({
        user: userId,
        product: id,
      });

      if (!favorite) {
        return res.status(404).json({
          success: false,
          message: "Favorite not found",
        });
      }

      await favorite.deleteOne();
      res.status(200).json({
        success: true,
        message: "Removed from favorites",
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
