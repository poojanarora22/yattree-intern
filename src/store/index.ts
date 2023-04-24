import {configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import profileReducer from './slice/profileSlice';
import authReducer from './slice/authSlice';
import createPostReducer from './slice/createPostSlice';
import homeReducer from './slice/homeSlice';
import forumReducer from './slice/forumSlice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    auth: authReducer,
    createPost: createPostReducer,
    home: homeReducer,
    forum: forumReducer,
  },
});

type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
