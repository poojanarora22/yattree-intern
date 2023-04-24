import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import SplashScreen from 'react-native-splash-screen';
import AuthRoutes from './AuthRoutes';
import AppRoutes from './AppRoutes';
import {useAppDispatch, useAppSelector} from '../store';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {setIsUserSignedIn, setUserDetails} from '../store/slice/authSlice';
import {getTokens, getVerifiedToken} from '../utilities/token';
import useCleanUp from '../hooks/useCleanUp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Linking} from 'react-native';
import {getParamsFromURL} from '../utilities/functions';
import {useApi} from '../hooks/useApi';
import {URL} from '../constants/URLS';
import {appAlert} from '../components/appAlert';
import {useTranslation} from 'react-i18next';
import LOCALES from '../localization/constants';

const RootNavigator = () => {
  const dispatch = useAppDispatch();
  const {isUserSignedIn} = useAppSelector(state => state.auth);
  const [logoutUser] = useCleanUp();
  const {t} = useTranslation();
  const linking = {
    prefixes: ['yaatrees://', 'https://yaatrees.com'],
  };

  useEffect(() => {
    const init = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        const tokens = await getTokens();
        const newTokens = await getVerifiedToken(tokens);
        const userDetails = await AsyncStorage.getItem('userDetails');
        if (credentials && newTokens) {
          dispatch(setIsUserSignedIn(true));
          if (userDetails) {
            dispatch(setUserDetails(JSON.parse(userDetails)));
          }
        } else {
          logoutUser();
        }
        SplashScreen.hide();
      } catch (error) {
        console.log('Error while getting user credentials...', error);
        logoutUser();
        SplashScreen.hide();
      }
    };
    init();
  }, []);

  const [
    verifyEmail,
    verifyEmailResponse,
    verifyEmailError,
    isVerifyEmailLoading,
  ] = useApi({
    url: URL.VERIFY_EMAIL,
    method: 'GET',
    isSecureEntry: false,
    isCustomURL: true,
  });

  useEffect(() => {
    if (verifyEmailResponse) {
      if (verifyEmailResponse?.statusCode === 200) {
        appAlert({
          title: t(LOCALES.SUCCESS.LBL_SUCCESS),
          message: t(LOCALES.SUCCESS.LBL_EMAIL_VERIFICATION_SUCCESS),
        });
      }
    }
  }, [verifyEmailResponse]);

  useEffect(() => {
    if (verifyEmailError) {
      if (verifyEmailError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: verifyEmailError?.message,
        });
      }
    }
  }, [verifyEmailError]);

  useEffect(() => {
    Linking.getInitialURL().then(url => {
      if (url && url.includes('verify-email')) {
        const params = getParamsFromURL(url);
        if (params?.email && params?.token) {
          verifyEmail(
            null,
            `${URL.VERIFY_EMAIL}email=${params?.email}&token=${params?.token}`,
          );
        }
      }
    });
  }, []);

  return (
    <SafeAreaProvider>
      <BottomSheetModalProvider>
        <NavigationContainer linking={linking}>
          {isUserSignedIn ? <AppRoutes /> : <AuthRoutes />}
        </NavigationContainer>
      </BottomSheetModalProvider>
    </SafeAreaProvider>
  );
};

export default RootNavigator;
