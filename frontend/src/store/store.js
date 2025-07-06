import { configureStore } from '@reduxjs/toolkit'
import selectedChatReducer from './slices/chatSlice'
import authSliceReducer from './slices/authSlice'
import getUsersReducer from './slices/getUsersSlice'
import getSelectedChatReducer from './slices/chatsSlice'

export const store = configureStore({
  reducer: {
    selectedChat: selectedChatReducer,
    isAuth: authSliceReducer,
    getUsers: getUsersReducer,
    getChats: getSelectedChatReducer
  },
})