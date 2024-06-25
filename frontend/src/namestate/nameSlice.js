import { createSlice } from "@reduxjs/toolkit";

export const nameSlice = createSlice({
  name: "counter",
  initialState: {
    value: "",
  },
  reducers: {
    setname: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setname } = nameSlice.actions;

export default nameSlice.reducer;
