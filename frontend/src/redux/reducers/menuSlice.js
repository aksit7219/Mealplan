import api from "@/config";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk for fetching all menus
export const fetchMenus = createAsyncThunk("menu/fetchMenus", async () => {
  const response = await api("/menu");
  return response.data;
});

// Thunk for fetching a single menu by ID
export const fetchMenuById = createAsyncThunk(
  "menu/fetchMenuById",
  async (id) => {
    const response = await api(`/menus/${id}`);
    return response.data;
  }
);

// Thunk for adding a new menu
export const addMenu = createAsyncThunk("menu/addMenu", async (menu) => {
  const response = await api.post("/menus", menu);
  return response.data;
});

// Thunk for updating a menu by ID
export const updateMenu = createAsyncThunk(
  "menu/updateMenu",
  async ({ id, menu }) => {
    const response = await api.put(`/menus/${id}`, menu);
    return response.data;
  }
);

// Thunk for deleting a menu by ID
export const deleteMenu = createAsyncThunk("menu/deleteMenu", async (id) => {
  await api.delete(`/menus/${id}`);
  return id; // Return the ID of the deleted menu
});

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    menus: [], // Store all menus
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all menus
      .addCase(fetchMenus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMenus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.menus = action.payload; // Store fetched menus
      })
      .addCase(fetchMenus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Fetch single menu by ID
      .addCase(fetchMenuById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMenuById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.menus = [action.payload]; // Store the single menu fetched
      })
      .addCase(fetchMenuById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add a new menu
      .addCase(addMenu.fulfilled, (state, action) => {
        state.menus.push(action.payload); // Add new menu to state
      })
      // Update an existing menu
      .addCase(updateMenu.fulfilled, (state, action) => {
        const index = state.menus.findIndex(
          (menu) => menu.id === action.payload.id
        );
        if (index !== -1) {
          state.menus[index] = action.payload; // Update the menu in the state
        }
      })
      // Delete a menu
      .addCase(deleteMenu.fulfilled, (state, action) => {
        state.menus = state.menus.filter((menu) => menu.id !== action.payload); // Remove menu from state
        window.location.reload(); // Trigger page refresh after deletion
      });
  },
});

export default menuSlice.reducer;
