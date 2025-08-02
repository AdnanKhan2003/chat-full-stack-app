import { createAsyncThunk } from "@reduxjs/toolkit";
import { ENDPOINT_API } from "../../lib/utils";

export const myChatThunk = createAsyncThunk(
  "chat/myChatThunk",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(`${ENDPOINT_API}/chat`, {
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
