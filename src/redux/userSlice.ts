import { createSlice } from '@reduxjs/toolkit';

interface UserState {
  activeUser: any;
}

const initialState: UserState = {
  activeUser: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.activeUser = action.payload;
    },
  },
});

export const { addUser } = userSlice.actions;

export default userSlice.reducer;
