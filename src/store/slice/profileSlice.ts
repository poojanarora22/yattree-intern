import {createSlice} from '@reduxjs/toolkit';

interface ProfileSliceState {
  profilePicture: string | null;
  profileInformation: any;
}

const initialState: ProfileSliceState = {
  profilePicture: null,
  profileInformation: {},
};

const profileSlice = createSlice({
  name: 'ProfileSlice',
  initialState,
  reducers: {
    setProfilePicture: (state, action) => {
      state.profilePicture = action.payload;
    },
    setProfileInformation: (state, action) => {
      state.profileInformation = action.payload;
    },
    setClearProfileData: (state, action) => {
      state.profilePicture = null;
      state.profileInformation = {};
    },
  },
});

export const {setProfilePicture, setProfileInformation, setClearProfileData} =
  profileSlice.actions;

export default profileSlice.reducer;
