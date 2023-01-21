import asyncHandler from "express-async-handler";

import Order from "../models/order.js";

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "email name");

  res.json(orders);
});

export const addOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length <= 0) {
    res.status(400);
    throw new Error("Could not find ordered items!");
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

export const getUserOrders = asyncHandler(async (req, res) => {
  const orderList = await Order.find({ user: req.user._id });

  if (!orderList) {
    res.status(404);
    throw new Error("Orders not found!");
  }
  res.json(orderList);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id).populate("user", "email name");

  if (!order) {
    res.status(404);
    throw new Error("Order not found!");
  }

  if (req.user.isAdmin || req.user._id.equals(order.user._id)) {
    res.json(order);
  } else {
    res.status(401);
    throw new Error("Not authorized for this request!");
  }
});

export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  const { paymentResult } = req.body;

  if (!order) {
    res.status(404);
    throw new Error("Order not found!");
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: paymentResult.id,
    status: paymentResult.status,
    update_time: paymentResult.update_time,
    email_address: paymentResult.payer.email_address,
  };

  const updatedOrder = await order.save();

  res.json(updatedOrder);
});

export const updateOrderToDeliver = asyncHandler(async (req, res) => {
  const updatingOrder = await Order.findById(req.params.id);

  if (!updatingOrder) {
    res.status(404);
    throw new Error("Order not found!");
  } else {
    updatingOrder.isDelivered = true;
    updatingOrder.deliveredAt = Date.now();

    const updatedOrder = await updatingOrder.save();

    res.json({ message: "Successfully Delivered!" });
  }
});
