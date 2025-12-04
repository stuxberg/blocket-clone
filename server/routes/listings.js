import express from "express";
import { authenticateJWT } from "../middleware/auth.js";
import { matchedData, checkSchema, param } from "express-validator";
import { createListingValidationSchema } from "../schemas/validationSchemas.js";
import { handleValidationErrors } from "../middleware/handleValidationErrors.js";
import { Category } from "../models/category.js";
import { Product } from "../models/product.js";

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

router.get("/", async (req, res, next) => {
  try {
    const listings = await Product.find();
    res.status(200).json(listings);
  } catch (error) {
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
export default router;
