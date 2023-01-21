import express from "express";
import dotenv from "dotenv";
import path from "path";

import connectDB from "./config/db.js";
import productRoutes from "./routes/product.js";
import userRoutes from "./routes/user.js";
import orderRoutes from "./routes/order.js";
import uploadRoutes from "./routes/upload.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";

dotenv.config();
connectDB();
const app = express();

app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);
app.use(
  "/api/upload",
  (req, res, next) => {
    console.log("Inside upload");
    next();
  },
  uploadRoutes
);

app.get("/api/config/clientID", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

const __dirname = path.resolve();
console.log("Main Dirname: ", __dirname);
app.use("/uploads", express.static(path.join(__dirname, "backend", "uploads")));
app.use(
  "/products/uploads",
  express.static(path.join(__dirname, "backend", "uploads"))
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("App is running.");
  });
}

// error handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`App running in ${process.env.NODE_ENV} at port ${PORT}`)
);
