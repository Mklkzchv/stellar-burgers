import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  nanoid
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '../../utils/burger-api';

type TConstructorState = {
  items: {
    bun: TIngredient | null;
    ingredients: Array<TConstructorIngredient>;
  };
  isOrdering: boolean;
  orderData: TOrder | null;
  isLoading: boolean;
  errorMessage: null | string | undefined;
};

const initialState: TConstructorState = {
  items: {
    bun: null,
    ingredients: []
  },
  isOrdering: false,
  orderData: null,
  isLoading: false,
  errorMessage: null
};

export const createNewOrder = createAsyncThunk(
  'order/createNewOrder',
  async (ingredientIds: string[]) => {
    const response = await orderBurgerApi(ingredientIds);
    return response;
  }
);

export const burgerConstructor = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.items.bun = action.payload;
        } else {
          state.items.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const uniqueId = nanoid();
        return { payload: { ...ingredient, id: uniqueId } };
      }
    },

    removeIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.items.ingredients = state.items.ingredients.filter(
        (item) => item.id !== action.payload.id
      );
    },

    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index > 0) {
        const ingredients = state.items.ingredients;
        [ingredients[index - 1], ingredients[index]] = [
          ingredients[index],
          ingredients[index - 1]
        ];
      }
    },

    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < state.items.ingredients.length - 1) {
        const ingredients = state.items.ingredients;
        [ingredients[index + 1], ingredients[index]] = [
          ingredients[index],
          ingredients[index + 1]
        ];
      }
    },

    resetOrder: (state) => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isOrdering = true;
        state.errorMessage = null;
      })

      .addCase(createNewOrder.rejected, (state, action) => {
        state.isOrdering = false;
        state.errorMessage = action.error.message;
      })

      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isOrdering = false;
        state.orderData = action.payload.order;
        state.items.bun = null;
        state.items.ingredients = [];
        state.errorMessage = null;
      });
  },
  selectors: {
    getConstructorItems: (state) => state.items,
    getOrderStatus: (state) => state.isOrdering,
    getOrderDetails: (state) => state.orderData,
    getIsLoading: (state) => state.isLoading,
    getError: (state) => state.errorMessage
  }
});

export default burgerConstructor;
export const {
  getConstructorItems,
  getOrderStatus,
  getOrderDetails,
  getIsLoading,
  getError
} = burgerConstructor.selectors;

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  resetOrder
} = burgerConstructor.actions;
