import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "./slices/cartSlice";
import productReducer from "./slices/productSlice";
import authReducer from "./slices/authSlice";
import checkOutReducer from "./slices/checkOutSlice";
import orderReducer from "./slices/orderSlice";
import adminReducer from "./slices/adminSlice";

const storedCartItems = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const storedUserInfo = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const storedShippingAddress = localStorage.getItem("shippingAddress")
  ? JSON.parse(localStorage.getItem("shippingAddress"))
  : {};

const storedPaymentMethod = localStorage.getItem("paymentMethod");

const initialState = {
  cart: {
    cartItems: storedCartItems,
  },
  auth: {
    userInfo: storedUserInfo,
  },
  checkOut: {
    shippingAddress: storedShippingAddress,
    paymentMethod: storedPaymentMethod,
  },
};

const store = configureStore({
  preloadedState: initialState,
  reducer: {
    product: productReducer,
    cart: cartReducer,
    auth: authReducer,
    checkOut: checkOutReducer,
    order: orderReducer,
    admin: adminReducer,
  },
});

export default store;
