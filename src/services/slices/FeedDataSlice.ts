import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';
import { getOrderByNumberApi } from '../../utils/burger-api';

// Тип состояния для слайса "Orders"
type TOrderState = {
  orderList: TOrder[];
  totalOrders: number;
  ordersToday: number;
  errorMessage: null | string;
  isLoading: boolean;
  selectedOrder: TOrder | null;
};

const initialOrderState: TOrderState = {
  orderList: [],
  totalOrders: 0,
  ordersToday: 0,
  errorMessage: null,
  isLoading: false,
  selectedOrder: null
};

export const fetchOrderFeed = createAsyncThunk('orders/fetchFeed', getFeedsApi);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      return response;
    } catch (error) {
      return rejectWithValue('Ошибка при получении данных заказа');
    }
  }
);

export const orderSlice = createSlice({
  name: 'orderData',
  initialState: initialOrderState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderFeed.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrderFeed.fulfilled, (state, action) => {
        state.orderList = action.payload.orders;
        state.totalOrders = action.payload.total;
        state.ordersToday = action.payload.totalToday;
        state.isLoading = false;
      })
      .addCase(fetchOrderFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message || 'Ошибка загрузки фида';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedOrder = action.payload.orders[0];
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage =
          action.error.message || 'Ошибка загрузки данных заказа';
      });
  },
  selectors: {
    getOrderList: (state) => state.orderList,
    getTotalOrders: (state) => state.totalOrders,
    getOrdersToday: (state) => state.ordersToday,
    getLoadingState: (state) => state.isLoading,
    getErrorMessage: (state) => state.errorMessage,
    getSelectedOrder: (state) => state.selectedOrder
  }
});

export default orderSlice;
export const {
  getOrderList,
  getTotalOrders,
  getOrdersToday,
  getLoadingState,
  getErrorMessage
} = orderSlice.selectors;
