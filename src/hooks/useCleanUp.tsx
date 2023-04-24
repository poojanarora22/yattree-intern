import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import * as Keychain from 'react-native-keychain';
import {useCallback, useState} from 'react';
import {useAppDispatch} from '../store';
import {setClearAuthData, setIsUserSignedIn} from '../store/slice/authSlice';
import {setClearProfileData} from '../store/slice/profileSlice';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoginManager} from 'react-native-fbsdk-next';

function useCleanUp(): [any, boolean] {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const logoutUser = useCallback(async () => {
    try {
      setLoading(true);
      dispatch(setIsUserSignedIn(false));
      dispatch(setClearAuthData(false));
      dispatch(setClearProfileData(false));
      const asyncStorageKeys = await AsyncStorage.getAllKeys();
      if (asyncStorageKeys?.length > 0) {
        await AsyncStorage.clear();
      }
      await EncryptedStorage.clear();
      await Keychain.resetGenericPassword();
      const isSignedInWithGoogle = await GoogleSignin.isSignedIn();
      if (isSignedInWithGoogle) {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }
      LoginManager.logOut();
      setLoading(false);
    } catch (error) {
      console.log('Error while logging out...', error);
    }
  }, []);
  return [logoutUser, loading];
}

export default useCleanUp;
