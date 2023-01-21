import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ id, quantity }) => {
    const response = await axios.get(`/api/products/${id}`);
    const resultingData = { ...response.data, qty: quantity };
    return resultingData;
  }
);

const initialState = {
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    clearCart: (state, action) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.fulfilled, (state, action) => {
        const { _id } = action.payload;
        const existedItem = state.cartItems.find((item) => item._id === _id);

        if (existedItem) {
          state.cartItems = state.cartItems.map((item) =>
            item._id === existedItem._id ? action.payload : item
          );
        } else {
          state.cartItems.push(action.payload);
        }

        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

const { reducer, actions } = cartSlice;

export const { removeFromCart, clearCart } = actions;

export default reducer;
