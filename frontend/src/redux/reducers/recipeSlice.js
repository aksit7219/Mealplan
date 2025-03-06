import api from "@/config";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk for fetching recipe data
export const fetchRecipeData = createAsyncThunk(
  "recipe/fetchRecipeData",
  async () => {
    const response = await api("/recipes");
    const data = await response.data;
    return data;
  }
);

// // Fetch recipes by type
// export const fetchRecipeByType = createAsyncThunk('recipe/fetchRecipeByType', async (type) => {
//     const response = await api.get(`/recipe/type/${type}`);
//     return response.data;
//   });

// Thunk for adding a recipe
export const addRecipe = createAsyncThunk(
  "recipe/addRecipe",
  async (recipe) => {
    const response = await api.post("/recipe", recipe);
    return response.data;
  }
);

// Thunk for updating a recipe
export const updateRecipe = createAsyncThunk(
  "recipe/updateRecipe",
  async ({ id, recipe }) => {
    const response = await api.put(`/recipe/${id}`, recipe);
    return response.data;
  }
);

// Thunk for deleting a recipe
export const deleteRecipe = createAsyncThunk(
  "recipe/deleteRecipe",
  async (id) => {
    await api.delete(`/recipe/${id}`);
    return id; // Return the id of the deleted recipe
  }
);

const recipeSlice = createSlice({
  name: "recipe",
  initialState: {
    recipes: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipeData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRecipeData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.recipes = action.payload; // Store fetched data
      })
      .addCase(fetchRecipeData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message; // Store error if any
      })
      .addCase(addRecipe.fulfilled, (state, action) => {
        state.recipes.push(action.payload); // Add new recipe to the state
      })
      .addCase(updateRecipe.fulfilled, (state, action) => {
        const index = state.recipes.findIndex(
          (recipe) => recipe.id === action.payload.id
        );
        if (index !== -1) {
          state.recipes[index] = action.payload; // Update the recipe in the state
        }
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.recipes = state.recipes.filter(
          (recipe) => recipe.id !== action.payload
        ); // Remove the recipe from the state
        // Trigger a page refresh after deletion
        window.location.reload();
      });
  },
});
 
export default recipeSlice.reducer;
