import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '../../utils/burger-api';

// Типизация состояния для списка ингредиентов
type TIngredientsState = {
  ingredientsList: Array<TIngredient>;
  isLoading: boolean;
  fetchError: null | string | undefined;
};

// Начальное состояние слайса
const initialIngredientsState: TIngredientsState = {
  ingredientsList: [],
  isLoading: false,
  fetchError: null
};

// Асинхронное действие для получения ингредиентов из API
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => {
    const response = await getIngredientsApi();
    return response;
  }
);

// Создание слайса с состоянием и редюсерами
const ingredientsSlice = createSlice({
  name: 'ingredientsData',
  initialState: initialIngredientsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.fetchError = null;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.fetchError = action.error.message;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredientsList = action.payload;
      });
  },
  selectors: {
    selectIngredients: (state) => state.ingredientsList,
    selectLoadingStatus: (state) => state.isLoading
  }
});

export default ingredientsSlice;
export const { selectIngredients, selectLoadingStatus } =
  ingredientsSlice.selectors;
