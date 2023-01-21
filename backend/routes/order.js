import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import adminCheckMiddleware from "../middlewares/adminCheckMiddleware.js";
import {
  addOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDeliver,
  getUserOrders,
  getOrders,
} from "../controllers/orderController.js";

const router = express.Router();

router
  .route("/")
  .post(authMiddleware, addOrder)
  .get(authMiddleware, adminCheckMiddleware, getOrders);
router.route("/user-orders").get(authMiddleware, getUserOrders);
router.route("/:id").get(authMiddleware, getOrderById);
router.route("/:id/pay").put(authMiddleware, updateOrderToPaid);
router
  .route("/:id/deliver")
  .put((authMiddleware, adminCheckMiddleware, updateOrderToDeliver));

export default router;
