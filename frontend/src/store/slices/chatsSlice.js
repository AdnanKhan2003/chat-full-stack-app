import { createSlice } from '@reduxjs/toolkit'
import { createChatThunk } from '../thunks/chatThunk'

const initialState = {
  chat: [],
  isLoading: false,
  error: null,
}

export const getSelectedChatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
    .addCase(createChatThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
    })
    .addCase(createChatThunk.fulfilled, (state, action) => {
        const isDuplicate = state.chat.find(c => c._id == action.payload._id);

        if(!isDuplicate){

          state.chat.push(action.payload);
        }
        state.isLoading = false;
        state.error = null;
    })
    .addCase(createChatThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
    })
  }
})

// Action creators are generated for each case reducer function
export const { handleSelectedChat } = getSelectedChatSlice.actions

export default getSelectedChatSlice.reducer