import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.userInfo.token;
      const response = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserByID = createAsyncThunk(
  "admin/fetchUserByID",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.userInfo.token;
      const response = await axios.get(`/api/user/${id}`, {
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

export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async (user, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.userInfo.token;
      const response = await axios.put(`/api/user/${user._id}`, user, {
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

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.userInfo.token;
      const response = await axios.delete(`/api/user/${id}`, {
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

export const fetchOrders = createAsyncThunk(
  "admin/fetchOrders",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.userInfo.token;
      const response = await axios.get("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.message);
    }
  }
);

export const updateOrderToDeliver = createAsyncThunk(
  "admin/updateOrderToDeliver",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.userInfo.token;
      const response = await axios.put(
        `/api/orders/${id}/deliver`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.message);
    }
  }
);

const initialState = {
  users: [],
  usersLoading: false,
  usersError: null,
  deleteUserLoading: false,
  deleteUserError: null,
  userDetails: {},
  userDetailsLoading: false,
  userDetailsError: null,
  orders: [],
  ordersLoading: false,
  ordersError: null,
  updateDeliverLoading: false,
  updateDeliverError: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState: initialState,
  reducers: {
    clearUsers: (state, action) => {
      state.users = [];
    },
    clearUserDetails: (state, action) => {
      state.userDetails = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state, action) => {
        state.usersLoading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload;
        state.usersError = null;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload.message;
      })
      .addCase(fetchUserByID.pending, (state, action) => {
        state.userDetailsLoading = true;
      })
      .addCase(fetchUserByID.fulfilled, (state, action) => {
        state.userDetailsLoading = false;
        state.userDetails = action.payload;
      })
      .addCase(fetchUserByID.rejected, (state, action) => {
        state.userDetailsLoading = false;
        state.userDetailsError = action.payload.message;
      })
      .addCase(updateUser.pending, (state, action) => {
        state.userDetailsLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.userDetailsLoading = false;
        state.userDetails = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.userDetailsLoading = false;
        state.userDetailsError = action.payload.message;
      })
      .addCase(deleteUser.pending, (state, action) => {
        state.deleteUserLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteUserLoading = false;
        state.deleteUserError = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteUserLoading = false;
        state.deleteUserError = action.payload.message;
      })
      .addCase(fetchOrders.pending, (state, action) => {
        state.ordersLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = action.payload;
        state.ordersError = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError = action.payload.message;
      })
      .addCase(updateOrderToDeliver.pending, (state, action) => {
        state.updateDeliverLoading = true;
      })
      .addCase(updateOrderToDeliver.fulfilled, (state, action) => {
        state.updateDeliverLoading = false;
        state.updateDeliverError = null;
      })
      .addCase(updateOrderToDeliver.rejected, (state, action) => {
        state.updateDeliverLoading = false;
        state.updateDeliverError = action.payload;
      });
  },
});

const { reducer, actions } = adminSlice;

export const { clearUsers, clearUserDetails } = actions;

export default reducer;
