import express from "express";

import {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  getUserByID,
  updatedUserById,
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminCheckMiddleware from "../middlewares/adminCheckMiddleware.js";

const router = express.Router();

router.route("/").get(authMiddleware, adminCheckMiddleware, getAllUsers);
router.post("/login", authUser);
router.post("/register", registerUser);
router
  .route("/profile")
  .get(authMiddleware, getUserProfile)
  .put(authMiddleware, updateUserProfile);
router
  .route("/:id")
  .delete(authMiddleware, adminCheckMiddleware, deleteUser)
  .get(authMiddleware, adminCheckMiddleware, getUserByID)
  .put(authMiddleware, adminCheckMiddleware, updatedUserById);

export default router;
