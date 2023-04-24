import {createSlice} from '@reduxjs/toolkit';

interface AuthSliceState {
  isUserSignedIn: boolean;
  isSocialLogin: boolean;
  signUpUserData: any;
  profileSetupUserData: any;
  userDetails: any | null;
  socialLoginData: any | null;
}

const initialState: AuthSliceState = {
  isUserSignedIn: false,
  isSocialLogin: false,
  signUpUserData: null,
  userDetails: null,
  profileSetupUserData: null,
  socialLoginData: null,
};

const authSlice = createSlice({
  name: 'AuthSlice',
  initialState,
  reducers: {
    setIsUserSignedIn: (state, action) => {
      state.isUserSignedIn = action.payload;
    },
    setIsSocialLogin: (state, action) => {
      state.isSocialLogin = action.payload;
    },
    setSignUpUserData: (state, action) => {
      state.signUpUserData = action.payload;
    },
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
    setProfileSetupUserData: (state, action) => {
      state.profileSetupUserData = action.payload;
    },
    setSocialLoginData: (state, action) => {
      state.socialLoginData = action.payload;
    },
    setClearAuthData: (state, action) => {
      state.isUserSignedIn = false;
      state.isSocialLogin = false;
      state.signUpUserData = null;
      state.userDetails = null;
      state.profileSetupUserData = null;
      state.socialLoginData = null;
    },
  },
});

export const {
  setIsUserSignedIn,
  setSignUpUserData,
  setUserDetails,
  setProfileSetupUserData,
  setIsSocialLogin,
  setSocialLoginData,
  setClearAuthData
} = authSlice.actions;

export default authSlice.reducer;
