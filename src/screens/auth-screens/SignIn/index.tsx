import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import * as Keychain from 'react-native-keychain';
import useTheme from '../../../theme/hooks/useTheme';
import {APP_LOGO} from '../../../assets/images';
import SocialLogin from './SocialLogin';
import SignInForm from './SignInForm';
import LOCALES from '../../../localization/constants';
import {SignInScreenProps} from '../../../types/navigation/authTypes';
import {useAppDispatch} from '../../../store';
import {
  setIsSocialLogin,
  setIsUserSignedIn,
  setUserDetails,
} from '../../../store/slice/authSlice';
import {responsiveFontSize} from '../../../theme/responsiveFontSize';
import {useApi} from '../../../hooks/useApi';
import {URL} from '../../../constants/URLS';
import {appAlert} from '../../../components/appAlert';
import {setTokens} from '../../../utilities/token';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignIn = ({navigation}: SignInScreenProps) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const [userCredentials, setUserCredentials] = useState<{
    userId: null | string;
    password: null | string;
  }>({
    userId: null,
    password: null,
  });

  const [loginUser, loginUserResponse, loginUserError, isLoginUserLoading] =
    useApi({
      url: URL.LOGIN,
      method: 'POST',
      isSecureEntry: false,
    });

  const onLogin = useCallback((userId: string, password: string) => {
    setUserCredentials({
      userId: userId,
      password: password,
    });
    const body = {
      email: userId,
      password: password,
    };
    loginUser(body);
  }, []);

  useEffect(() => {
    const init = async () => {
      setTokens({
        accessToken: loginUserResponse?.data?.accessToken,
        refreshToken: loginUserResponse?.data?.refreshToken,
      });
      dispatch(setUserDetails(loginUserResponse?.data?.user));
      await AsyncStorage.setItem(
        'userDetails',
        JSON.stringify(loginUserResponse?.data?.user),
      );
      if (userCredentials?.userId && userCredentials?.password) {
        await Keychain.setGenericPassword(
          userCredentials?.userId,
          userCredentials?.password,
        );
      }
      if (loginUserResponse?.data?.user?.isFirstLogin) {
        navigation.navigate('AuthProfileStack', {
          screen: 'AccountCreated',
        });
      } else {
        dispatch(setIsUserSignedIn(true));
      }
    };

    if (
      loginUserResponse &&
      userCredentials?.userId &&
      userCredentials?.password
    ) {
      if (loginUserResponse?.statusCode === 200) {
        init();
      }
    }
  }, [loginUserResponse, userCredentials]);

  useEffect(() => {
    if (loginUserError) {
      if (loginUserError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: loginUserError?.message,
        });
      }
    }
  }, [loginUserError]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.APP_BACKGROUND_COLOR,
      }}>
      <StatusBar
        backgroundColor={COLORS.STATUS_BAR_COLOR}
        barStyle={BAR_STYLE}
      />
      <KeyboardAvoidingView
        style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{flex: 1, paddingHorizontal: 20}}>
          <View style={styles.imageContainer}>
            <Image source={APP_LOGO} style={styles.image} />
          </View>
          <SignInForm
            onForgotPassword={() => navigation.navigate('ForgotPassword')}
            onLogin={onLogin}
            loading={isLoginUserLoading}
          />
          <SocialLogin
            goToCreateAccountScreen={() =>
              navigation.navigate('SignUpStack', {
                screen: 'CreateAccount',
              })
            }
            goToAccountCreatedScreen={() =>
              navigation.navigate('AuthProfileStack', {
                screen: 'AccountCreated',
              })
            }
          />
          <View
            style={{
              marginTop: 38,
              marginBottom: Platform.OS === 'android' ? 38 : 20,
            }}>
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <Text
                style={{
                  color: COLORS.PRIMARY_TEXT_COLOR,
                  fontFamily: FONTS.MONTSERRAT.REGULAR,
                  fontSize: responsiveFontSize(14),
                }}>
                {t(LOCALES.SIGNIN.REGISTRATION_DESCRIPTION)}{' '}
              </Text>
              <Text
                style={{
                  color: COLORS.SECONDARY_COLOR,
                  fontSize: responsiveFontSize(14),
                }}
                onPress={() => {
                  dispatch(setIsSocialLogin(false));
                  navigation.navigate('SignUpStack', {
                    screen: 'CreateAccount',
                  });
                }}>
                {t(LOCALES.SIGNIN.REGISTRATION)}
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  imageContainer: {
    height: 66,
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  image: {
    height: 26,
    width: 172,
    resizeMode: 'contain',
  },
  register: {
    fontSize: responsiveFontSize(14),
    alignSelf: 'center',
  },
});
