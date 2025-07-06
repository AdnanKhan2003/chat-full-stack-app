import { createAsyncThunk } from "@reduxjs/toolkit";

export const getUsers = createAsyncThunk(
  "users/getUsers",
  async (userName , thunkAPI) => {
    try {
      const keyword = userName;

      const res = await fetch(`http://localhost:3000/api/auth/users?search=${keyword}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          },
          credentials: 'include'
      });

      if(!res.ok) {
          throw new Error("Searching Users Failed!");
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