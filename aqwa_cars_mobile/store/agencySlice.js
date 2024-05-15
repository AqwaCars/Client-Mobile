import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  error: null,
  succes: null,
  list: [],
  oneAgency: [],
};
export const CreateAgency = createAsyncThunk(
  "agency/CreateAgency",
  async (params) => {
    if (!params) return;
    try {
      // console.log("here creating agency");
      const response = await axios.post(
        `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/request/create/${params.id}`,
        params.body
      );
      const requestId = response.data.id;
      await axios.post(
        `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/media/add/request/${requestId}`,
        params.media
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const getAgencyData = createAsyncThunk("agencies/getAll", async () => {
  try {
    const res = await axios.get(
      `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/agency/findAll`
    );
    return res.data;
  } catch (er) {
    console.error(JSON.stringify(er));
  }
});
export const getOne = createAsyncThunk("agencies/getOne", async (id) => {
  try {
   
    const res = await axios.get(
      `http://${process.env.EXPO_PUBLIC_SERVER_IP}:5000/api/agency/getOne/${id}`
    );
   
    return res.data;
  } catch (error) {
    console.log(error);
  }
});
const agencySlice = createSlice({
  name: "agency",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(CreateAgency.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(CreateAgency.fulfilled, (state, action) => {
      state.loading = false;
      state.succes = action.payload;
    });
    builder.addCase(CreateAgency.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(getAgencyData.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAgencyData.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload;
    });
    builder.addCase(getAgencyData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(getOne.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getOne.fulfilled, (state, action) => {
      state.loading = false;
      state.oneAgency = action.payload;
    });
    builder.addCase(getOne.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});
export const loading = (state) => state.agency.loading;
export const List = (state) => state.agency.list;
export const OneAgency = (state) => state.agency.oneAgency;

export default agencySlice.reducer;
