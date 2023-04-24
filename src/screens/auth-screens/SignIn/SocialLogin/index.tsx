import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {AccessToken, LoginManager, Settings} from 'react-native-fbsdk-next';

import Chip from '../../../../components/Chip';
import {APPLE, GOOGLE, FACEBOOK, LINKEDIN} from '../../../../assets/icons/svg';
import LOCALES from '../../../../localization/constants';
import useTheme from '../../../../theme/hooks/useTheme';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import {useApi} from '../../../../hooks/useApi';
import {URL} from '../../../../constants/URLS';
import appleAuth from '@invertase/react-native-apple-authentication';
import {appAlert} from '../../../../components/appAlert';
import {useAppDispatch} from '../../../../store';
import {
  setIsSocialLogin,
  setIsUserSignedIn,
  setSocialLoginData,
  setUserDetails,
} from '../../../../store/slice/authSlice';
import {setTokens} from '../../../../utilities/token';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

type SocialLoginTypes = {
  goToCreateAccountScreen: () => void;
  goToAccountCreatedScreen: () => void;
};

const SocialLogin = ({
  goToCreateAccountScreen = () => {},
  goToAccountCreatedScreen = () => {},
}: SocialLoginTypes) => {
  const {t} = useTranslation();
  const {FONTS, COLORS} = useTheme();
  const dispatch = useAppDispatch();
  const [socialLoginPlatform, setSocialLoginPlatform] = React.useState<
    string | null
  >(null);

  const [
    socialLogin,
    socialLoginResponse,
    socialLoginError,
    isSocialLoginLoading,
  ] = useApi({
    url: URL.SOCIAL_LOGIN,
    method: 'POST',
    isSecureEntry: false,
  });

  useEffect(() => {
    const init = async () => {
      setTokens({
        accessToken: socialLoginResponse?.data?.accessToken,
        refreshToken: socialLoginResponse?.data?.refreshToken,
      });
      dispatch(setUserDetails(socialLoginResponse?.data?.user));
      await AsyncStorage.setItem(
        'userDetails',
        JSON.stringify(socialLoginResponse?.data?.user),
      );

      await Keychain.setGenericPassword(
        socialLoginResponse?.data?.user?.email || '',
        socialLoginResponse?.data?.user?.id || '',
      );
      if (socialLoginResponse?.data?.user?.isFirstLogin) {
        goToAccountCreatedScreen();
      } else {
        dispatch(setIsUserSignedIn(true));
      }
    };
    if (socialLoginResponse) {
      if (socialLoginResponse?.statusCode === 200) {
        if (socialLoginResponse?.data?.user?.userStatus === 'ACTIVE') {
          init();
        } else {
          setTokens({
            accessToken: socialLoginResponse?.data?.accessToken,
            refreshToken: socialLoginResponse?.data?.refreshToken,
          });
          dispatch(setIsSocialLogin(true));
          dispatch(setSocialLoginData(socialLoginResponse?.data));
          goToCreateAccountScreen();
        }
      }
    }
  }, [socialLoginResponse]);

  useEffect(() => {
    if (socialLoginError) {
      if (socialLoginError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: socialLoginError?.message,
        });
      }
    }
  }, [socialLoginError]);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '1065357527571-hjdcod2gn5c1l7kbam4qauh56ktcf41n.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Settings.initializeSDK();
    }
  }, []);

  const googleSignIn = async () => {
    try {
      setSocialLoginPlatform('GOOGLE');
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      let formdata = new FormData();
      formdata.append('platform', 'GOOGLE');
      formdata.append('google[idToken]', userInfo?.idToken);
      socialLogin(formdata);
    } catch (error) {
      console.log('Error while google signIn...', error);
    }
  };

  const facebookSignIn = async () => {
    try {
      setSocialLoginPlatform('FACEBOOK');
      const userInfo = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      if (!userInfo.isCancelled) {
        const token = await AccessToken.getCurrentAccessToken();
        if (token?.accessToken) {
          let formdata = new FormData();
          formdata.append('platform', 'FACEBOOK');
          formdata.append('facebook[accessToken]', token?.accessToken);
          socialLogin(formdata);
        }
      }
    } catch (error) {
      console.log('Error while facebook signIn...', error);
    }
  };

  const appleSignIn = async () => {
    try {
      setSocialLoginPlatform('APPLE');
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );
      if (credentialState === appleAuth.State.AUTHORIZED) {
        let formdata = new FormData();
        formdata.append('platform', 'APPLE');
        formdata.append(
          'apple[code]',
          appleAuthRequestResponse.authorizationCode,
        );
        socialLogin(formdata);
      }
    } catch (error) {
      console.log('Error while apple signIn...', error);
    }
  };

  return (
    <View>
      <View style={styles.container}>
        <View
          style={[styles.line, {borderColor: COLORS.SOCIAL_LOGIN_BORDER_COLOR}]}
        />
        <View style={{paddingHorizontal: 20}}>
          <Text
            style={[
              styles.label,
              {
                color: COLORS.SOCIAL_LOGIN_LABEL_COLOR,
                fontFamily: FONTS.MONTSERRAT.REGULAR,
              },
            ]}>
            or continue with
          </Text>
        </View>
        <View
          style={[styles.line, {borderColor: COLORS.SOCIAL_LOGIN_BORDER_COLOR}]}
        />
      </View>
      <View style={styles.row}>
        <Chip
          onPress={() => !isSocialLoginLoading && googleSignIn()}
          title={t(LOCALES.SIGNIN.GOOGLE)}
          parentStyle={{width: '48%'}}
          leftIcon={GOOGLE}
          customLabelStyle={{textAlign: 'center'}}
          rightIcon={
            isSocialLoginLoading && socialLoginPlatform === 'GOOGLE' ? (
              <ActivityIndicator />
            ) : null
          }
        />
        <Chip
          onPress={() => !isSocialLoginLoading && facebookSignIn()}
          title={t(LOCALES.SIGNIN.FACEBOOK)}
          parentStyle={{width: '48%'}}
          leftIcon={FACEBOOK}
          customLabelStyle={{textAlign: 'center'}}
          rightIcon={
            isSocialLoginLoading && socialLoginPlatform === 'FACEBOOK' ? (
              <ActivityIndicator />
            ) : null
          }
        />
      </View>
      <View style={{marginBottom: 24}} />
      <View style={styles.row}>
        {Platform.OS === 'ios' && (
          <Chip
            onPress={() => !isSocialLoginLoading && appleSignIn()}
            title={t(LOCALES.SIGNIN.APPLE)}
            parentStyle={{width: '48%'}}
            leftIcon={APPLE}
            customLabelStyle={{textAlign: 'center'}}
            rightIcon={
              isSocialLoginLoading && socialLoginPlatform === 'APPLE' ? (
                <ActivityIndicator />
              ) : null
            }
          />
        )}
        {/* <Chip
          title={t(LOCALES.SIGNIN.LINKEDIN)}
          parentStyle={{width: '48%'}}
          leftIcon={LINKEDIN}
          customLabelStyle={{textAlign: 'center'}}
        /> */}
      </View>
    </View>
  );
};

export default SocialLogin;

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  line: {
    borderWidth: 1,
    width: 44,
    height: 1,
  },
  label: {
    fontSize: responsiveFontSize(14),
  },
});
