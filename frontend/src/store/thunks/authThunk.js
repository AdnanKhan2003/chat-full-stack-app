import { createAsyncThunk } from "@reduxjs/toolkit";
import { ENDPOINT_API } from "../../lib/utils";

export const checkAuthThunk = createAsyncThunk(
  "auth/checkAuthThunk",
  async (req, thunkAPI) => {
    try {
      const res = await fetch(`${ENDPOINT_API}/auth/check`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Not Authenticated!");
      }

      const data = await res.json();

      return data;
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);
