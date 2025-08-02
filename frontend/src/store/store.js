import { configureStore } from "@reduxjs/toolkit";

import authSliceReducer from "./slices/authSlice";
import chatsReducer from "./slices/chatSlice";
import notificationReducer from "./slices/notificationSlice";
import socketReducer from "./slices/socketSlice";

export const store = configureStore({
  reducer: {
    isAuth: authSliceReducer,
    chats: chatsReducer,
    notifications: notificationReducer,
    socket: socketReducer,
  },
});
