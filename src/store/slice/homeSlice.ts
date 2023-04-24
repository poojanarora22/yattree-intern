import {createSlice} from '@reduxjs/toolkit';

interface HomeSliceState {
  search: string;
}

const initialState: HomeSliceState = {
  search: '',
};

const homeSlice = createSlice({
  name: 'HomeSlice',
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
  },
});

export const {setSearch} = homeSlice.actions;

export default homeSlice.reducer;
