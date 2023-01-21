import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getUserOrders = createAsyncThunk(
  "order/getUserOrders",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.userInfo.token;
      const response = await axios.get("/api/orders/user-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addOrder = createAsyncThunk(
  "order/addOrder",
  async (order, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth.userInfo;
      const response = await axios.post("/api/orders", order, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getOrderById = createAsyncThunk(
  "order/getOrderById",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.userInfo.token;
      const response = await axios.get(`/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      console.log("Order Details Error: ", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const payOrder = createAsyncThunk(
  "order/payOrder",
  async ({ id, paymentResult }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.userInfo.token;
      const response = await axios.put(
        `/api/orders/${id}/pay`,
        { paymentResult },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  order: {},
  error: null,
  userOrders: [],
  userOrdersLoading: false,
  userOrdersError: null,
  orderDetails: {},
  orderDetailsLoading: false,
  orderDetailsError: null,
  donePayment: false,
  paymentLoading: false,
  paymentError: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState: initialState,
  reducers: {
    orderStateReset: (state, action) => {
      state = initialState;
    },
    paymentReset: (state, action) => {
      state.donePayment = false;
      state.paymentError = null;
      state.paymentLoading = false;
    },
    clearOrderDetails: (state, action) => {
      state.orderDetails = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserOrders.pending, (state, action) => {
        state.userOrdersLoading = true;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.userOrdersLoading = false;
        state.userOrdersError = null;
        state.userOrders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.userOrdersLoading = false;
        state.userOrdersError = action.payload.message;
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.order = action.payload;
        state.error = null;
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.order = null;
        state.error = action.payload.message;
      })
      .addCase(getOrderById.pending, (state, action) => {
        state.orderDetailsLoading = true;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.orderDetailsLoading = false;
        state.orderDetails = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.orderDetailsLoading = false;
        state.orderDetailsError = action.payload.message;
      })
      .addCase(payOrder.pending, (state, action) => {
        state.paymentLoading = true;
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.donePayment = true;
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.paymentLoading = false;
        state.donePayment = false;
        state.paymentError = action.payload.message;
      });
  },
});

const { reducer, actions } = orderSlice;

export const { paymentReset, orderStateReset, clearOrderDetails } = actions;

export default reducer;
