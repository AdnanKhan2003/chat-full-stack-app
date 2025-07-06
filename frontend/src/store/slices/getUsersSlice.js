import { createSlice } from '@reduxjs/toolkit'
import { checkAuth } from '../thunks/authThunk'
import { getUsers } from '../thunks/getUsersThunk'

const initialState = {
  users: [],
  isLoading: false,
  error: null
}

export const getUsersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.users = [];
      state.isLoading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
    })
    .addCase(getUsers.fulfilled, (state, action) => {
      console.log(action.payload);
      
        state.users = action.payload;
        state.isLoading = false;
    })
    .addCase(getUsers.rejected, (state, action) => {
      
      state.users = null;
      state.error = action.payload;      
        state.isLoading = false;
    })
  }
})

// Action creators are generated for each case reducer function
export const { handleSelectedChat, clearUsers } = getUsersSlice.actions

export default getUsersSlice.reducer