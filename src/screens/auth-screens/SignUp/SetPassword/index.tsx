import {Linking, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import WrapperScreen from '../WrapperScreen';
import {SetPasswordScreenProps} from '../../../../types/navigation/authTypes';
import {useTranslation} from 'react-i18next';
import LOCALES from '../../../../localization/constants';
import useTheme from '../../../../theme/hooks/useTheme';
import TextField from '../../../../components/TextField';
import {EYE, EYE_HIDE} from '../../../../assets/icons/svg';
import EmailConfirmationModal from '../../ForgotPassword/EmailConfirmationModal';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import {useAppSelector} from '../../../../store';
import {REGEX} from '../../../../constants';
import {useApi} from '../../../../hooks/useApi';
import {URL} from '../../../../constants/URLS';
import {appAlert} from '../../../../components/appAlert';
import {getParamsFromURL} from '../../../../utilities/functions';

const SetPassword = ({navigation}: SetPasswordScreenProps) => {
  const {t} = useTranslation();
  const {COLORS, FONTS} = useTheme();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const {signUpUserData, isSocialLogin} = useAppSelector(state => state.auth);

  const textStyles = useMemo(
    () => [
      styles.textField,
      {
        color: COLORS.SECONDARY_TEXT_COLOR,
        fontFamily: FONTS.MONTSERRAT.REGULAR,
      },
    ],
    [COLORS, FONTS],
  );

  const onContinue = useCallback(() => {
    const body = {
      userId: signUpUserData?.id,
      password: newPassword,
      gender: signUpUserData?.gender,
      dateOfBirth: signUpUserData?.dateOfBirth,
      nationality: signUpUserData?.nationality,
    };
    registerUser(body);
  }, [signUpUserData, newPassword]);

  const [sendEmail, sendEmailResponse, sendEmailError, isSendEmailLoading] =
    useApi({
      url: URL.SEND_EMAIL,
      method: 'POST',
      isSecureEntry: false,
    });

  const [
    registerUser,
    registerUserResponse,
    registerUserError,
    isRegisterUserLoading,
  ] = useApi({
    url: URL.REGISTER,
    method: 'POST',
    isSecureEntry: false,
  });

  useEffect(() => {
    if (registerUserResponse) {
      if (registerUserResponse?.statusCode === 200) {
        if (isSocialLogin) {
          navigation.navigate('SignIn');
          appAlert({
            title: t(LOCALES.SUCCESS.LBL_SUCCESS),
            message: 'Your social sign up has been done successfully.',
          });
        } else {
          const body = {
            email: signUpUserData?.email,
            userId: signUpUserData?.id,
          };
          sendEmail(body);
        }
      }
    }
  }, [registerUserResponse, signUpUserData, isSocialLogin]);

  useEffect(() => {
    if (registerUserError) {
      if (registerUserError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: registerUserError?.message,
        });
      }
    }
  }, [registerUserError]);

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
        navigation.navigate('SignIn');
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

  const onOpenMail = useCallback(() => {
    Linking.openURL('mailto://');
  }, []);

  useEffect(() => {
    if (sendEmailResponse) {
      if (sendEmailResponse?.statusCode === 200) {
        setShowModal(true);
      }
    }
  }, [sendEmailResponse]);

  useEffect(() => {
    if (sendEmailError) {
      if (sendEmailError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: sendEmailError?.message,
        });
      }
    }
  }, [sendEmailError]);

  const handleDynamicLink = (link: any) => {
    const params = getParamsFromURL(link?.url);
    if (params?.email && params?.token) {
      setShowModal(false);
      verifyEmail(
        null,
        `${URL.VERIFY_EMAIL}email=${params?.email}&token=${params?.token}`,
      );
    }
  };

  useEffect(() => {
    Linking.addEventListener('url', handleDynamicLink);
    return () => Linking.removeAllListeners('url');
  }, []);

  return (
    <>
      <WrapperScreen
        title={t(LOCALES.SIGNUP.SET_PASSWORD)}
        stepNumber={6}
        onBackPress={() => navigation.goBack()}
        disabled={
          !newPassword.trim() ||
          !confirmNewPassword.trim() ||
          !REGEX.PASSWORD.test(newPassword) ||
          !REGEX.PASSWORD.test(confirmNewPassword) ||
          !REGEX.SPECIAL_CHAR_ONLY.test(newPassword) ||
          !REGEX.AT_LEAST_ONE_CAP_LETTER.test(newPassword) ||
          !REGEX.AT_LEAST_ONE_NUMBER.test(newPassword) ||
          !REGEX.SPECIAL_CHAR_ONLY.test(confirmNewPassword) ||
          !REGEX.AT_LEAST_ONE_CAP_LETTER.test(confirmNewPassword) ||
          !REGEX.AT_LEAST_ONE_NUMBER.test(confirmNewPassword) ||
          !(newPassword.trim() === confirmNewPassword.trim()) ||
          isRegisterUserLoading ||
          isVerifyEmailLoading
        }
        loading={isRegisterUserLoading || isVerifyEmailLoading}
        onContinue={onContinue}>
        <View style={styles.container}>
          <Text style={textStyles}>{t(LOCALES.SIGNUP.NEW_PASSWORD)}</Text>
          <TextField
            placeholder={t(LOCALES.SIGNUP.NEW_PASSWORD_PLACEHOLDER)}
            rightIcon={showNewPassword ? <EYE_HIDE /> : <EYE />}
            onRightIconClick={() => setShowNewPassword(!showNewPassword)}
            secureTextEntry={!showNewPassword}
            value={newPassword}
            onChangeText={setNewPassword}
            parentStyle={{marginBottom: 20}}
          />
          <Text style={textStyles}>
            {t(LOCALES.SIGNUP.CONFIRM_NEW_PASSWORD)}
          </Text>
          <TextField
            placeholder={t(LOCALES.SIGNUP.CONFIRM_NEW_PASSWORD_PLACEHOLDER)}
            rightIcon={showConfirmNewPassword ? <EYE_HIDE /> : <EYE />}
            onRightIconClick={() =>
              setShowConfirmNewPassword(!showConfirmNewPassword)
            }
            secureTextEntry={!showConfirmNewPassword}
            parentStyle={{marginBottom: 20}}
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
          />
          <Text
            style={{
              fontSize: responsiveFontSize(12),
              fontFamily: FONTS.MONTSERRAT.REGULAR,
              color: COLORS.RESET_PASSWORD_DESCRIPTION_COLOR,
              marginBottom: 30,
            }}>
            {t(LOCALES.SIGNUP.SET_PASSWORD_TEXT)}
          </Text>
        </View>
      </WrapperScreen>
      <EmailConfirmationModal
        showModal={showModal}
        closeModal={() => {}}
        isForgotPasswordScreen={false}
        loading={isSendEmailLoading}
        onOpenMail={onOpenMail}
        onSkip={() => {
          setShowModal(false);
          navigation.navigate('SignIn');
        }}
      />
    </>
  );
};

export default SetPassword;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginHorizontal: 20,
  },
  textField: {
    fontSize: responsiveFontSize(14),
    marginBottom: 10,
  },
});
