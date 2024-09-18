import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getInbox } from "../../services/email";

// First, create the thunk to handle async fetch operation
export const fetchInboxEmail = createAsyncThunk(
  "email/fetchInbox",
  async () => {
    const response = await getInbox();
    console.log(response?.data);
    return response?.data;
  }
);

const inboxSlice = createSlice({
  name: "inbox",
  initialState: {
    emails: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInboxEmail.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInboxEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.emails = action.payload;
        state.error = null;
      })
      .addCase(fetchInboxEmail.rejected, (state, action) => {
        state.loading = true;
        state.error = action.error.message;
      });
  },
});

export default inboxSlice.reducer;
