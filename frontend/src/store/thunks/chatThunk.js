import { createAsyncThunk } from "@reduxjs/toolkit";

export const createChatThunk = createAsyncThunk(
  "chats/createChatThunk",
  async (userId, thunkAPI) => {
    try {
      const res = await fetch("http://localhost:3000/api/chat/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId }),
        credentials: 'include'
      });

      if(!res.ok) {
        throw new Error("Not Authenticated!");
      }

      const data = await res.json();
      console.log(data);
      
      
      return data;
    } catch (err) {
        console.log(err);
      return thunkAPI.rejectWithValue(err.response.data);
      
    }
  }
);