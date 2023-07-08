import { configureStore } from "@reduxjs/toolkit";
import remoteReducer from "./remoteSlice";
export default configureStore({
  reducer: { remote: remoteReducer },
});
