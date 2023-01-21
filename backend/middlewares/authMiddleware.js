import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

import User from "../models/user.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(401);
    throw new Error("Authorization failed! Token not found!");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401);
    throw new Error("Authorization failed! Token not found!");
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedData.id).select("-password");
  next();
});

export default authMiddleware;
