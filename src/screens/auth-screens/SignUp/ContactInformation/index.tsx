import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import WrapperScreen from '../WrapperScreen';
import {ContactInformationScreenProps} from '../../../../types/navigation/authTypes';
import TextField from '../../../../components/TextField';
import useTheme from '../../../../theme/hooks/useTheme';
import DropdownArrowFill from '../../../../assets/icons/svg/DropdownArrowFill';
import LOCALES from '../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import CountryPickerModal from '../components/CountryPickerModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import VerifyPhoneNumber from '../components/VerifyPhoneNumber';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import {useAppDispatch, useAppSelector} from '../../../../store';
import {REGEX} from '../../../../constants';
import {setSignUpUserData} from '../../../../store/slice/authSlice';
import {URL} from '../../../../constants/URLS';
import {useApi} from '../../../../hooks/useApi';
import {appAlert} from '../../../../components/appAlert';
import axios from 'axios';
import * as RNLocalize from 'react-native-localize';

const ContactInformation = ({navigation}: ContactInformationScreenProps) => {
  const {COLORS, FONTS} = useTheme();
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const [countryCode, setCountryCode] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [showModal, setShowModal] = useState(false);
  const {signUpUserData, isSocialLogin, socialLoginData} = useAppSelector(
    state => state.auth,
  );

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

  const leftIcon = useCallback(() => {
    return (
      <Pressable
        style={styles.leftIconContainer}
        onPress={handlePresentModalPress}>
        {countryCode && (
          <Text
            style={{
              color: COLORS.PRIMARY_TEXT_COLOR,
              fontSize: responsiveFontSize(16),
              fontFamily: FONTS.MONTSERRAT.REGULAR,
            }}>
            {countryCode.includes('+') ? countryCode : '+' + countryCode}
          </Text>
        )}
        <View
          style={[
            styles.leftIcon,
            {borderRightColor: COLORS.SOCIAL_LOGIN_BORDER_COLOR},
          ]}>
          <DropdownArrowFill />
        </View>
      </Pressable>
    );
  }, [countryCode]);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const onCountrySelect = useCallback((item: any) => {
    setCountryCode(item.phoneCode);
    bottomSheetModalRef.current?.close();
  }, []);

  const onContinue = useCallback(() => {
    dispatch(
      setSignUpUserData({
        ...signUpUserData,
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
      }),
    );
    if (isSocialLogin) {
      const body = {
        phoneCode: countryCode.replace('+', ''),
        phoneNumber: phoneNumber.trim(),
      };
      sendOTP(body);
    } else {
      getEmailAvailable();
    }
  }, [email, phoneNumber, signUpUserData, isSocialLogin]);

  const [sendOTP, sendOTPResponse, sendOTPError, isSendOTPLoading] = useApi({
    url: URL.SEND_OTP,
    method: 'POST',
    isSecureEntry: false,
  });

  const [verifyOtp, verifyOtpResponse, verifyOtpError, isVerifyOtpLoading] =
    useApi({
      url: URL.VERIFY_OTP,
      method: 'POST',
      isSecureEntry: isSocialLogin,
    });

  useEffect(() => {
    if (sendOTPResponse) {
      if (sendOTPResponse?.statusCode === 200) {
        setShowModal(true);
      }
    }
  }, [sendOTPResponse]);

  useEffect(() => {
    if (sendOTPError) {
      if (sendOTPError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: sendOTPError?.message,
        });
      }
    }
  }, [sendOTPError]);

  useEffect(() => {
    if (verifyOtpResponse) {
      if (verifyOtpResponse?.statusCode === 200) {
        setShowModal(false);
        dispatch(
          setSignUpUserData({
            ...signUpUserData,
            ...verifyOtpResponse?.data?.user,
          }),
        );
        navigation.navigate('GenderInformation');
      }
    }
  }, [verifyOtpResponse]);

  useEffect(() => {
    if (verifyOtpError) {
      if (verifyOtpError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: verifyOtpError?.message,
        });
      }
    }
  }, [verifyOtpError]);

  const onResendAccessCode = useCallback(() => {
    const body = {
      phoneCode: countryCode.replace('+', ''),
      phoneNumber: phoneNumber,
    };
    sendOTP(body);
  }, [countryCode, phoneNumber]);

  const onVerifyOTP = useCallback(
    (otp: string) => {
      const body = {
        phoneCode: countryCode.replace('+', ''),
        phoneNumber: phoneNumber,
        firstName: signUpUserData?.firstName,
        lastName: signUpUserData?.lastName,
        userName: signUpUserData?.userName,
        otpText: otp,
      };
      verifyOtp(body);
    },
    [countryCode, phoneNumber, signUpUserData],
  );

  const [
    getEmailAvailable,
    emailAvailableResponse,
    emailAvailableError,
    isEmailAvailableLoading,
  ] = useApi({
    url: URL.EMAIL_AVAILABLE + email,
    method: 'GET',
    isSecureEntry: false,
  });

  useEffect(() => {
    if (emailAvailableResponse) {
      if (emailAvailableResponse?.statusCode === 200) {
        if (emailAvailableResponse?.data?.emailAvailable) {
          const body = {
            phoneCode: countryCode.replace('+', ''),
            phoneNumber: phoneNumber.trim(),
          };
          sendOTP(body);
        } else {
          appAlert({
            title: t(LOCALES.ERROR.LBL_ERROR),
            message: t(LOCALES.ERROR.LBL_EMAIL_ERROR),
          });
        }
      }
    }
  }, [emailAvailableResponse]);

  useEffect(() => {
    if (emailAvailableError) {
      if (emailAvailableError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: emailAvailableError?.message,
        });
      }
    }
  }, [emailAvailableError]);

  useEffect(() => {
    if (isSocialLogin) {
      if (socialLoginData) {
        setEmail(socialLoginData?.user?.email || '');
      }
    }
  }, [isSocialLogin, socialLoginData]);

  useEffect(() => {
    axios
      .get(URL.GET_COUNTRIES_LIST)
      .then(response => {
        const result = response.data;
        result?.map((item: any) => {
          if (item?.iso2Code === RNLocalize?.getLocales()[0]?.countryCode) {
            setCountryCode(item?.phoneCode);
          }
        });
      })
      .catch(error => {
        console.log('Error while getting countries list...', error);
      });
  }, []);

  return (
    <>
      <WrapperScreen
        title={t(LOCALES.SIGNUP.CONTACT_INFORMATION)}
        stepNumber={2}
        loading={isSendOTPLoading || isEmailAvailableLoading}
        disabled={
          !email.trim() ||
          !phoneNumber.trim() ||
          !countryCode.trim() ||
          !REGEX.EMAIL.test(email) ||
          !REGEX.PHONE.test(phoneNumber) ||
          isSendOTPLoading ||
          isEmailAvailableLoading
        }
        onBackPress={() => navigation.goBack()}
        onContinue={onContinue}
        onLogin={() => navigation.navigate('SignIn')}>
        <View style={styles.container}>
          <Text style={textStyles}>{t(LOCALES.SIGNUP.EMAIL)}</Text>
          <TextField
            editable={!isSocialLogin}
            placeholder={t(LOCALES.SIGNUP.EMAIL_PLACEHOLDER)}
            parentStyle={{marginBottom: 20}}
            value={email}
            onChangeText={setEmail}
          />
          <Text style={textStyles}>{t(LOCALES.SIGNUP.PHONE_NUMBER)}</Text>
          <TextField
            placeholder={t(LOCALES.SIGNUP.PHONE_NUMBER_PLACEHOLDER)}
            customLeftIconStyle={{marginRight: 15}}
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            leftIcon={leftIcon}
            parentStyle={{marginBottom: 20}}
          />
        </View>
      </WrapperScreen>
      <CountryPickerModal
        bottomSheetModalRef={bottomSheetModalRef}
        onCountrySelect={onCountrySelect}
      />
      <VerifyPhoneNumber
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        disabledResendAccessCode={isSendOTPLoading}
        disabledVerify={isVerifyOtpLoading}
        onVerify={onVerifyOTP}
        onResendAccessCode={onResendAccessCode}
      />
    </>
  );
};

export default ContactInformation;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginHorizontal: 20,
  },
  textField: {
    fontSize: responsiveFontSize(14),
    marginBottom: 10,
  },
  leftIconContainer: {flexDirection: 'row', alignItems: 'center'},
  leftIcon: {
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
  },
});
