import { configureStore } from '@reduxjs/toolkit'

import authSliceReducer from './slices/authSlice'
import chatsReducer from './slices/chatSlice'

export const store = configureStore({
  reducer: {
    isAuth: authSliceReducer,
    chats: chatsReducer,
  },
})