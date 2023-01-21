import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shippingAddress: {
    address: "",
    city: "",
    postalCode: "",
    country: "",
  },
  paymentMethod: "",
};

const checkOutSlice = createSlice({
  name: "shipping",
  initialState: initialState,
  reducers: {
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("shippingAddress", JSON.stringify(action.payload));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("paymentMethod", action.payload);
    }
  },
});

const { reducer, actions } = checkOutSlice;

export const { saveShippingAddress, savePaymentMethod } = actions;

export default reducer;
