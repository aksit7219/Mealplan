import api from "@/config";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk for fetching all menu items
export const fetchMenuItems = createAsyncThunk(
  "menu/fetchMenuItems",
  async () => {
    const response = await api("/menu-items");
    const data = await response.data;
    return data;
  }
);

// Thunk for fetching menu items by menu ID and date
export const fetchMenuItemsByMenuAndDate = createAsyncThunk(
  "menu/fetchMenuItemsByMenuAndDate",
  async ({ menuId, date }) => {
    const response = await api(`/menu-items/${menuId}/${date}`);
    const data = await response.data;
    return data;
  }
);

// Thunk for adding a menu item
export const addMenuItem = createAsyncThunk(
  "menu/addMenuItem",
  async (menuItem) => {
    const response = await api.post("menu-items", menuItem);
    return response.data;
  }
);

// Thunk for updating a menu item
export const updateMenuItem = createAsyncThunk(
  "menu/updateMenuItem",
  async ({ id, menuItem }) => {
    const response = await api.put(`/menu-items/${id}`, menuItem);
    return response.data;
  }
);

// Thunk for deleting a menu item
export const deleteMenuItem = createAsyncThunk(
  "menu/deleteMenuItem",
  async (id) => {
    await api.delete(`/menu-items/${id}`);
    return id; // Return the ID of the deleted menu item
  }
);

const menuSlice = createSlice({
  name: "menuItem",
  initialState: {
    menuItems: [], // Store the menu items
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all menu items
      .addCase(fetchMenuItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.menuItems = action.payload; // Store fetched data
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Fetch menu items by menu ID and date
      .addCase(fetchMenuItemsByMenuAndDate.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMenuItemsByMenuAndDate.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.menuItems = action.payload; // Store filtered items
      })
      .addCase(fetchMenuItemsByMenuAndDate.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add a new menu item
      .addCase(addMenuItem.fulfilled, (state, action) => {
        state.menuItems.push(action.payload); // Add new item to state
      })
      // Update a menu item
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        const index = state.menuItems.findIndex(
          (menuItem) => menuItem.id === action.payload.id
        );
        if (index !== -1) {
          state.menuItems[index] = action.payload; // Update the item in state
        }
      })
      // Delete a menu item
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.menuItems = state.menuItems.filter(
          (menuItem) => menuItem.id !== action.payload
        ); // Remove the item from state
        window.location.reload(); // Trigger a page refresh after deletion
      });
  },
});

export default menuSlice.reducer;
