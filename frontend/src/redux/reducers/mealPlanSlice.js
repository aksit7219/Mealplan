import api from '@/config';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk for fetching meal plan data
export const fetchMealPlanData = createAsyncThunk('mealPlan/fetchMealPlanData', async () => {
  const response = await api('/mealplans');
  const data = await response.data;
  return data;
});

// Thunk for adding a meal plan
export const addMealPlan = createAsyncThunk('mealPlan/addMealPlan', async (mealPlan) => {
  const response = await api.post('/mealplans', mealPlan);
  return response.data;
});

// Thunk for updating a meal plan
export const updateMealPlan = createAsyncThunk('mealPlan/updateMealPlan', async ({ id, mealPlan }) => {
  const response = await api.put(`/mealplans/${id}`, mealPlan);
  return response.data;
});

// Thunk for deleting a meal plan
export const deleteMealPlan = createAsyncThunk('mealPlan/deleteMealPlan', async (id) => {
  await api.delete(`/mealplans/${id}`);
  return id; // Return the id of the deleted meal plan
});

const mealPlanSlice = createSlice({
  name: 'mealPlan',
  initialState: {
    mealPlans: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMealPlanData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMealPlanData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.mealPlans = action.payload; // Store fetched data
      })
      .addCase(fetchMealPlanData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message; // Store error if any
      })
      .addCase(addMealPlan.fulfilled, (state, action) => {
        state.mealPlans.push(action.payload); // Add new meal plan to the state
      })
      .addCase(updateMealPlan.fulfilled, (state, action) => {
        const index = state.mealPlans.findIndex(mealPlan => mealPlan.id === action.payload.id);
        if (index !== -1) {
          state.mealPlans[index] = action.payload; // Update the meal plan in the state
        }
      })
      .addCase(deleteMealPlan.fulfilled, (state, action) => {
        state.mealPlans = state.mealPlans.filter(mealPlan => mealPlan.id !== action.payload); // Remove the meal plan from the state
        // Trigger a page refresh after deletion
       window.location.reload();
      });
       
  },
});

export default mealPlanSlice.reducer;
