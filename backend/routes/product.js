import express from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
  createReview,
  getTopRatedProducts,
} from "../controllers/productController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminCheckMiddleware from "../middlewares/adminCheckMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(authMiddleware, adminCheckMiddleware, createProduct);
router.route("/top/:limit").get(getTopRatedProducts);
router
  .route("/:id")
  .get(getProductById)
  .put(authMiddleware, adminCheckMiddleware, updateProductById)
  .delete(authMiddleware, adminCheckMiddleware, deleteProductById);
router.route("/:id/reviews").post(authMiddleware, createReview);

export default router;
