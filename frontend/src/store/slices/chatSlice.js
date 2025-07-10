import { createSlice } from "@reduxjs/toolkit";
import { checkAuthThunk } from "../thunks/authThunk";
import { chatThunk } from "../thunks/chatThunk";
import { myChatThunk } from "../thunks/myChatThunk ";

const initialState = {
  chats: [],
  myChats: [],
  groupChats: [],
  users: [],
  selectedChat: "",
  activeChat: "",
  isLoading: false,
  error: null,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    handleSelectChat: function (state, action) {
      state.selectedChat = action.payload;
    },
    handleActiveChat: function (state, action) {
        state.activeChat = action.payload;
    },
    handleAddUsers: function (state, action) {
      state.users = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(chatThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(chatThunk.fulfilled, (state, action) => {
      const newChat = action.payload;
      const existingChat = state.chats.find(c => c._id == newChat._id);
      if(!existingChat && !state.chats.find(chat => chat._id === newChat._id)) {
        state.chats = [newChat, ...state.chats];
      }
      state.selectedChat = action.payload._id;
      state.isLoading = false;
      state.error = null;
    })
    .addCase(chatThunk.rejected, (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    })

    .addCase(myChatThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(myChatThunk.fulfilled, (state, action) => {
      state.myChats = action.payload;
      state.isLoading = false;
      state.error = null;
    })
    .addCase(myChatThunk.rejected, (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    })
  }
});

// Action creators are generated for each case reducer function
export const { handleSelectChat, handleActiveChat } = chatSlice.actions;

export default chatSlice.reducer;
