import api from "@/config";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk for fetching customer data
// export const fetchCustomerData = createAsyncThunk(
//   "customer/fetchCustomerData",
//   async (id) => {
//     if (!id) {
//       const response = await api("/getusers");
//       const data = await response.data;
//       return data;
//     } else {
//       const response = await api("/getusers");
//       const data = await response.data;
//       return data;
//     }
//   }
// );

// // Thunk for fetching customer data

export const fetchCustomerData = createAsyncThunk(
  "customers/fetchCustomerData",
  async (id = null) => {
    if (!id) {
      const response = await api("/getusers");
      //   console.log(response.data.data);
      const data = await response.data.data;
      return data;
    }
  }
);

// Thunk for updating customer data
export const updateCustomer = createAsyncThunk(
  "customer/updateCustomer",
  async ({ id, user }) => {
    if (id) {
      const response = await api.put(`/putSingleUser/${id}`, user);
      const data = await response.data;
      return data;
    }
  }
);

const customerSlice = createSlice({
  name: "customers",
  initialState: {
    customers: [], // Store the plan bundles
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all plan bundles
      .addCase(fetchCustomerData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCustomerData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.customers = action.payload; // Store fetched data
      })
      .addCase(fetchCustomerData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message; // Store error if any
      })

      // Update a plan bundle
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.customers.findIndex(
          (customers) => customers.id === action.payload.id
        );
        if (index !== -1) {
          state.customers[index] = action.payload; // Update the plan bundle in the state
        }
      });
  },
});

export default customerSlice.reducer;
