import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  selectedAgencyLocation: null,
};

const locSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    locAgn: (state, action) => {
      state.selectedAgencyLocation = action.payload;
    },
  },
});
export const { locAgn } = locSlice.actions;
export default locSlice.reducer;
