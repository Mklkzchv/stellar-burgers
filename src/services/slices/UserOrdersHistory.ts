import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { getOrdersApi } from '../../utils/burger-api';

type TOrdersState = {
  orders: TOrder[];
  loading: boolean;
  error: null | string | undefined;
};

const initialOrdersState: TOrdersState = {
  orders: [],
  loading: false,
  error: null
};

export const ordersHistory = createAsyncThunk(
  'user/orderHistory',
  getOrdersApi
);

export const userOrdersSlice = createSlice({
  name: 'ordershistory',
  initialState: initialOrdersState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ordersHistory.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(ordersHistory.fulfilled, (state, action) => {
        (state.orders = action.payload),
          (state.loading = false),
          (state.error = null);
      })
      .addCase(ordersHistory.rejected, (state, action) => {
        (state.error = action.error.message || 'Error orders history'),
          (state.loading = false);
      });
  },
  selectors: {
    getUserOrdersList: (state) => state.orders,
    getOrdersError: (state) => state.error,
    getOrdersLoadingStatus: (state) => state.loading
  }
});

export default userOrdersSlice;

export const { getUserOrdersList, getOrdersError, getOrdersLoadingStatus } =
  userOrdersSlice.selectors;
