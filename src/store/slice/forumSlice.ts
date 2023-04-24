import {createSlice} from '@reduxjs/toolkit';

interface ForumSliceState {
  isForumScreenReload: boolean;
}

const initialState: ForumSliceState = {
  isForumScreenReload: false,
};

const forumSlice = createSlice({
  name: 'ForumSlice',
  initialState,
  reducers: {
    setIsForumScreenReload: (state, action) => {
      state.isForumScreenReload = action.payload;
    },
  },
});

export const {setIsForumScreenReload} = forumSlice.actions;

export default forumSlice.reducer;
