import { createAsyncThunk } from "@reduxjs/toolkit";

export const myChatThunk = createAsyncThunk(
  "chat/myChatThunk",
  async (_, thunkAPI) => {
    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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
