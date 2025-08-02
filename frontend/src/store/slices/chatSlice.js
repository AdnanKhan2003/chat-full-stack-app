import { createSlice } from "@reduxjs/toolkit";
import { checkAuthThunk } from "../thunks/authThunk";
import { chatThunk } from "../thunks/chatThunk";
import { myChatThunk } from "../thunks/myChatThunk ";

// REMOVED
// groupChats: [],
// selectedChat: "",
// chats: [],

const initialState = {
  myChats: [],
  users: [],
  activeChat: "",

  refetchFlag: false,
  goToChat: true,

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
    removeActiveChat: function (state, action) {
      state.activeChat = "";
    },
    handleAddToMyChats: function (state, action) {
      const chat = {
        ...action.payload,
        createdAt: action.payload.createdAt || new Date().toISOString(),
      };

      const chatIndex = state.myChats.find(
        (c) => c._id.toString() === chat._id.toString()
      );

      if (chatIndex !== -1) {
        state.myChats.splice(chatIndex, 1);
      }

      state.myChats.unshift(chat);
    },
    triggerRefetch: function (state, action) {
      state.refetchFlag = action.payload;
    },
    handlePushNotificationChat: function (state, action) {
      const chatId = action.payload.chat._id;

      const chatIndex = state.myChats.findIndex(
        (c) => c._id.toString() === chatId.toString()
      );

      if (chatIndex == -1) {
        state.activeChat = action.payload.chat;
        return;
      }

      const latestNotificationMessage = state.myChats[chatIndex];

      if (!latestNotificationMessage) return;

      if (latestNotificationMessage.latestMessage) {
        latestNotificationMessage.latestMessage.createdAt =
          new Date().toISOString();
      }

      state.myChats = [
        latestNotificationMessage,
        ...state.myChats.filter((c) => c._id.toString() !== chatId.toString()),
      ];
    },
    handlePushLatestMessage: function (state, action) {
      const { chatId, latestMessage } = action.payload;

      const chatIndex = state.myChats.findIndex(
        (c) => c._id.toString() === chatId.toString()
      );

      if (chatIndex !== -1) {
        state.myChats[chatIndex] = {
          ...state.myChats[chatIndex],
          latestMessage,
        };

        const updatedChat = state.myChats[chatIndex];
        state.myChats.splice(chatIndex, 1);
        state.myChats.unshift(updatedChat);

        if (
          state.activeChat &&
          state.activeChat._id.toString() === chatId.toString()
        ) {
          state.activeChat = updatedChat;
        }
      }
    },
    handleAddUsers: function (state, action) {
      state.users = action.payload;
    },
    handleAddUserToGroup: function (state, action) {
      const updatedChat = action.payload;

      const existingChatIndex = state.myChats.findIndex(
        (c) => c._id == updatedChat._id
      );

      if (existingChatIndex != -1) {
        state.myChats[existingChatIndex] = updatedChat;
      } else return;

      if (
        state.activeChat &&
        state.activeChat._id &&
        state.activeChat._id == updatedChat._id
      ) {
        state.activeChat = updatedChat;
      }
    },
    handleRemoveUserFromGroup: function (state, action) {
      const updatedChat = action.payload;

      const existingChatIndex = state.myChats.findIndex(
        (c) => c._id == updatedChat._id
      );

      if (existingChatIndex != -1) {
        state.myChats[existingChatIndex] = updatedChat;
      } else return;

      if (
        state.activeChat &&
        state.activeChat._id &&
        state.activeChat._id == updatedChat._id
      ) {
        state.activeChat = updatedChat;
      }
    },
    handleGoToChat: function (state, action) {
      state.goToChat = true;
    },
    handleGoToChats: function (state, action) {
      state.goToChat = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(chatThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(chatThunk.fulfilled, (state, action) => {
        const newChat = action.payload;
        const existingChat = state.myChats.find((c) => c._id == newChat._id);
        if (
          !existingChat &&
          !state.myChats.find((chat) => chat._id === newChat._id)
        ) {
          state.myChats = [newChat, ...state.myChats];
        }
        state.selectedChat = action.payload._id;
        state.activeChat = action.payload;
        state.isLoading = false;
        state.activeChat = newChat;
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

        if (state.activeChat) {
          const updatedChat = action.payload.find(
            (chat) => chat._id == state.activeChat._id
          );

          if (updatedChat) {
            state.activeChat = updatedChat;
          }
        }

        state.isLoading = false;
        state.error = null;
      })
      .addCase(myChatThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export const {
  handleSelectChat,
  handleActiveChat,
  removeActiveChat,
  triggerRefetch,
  handleAddToMyChats,
  handlePushNotificationChat,
  handlePushLatestMessage,
  handleAddUserToGroup,
  handleRemoveUserFromGroup,
  handleGoToChat,
  handleGoToChats,
} = chatSlice.actions;

export default chatSlice.reducer;
