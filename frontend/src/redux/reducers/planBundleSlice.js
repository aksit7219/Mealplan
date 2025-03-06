import api from "@/config";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk for fetching all plan bundles
export const fetchPlanBundleData = createAsyncThunk(
  "planBundle/fetchPlanBundleData",
  async (id = null) => {
    if (!id) {
      const response = await api("/planbundles");
      const data = await response.data;
      return data;
    } else {
      const response = await api(`/planbundles/${id}`);
      const data = await response.data;
      return data;
    }
  }
);

// Thunk for fetching plan bundles by meal plan ID
export const fetchPlanBundlesByMealPlan = createAsyncThunk(
  "planBundle/fetchPlanBundlesByMealPlan",
  async (mealPlanId) => {
    const response = await api(`/planbundles/mealplan/${mealPlanId}`);
    const data = await response.data;
    return data;
  }
);

// Thunk for adding a plan bundle
export const addPlanBundle = createAsyncThunk(
  "planBundle/addPlanBundle",
  async (planBundle) => {
    const response = await api.post("/planbundles", planBundle);
    return response.data;
  }
);

// Thunk for updating a plan bundle
export const updatePlanBundle = createAsyncThunk(
  "planBundle/updatePlanBundle",
  async ({ id, planBundle }) => {
    const response = await api.put(`/planbundles/${id}`, planBundle);
    return response.data;
  }
);

// Thunk for deleting a plan bundle
export const deletePlanBundle = createAsyncThunk(
  "planBundle/deletePlanBundle",
  async (id) => {
    await api.delete(`/planbundles/${id}`);
    return id; // Return the ID of the deleted plan bundle
  }
);

const planBundleSlice = createSlice({
  name: "planBundle",
  initialState: {
    planBundles: [], // Store the plan bundles
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all plan bundles
      .addCase(fetchPlanBundleData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPlanBundleData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.planBundles = action.payload; // Store fetched data
      })
      .addCase(fetchPlanBundleData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message; // Store error if any
      })
      // Fetch plan bundles by meal plan ID
      .addCase(fetchPlanBundlesByMealPlan.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPlanBundlesByMealPlan.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.planBundles = action.payload; // Store the filtered bundles for the meal plan
      })
      .addCase(fetchPlanBundlesByMealPlan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add a new plan bundle
      .addCase(addPlanBundle.fulfilled, (state, action) => {
        state.planBundles.push(action.payload); // Add new plan bundle to the state
      })
      // Update a plan bundle
      .addCase(updatePlanBundle.fulfilled, (state, action) => {
        const index = state.planBundles.findIndex(
          (planBundle) => planBundle.id === action.payload.id
        );
        if (index !== -1) {
          state.planBundles[index] = action.payload; // Update the plan bundle in the state
        }
      })
      // Delete a plan bundle
      .addCase(deletePlanBundle.fulfilled, (state, action) => {
        state.planBundles = state.planBundles.filter(
          (planBundle) => planBundle.id !== action.payload
        ); // Remove the plan bundle from the state
        window.location.reload(); // Trigger a page refresh after deletion
      });
  },
});

export default planBundleSlice.reducer;
