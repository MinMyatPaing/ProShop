import asyncHandler from "express-async-handler";

import Product from "../models/product.js";

// @desc Fetch all products
// @route Get /api/products
// @access Public
export const getProducts = asyncHandler(async (req, res, next) => {
  const itemsPerPage = 5;
  const page = req.query.page ? Number(req.query.page) : 1;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const totalProducts = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(itemsPerPage)
    .skip(itemsPerPage * (page - 1));

  res.json({
    products: products,
    page: page,
    pages: Math.ceil(totalProducts / itemsPerPage),
  });
});

export const getTopRatedProducts = asyncHandler(async (req, res) => {
  const limit = req.params.limit ? req.params.limit : null;
  const products = await Product.find({}).sort({ rating: -1 }).limit(limit);

  res.json(products);
});

// @desc Fetch single products
// @route Get /api/products/:id
// @access Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found!");
  }
});

export const createProduct = asyncHandler(async (req, res) => {
  const { name, price, category, description, brand, image } = req.body;
  const createdProduct = await Product.create({
    user: req.user._id,
    name: name,
    price: price,
    category: category,
    description: description,
    brand: brand,
    image: image,
  });

  res.status(201).json(createdProduct);
});

export const updateProductById = asyncHandler(async (req, res) => {
  const { name, price, category, description, brand, image } = req.body;
  const updatingProduct = await Product.findById(req.params.id);

  if (updatingProduct) {
    updatingProduct.name = name || updatingProduct.name;
    updatingProduct.price = price ?? updatingProduct.price;
    updatingProduct.category = category || updatingProduct.category;
    updatingProduct.description = description || updatingProduct.description;
    updatingProduct.brand = brand || updatingProduct.brand;
    updatingProduct.image = image || updatingProduct.image;

    const updatedProduct = await updatingProduct.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found!");
  }
});

export const deleteProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: "Product removed successfully!" });
  } else {
    res.status(404);
    throw new Error("Product not found!");
  }
});

export const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const existingReview = product.reviews.find((review) => {
      return review.user.toString() === req.user._id.toString();
    });

    if (existingReview) {
      res.status(400);
      throw new Error("Review Already Exists!");
    } else {
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment: comment,
        user: req.user._id,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, review) => review.rating + acc, 0) /
        product.reviews.length;
      await product.save();
      res.status(201).json({ message: "Review created successfully!" });
    }
  } else {
    res.status(404);
    throw new Error("Product not found!");
  }
});
