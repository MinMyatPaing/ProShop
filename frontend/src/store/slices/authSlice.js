import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/user/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/user/register",
        { name, email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserDetails = createAsyncThunk(
  "auth/fetchUserDetails",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.userInfo.token;

      const response = await axios.get("/api/user/profile", {
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

export const updateUserDetails = createAsyncThunk(
  "auth/updateUserDetails",
  async (user, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.userInfo.token;
      const response = await axios.put(
        "/api/user/profile",
        { user },
        {
          headers: {
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
  userDetails: {},
  loading: false,
  profileLoading: false,
  profileError: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    logout: (state, action) => {
      localStorage.removeItem("userInfo");
      state.userInfo = null;
      state.userDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(registerUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchUserDetails.pending, (state, action) => {
        state.profileLoading = true;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.userDetails = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload.message;
      })
      .addCase(updateUserDetails.pending, (state, action) => {
        state.profileLoading = true;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.userDetails = action.payload;
        state.userInfo.name = action.payload.name;
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload.message;
      });
  },
});

const { reducer, actions } = authSlice;

export const { logout } = actions;

export default reducer;
