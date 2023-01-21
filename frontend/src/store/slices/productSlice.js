import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// async actions with thunk
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async ({ keyword = "", page = "" }, { rejectWithValue }) => {
    try {
      const url = `/api/products?keyword=${keyword}&page=${page}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  "product/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const submitProductForm = createAsyncThunk(
  "product/submitForm",
  async ({ id, product }, { rejectWithValue, getState }) => {
    try {
      let response;
      const token = getState().auth.userInfo.token;
      if (id) {
        response = await axios.put(`/api/products/${id}`, product, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("Respone: ", response.data);
      } else {
        response = await axios.post(`/api/products`, product, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteProductByID = createAsyncThunk(
  "product/deleteProduct",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.userInfo.token;
      const response = await axios.delete(`/api/products/${id}`, {
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

export const createReview = createAsyncThunk(
  "product/createReviews",
  async ({ id, rating, comment }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.userInfo.token;
      const response = await axios.post(
        `/api/products/${id}/reviews`,
        { rating, comment },
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

export const fetchTopRatedProducts = createAsyncThunk(
  "product/getTopRated",
  async ({ limit }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/products/top/${limit}`);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  products: [],
  topProducts: [],
  topProductsLoading: false,
  topProductsError: null,
  page: 0,
  pages: 0,
  isProductsFetching: false,
  isProductDeleting: false,
  isFormSubmitting: false,
  selectedProduct: {},
  isSingleProductFetching: false,
  formError: null,
  error: null,
  reviewLoading: false,
  reviewError: null,
};

// slice related to products
const productSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {
    clearProductDetails(state, action) {
      state.error = null;
      state.selectedProduct = {};
      state.isSingleProductFetching = false;
    },
    resetReviewState(state, action) {
      state.reviewError = null;
      state.reviewLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        state.isProductsFetching = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isProductsFetching = false;
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isProductsFetching = false;
        state.error = action.payload.message;
      })
      .addCase(fetchProductDetails.pending, (state, action) => {
        state.isSingleProductFetching = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isSingleProductFetching = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isSingleProductFetching = false;
        state.error = action.payload.message;
      })
      .addCase(submitProductForm.pending, (state, action) => {
        state.isFormSubmitting = true;
      })
      .addCase(submitProductForm.fulfilled, (state, action) => {
        state.isFormSubmitting = false;
        state.formError = null;
      })
      .addCase(submitProductForm.rejected, (state, action) => {
        state.isFormSubmitting = false;
        state.formError = action.payload.message;
      })
      .addCase(deleteProductByID.pending, (state, action) => {
        state.isProductDeleting = true;
      })
      .addCase(deleteProductByID.fulfilled, (state, action) => {
        state.isProductDeleting = false;
      })
      .addCase(deleteProductByID.rejected, (state, action) => {
        state.isProductDeleting = false;
        state.error = action.payload.message;
      })
      .addCase(createReview.pending, (state, action) => {
        state.reviewLoading = true;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviewLoading = false;
        state.reviewError = null;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.reviewLoading = false;
        state.reviewError = action.payload.message;
      })
      .addCase(fetchTopRatedProducts.pending, (state, action) => {
        state.topProductsLoading = true;
      })
      .addCase(fetchTopRatedProducts.fulfilled, (state, action) => {
        state.topProductsLoading = false;
        state.topProducts = action.payload;
        state.topProductsError = null;
      })
      .addCase(fetchTopRatedProducts.rejected, (state, action) => {
        state.topProductsLoading = false;
        state.topProductsError = action.payload.message;
      });
  },
});

const { reducer, actions } = productSlice;

export const { clearProductDetails, resetReviewState } = actions;

export default reducer;
