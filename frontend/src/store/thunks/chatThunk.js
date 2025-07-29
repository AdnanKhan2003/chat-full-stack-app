import { createAsyncThunk } from "@reduxjs/toolkit";
import { ENDPOINT_API } from "../../lib/utils";

export const chatThunk = createAsyncThunk(
  "chat/chatThunk",
  async (userId, thunkAPI) => {
    try {
      const res = await fetch(`${ENDPOINT_API}/chat`, {
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
