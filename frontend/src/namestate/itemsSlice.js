import { createSlice } from "@reduxjs/toolkit";

export const itemsSlice = createSlice({
  name: "counter",
  initialState: {
    value: [],
  },
  reducers: {
    setItems: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setItems } = itemsSlice.actions;

export default itemsSlice.reducer;
