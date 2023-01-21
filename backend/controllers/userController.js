import asyncHandler from "express-async-handler";

import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  if (!users) {
    res.status(404);
    throw new Error("No user found!");
  }
  res.json(users);
});

export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid authentication credentials!");
  }
});

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists.");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user._id),
  });
});

export const getUserProfile = asyncHandler((req, res) => {
  const { user } = req;

  if (!user) {
    res.status(404);
    throw new Error("User not found!");
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const { user } = req.body;

  const { name, email, password } = user;

  const updatingUser = await User.findById(user._id);

  if (!updatingUser) {
    res.status(404);
    throw new Error("User not found!");
  }

  const userWithEmail = await User.findOne({ email: email });

  updatingUser.name = name || updatingUser.name;

  if (!userWithEmail) {
    updatingUser.email = email || updatingUser.email;
  }

  if (password) {
    updatingUser.password = password;
  }

  const updatedUser = await updatingUser.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
    token: generateToken(updatedUser._id),
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletingUser = await User.findById(id);

  if (!deletingUser) {
    res.status(404);
    throw new Error("User not found!");
  } else {
    await deletingUser.remove();
    res.json({ message: "User Successfully Deleted!" });
  }
});

export const getUserByID = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found!");
  } else {
    res.json(user);
  }
});

export const updatedUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, isAdmin } = req.body;
  const existedUser = await User.findById(id);
  if (!existedUser) {
    res.status(404);
    throw new Error("User not found!");
  } else {
    existedUser.name = name || existedUser.name;
    existedUser.email = email || existedUser.email;
    existedUser.isAdmin = isAdmin ?? existedUser.isAdmin;

    const updatedUser = await existedUser.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  }
});
