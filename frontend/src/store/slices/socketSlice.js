import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    socket: null
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocket: function (state, action) {
        state.socket = action.payload;
    },
    clearSocket: function (state) {
        state.socket?.disconnect?.();
        state.socket = null;
    },
  },
});

export const { setSocket, clearSocket } = socketSlice.actions;

export default socketSlice.reducer;
