import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  error: null,
  succes: null,
  allNotification: [],
};

export const createNotifcationForSpecifiqueUser = createAsyncThunk(
  "notification/createNotifcationForSpecifiqueUser",
  async (notification) => {
    try {
      const response = await axios.post(
        `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/notification/add`,

        notification
      );
      // console.log(notification, "not");
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const getAllNotifcationByUser = createAsyncThunk(
  "notification/getAllNotifcationByUser",
  async (id) => {
    try {
      const response = await axios.get(
        `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/notification/get/${id}`
      );

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const deletedNotification = createAsyncThunk(
  "notification/deletedNotification",
  async (id) => {
    try {
      const response = await axios.delete(
        `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/notification/delete/${id}`
      );

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(getAllNotifcationByUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllNotifcationByUser.fulfilled, (state, action) => {
      state.loading = false;
      state.allNotification = action.payload;
    });
    builder.addCase(getAllNotifcationByUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(createNotifcationForSpecifiqueUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      createNotifcationForSpecifiqueUser.fulfilled,
      (state, action) => {
        state.loading = false;
      }
    );
    builder.addCase(
      createNotifcationForSpecifiqueUser.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      }
    );
    builder.addCase(deletedNotification.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deletedNotification.fulfilled, (state, action) => {
      state.loading = false;
      state.succes = action.payload;
    });
    builder.addCase(deletedNotification.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default notificationSlice.reducer;
