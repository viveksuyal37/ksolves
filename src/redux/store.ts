import { configureStore } from '@reduxjs/toolkit';
import { rootApiSlice } from './apiSlice/rootSlice';
import userSlice from './userSlice';

const store = configureStore({
  reducer: {
    user: userSlice,
    [rootApiSlice.reducerPath]: rootApiSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(rootApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
