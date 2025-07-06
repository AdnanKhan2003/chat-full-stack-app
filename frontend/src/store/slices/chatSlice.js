import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  chatId: "",
}

export const selectedChatSlice = createSlice({
  name: 'selectedChat',
  initialState,
  reducers: {
    handleSelectedChat: (state, action) => {        
        state.chatId = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { handleSelectedChat } = selectedChatSlice.actions

export default selectedChatSlice.reducer