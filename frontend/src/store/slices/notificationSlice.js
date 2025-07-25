import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],

  isLoading: false,
  error: null,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    handleAddNotification: function(state, action) {
      const payload = action.payload;
      console.log('payload', payload);
      

      if(Array.isArray(payload)) {
        state.notifications.push(...payload);
      } else {
        state.notifications.push(payload);
      }
    },
    handleRemoveNotificationById: function (state, action) {
      state.notifications = state.notifications.filter(n => n._id != action.payload);
    },
    clearNotifications: function(state) {
      state.notifications = [];
    }
  },
});

export const { handleAddNotification, handleRemoveNotificationById, clearNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
