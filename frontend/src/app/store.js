import { configureStore } from "@reduxjs/toolkit";
import nameReducer from "../namestate/nameSlice";
import itemsReducer from "../namestate/itemsSlice";
import userReducer  from "../namestate/userSlice";

export default configureStore({
  reducer: {
    name: nameReducer,
    items: itemsReducer,
    user: userReducer,
  },
});
