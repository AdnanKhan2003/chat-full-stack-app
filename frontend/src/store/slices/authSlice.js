import { createSlice } from "@reduxjs/toolkit";
import { checkAuthThunk } from "../thunks/authThunk";

const initialState = {
  user: null,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    handleUpdateProfilePic: function (state, action) {
      if (state.user) {
        state.user.profilePic = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuthThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(checkAuthThunk.rejected, (state, action) => {
        state.user = null;
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export const { handleUpdateProfilePic } = authSlice.actions;

export default authSlice.reducer;
