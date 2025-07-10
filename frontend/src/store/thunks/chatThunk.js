import { createAsyncThunk } from "@reduxjs/toolkit";

export const chatThunk = createAsyncThunk(
  "chat/chatThunk",
  async (userId, thunkAPI) => {
    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to Access/Create Chat!");

      const resData = await res.json();

      return resData;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
