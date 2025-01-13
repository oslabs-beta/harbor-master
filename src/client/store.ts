import { configureStore } from "@reduxjs/toolkit";
import graphReducer from "./reducers/graphReducer";
import userSlice from '../common/slices/userSlice';

export const store = configureStore({
  reducer: {
    graph: graphReducer,
    user: userSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;