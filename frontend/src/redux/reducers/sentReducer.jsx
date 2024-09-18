import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getSent } from "../../services/email";

// First, create the thunk to handle async fetch operation
export const fetchSentEmail = createAsyncThunk(
  "email/fetchSentEmail",
  async () => {
    const response = await getSent();
    console.log("Sent response:: ", response?.data);
    return response?.data;
  }
);

const sentSlice = createSlice({
  name: "sent",
  initialState: {
    emails: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSentEmail.pending, (state, action) => {
        // console.log("fetchSentEmail.pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSentEmail.fulfilled, (state, action) => {
        // console.log("fetchSentEmail.fulfilled");
        state.loading = false;
        state.emails = action.payload;
        state.error = null;
      })
      .addCase(fetchSentEmail.rejected, (state, action) => {
        // console.log("fetchSentEmail.rejected");
        state.loading = true;
        state.error = action.error.message;
      });
  },
});

export default sentSlice.reducer;
