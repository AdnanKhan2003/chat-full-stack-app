import { createSlice } from '@reduxjs/toolkit'
import { checkAuth } from '../thunks/authThunk'

const initialState = {
  user: null,
  isLoading: false,
  error: null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
    })
    .addCase(checkAuth.fulfilled, (state, action) => {
      
        state.user = action.payload;
        state.isLoading = false;
    })
    .addCase(checkAuth.rejected, (state, action) => {
      
      state.user = null;
      state.error = action.payload;      
        state.isLoading = false;
    })
  }
})

// Action creators are generated for each case reducer function
export const { handleSelectedChat } = authSlice.actions

export default authSlice.reducer