import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import WrapperScreen from '../WrapperScreen';
import {CreateAccountScreenProps} from '../../../../types/navigation/authTypes';
import TextField from '../../../../components/TextField';
import useTheme from '../../../../theme/hooks/useTheme';
import Check from '../../../../assets/icons/svg/Check';
import Wrong from '../../../../assets/icons/svg/Wrong';
import CheckBox from '../../../../components/CheckBox';
import LOCALES from '../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import {useDebounce} from '../../../../hooks/useDebounce';
import {useApi} from '../../../../hooks/useApi';
import {URL} from '../../../../constants/URLS';
import {useAppDispatch, useAppSelector} from '../../../../store';
import {setSignUpUserData} from '../../../../store/slice/authSlice';
import {REGEX} from '../../../../constants';
import {appAlert} from '../../../../components/appAlert';

const CreateAccount = ({navigation}: CreateAccountScreenProps) => {
  const {COLORS, FONTS} = useTheme();
  const [isChecked, setIsChecked] = useState(false);
  const {t} = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [isUserNameSearching, setIsUserNameSearching] = useState(false);
  const [isUserNameAvailable, setIsUserNameAvailable] = useState(false);
  const dispatch = useAppDispatch();
  const {signUpUserData, isSocialLogin, socialLoginData} = useAppSelector(
    state => state.auth,
  );

  const debouncedUserName = useDebounce(userName, 500);

  const textStyles = useMemo(
    () => [
      styles.textField,
      {
        color: COLORS.SECONDARY_TEXT_COLOR,
        fontFamily: FONTS.MONTSERRAT.REGULAR,
      },
    ],
    [FONTS, COLORS],
  );
  const textContainerStyle = useMemo(
    () => [
      {
        color: COLORS.PRIMARY_TEXT_COLOR,
        fontFamily: FONTS.MONTSERRAT.REGULAR,
        marginLeft: 18,
        fontSize: responsiveFontSize(12),
        lineHeight: 24,
      },
    ],
    [COLORS, FONTS],
  );
  const linkStyle: StyleProp<TextStyle> = useMemo(
    () => [
      {
        color: COLORS.SECONDARY_COLOR,
        textDecorationLine: 'underline',
      },
    ],
    [COLORS],
  );

  const [
    getUserNameAvailable,
    userNameAvailableResponse,
    userNameAvailableError,
  ] = useApi({
    url: URL.USERNAME_AVAILABLE + userName,
    method: 'GET',
    isSecureEntry: false,
  });

  useEffect(() => {
    if (userName.length >= 2 && debouncedUserName) {
      if (REGEX.USERNAME.test(userName)) {
        setIsUserNameSearching(true);
        getUserNameAvailable();
      } else {
        setIsUserNameSearching(false);
        setIsUserNameAvailable(false);
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: t(LOCALES.ERROR.LBL_USERNAME_ERROR),
        });
      }
    } else {
      setIsUserNameSearching(false);
    }
  }, [debouncedUserName]);

  useEffect(() => {
    if (userNameAvailableResponse) {
      if (userNameAvailableResponse?.statusCode === 200) {
        setIsUserNameSearching(false);
        setIsUserNameAvailable(
          userNameAvailableResponse?.data?.userNameAvailable,
        );
      }
    }
  }, [userNameAvailableResponse]);

  useEffect(() => {
    if (userNameAvailableError) {
      if (userNameAvailableError?.statusCode === 400) {
        setIsUserNameSearching(false);
        setIsUserNameAvailable(false);
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: userNameAvailableError?.message,
        });
      }
    }
  }, [userNameAvailableError]);

  const rightIcon = useCallback(() => {
    if (isUserNameSearching) {
      return <ActivityIndicator />;
    } else if (userName && isUserNameAvailable) {
      return <Check color={COLORS.COMPLETE_CHECK_ICON_COLOR} />;
    } else if (userName && !isUserNameAvailable) {
      return <Wrong />;
    } else return null;
  }, [isUserNameSearching, isUserNameAvailable, userName]);

  const onContinue = useCallback(() => {
    dispatch(
      setSignUpUserData({
        ...signUpUserData,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        userName: userName.trim(),
      }),
    );
    navigation.navigate('ContactInformation');
  }, [firstName, lastName, userName, signUpUserData]);

  useEffect(() => {
    if (isSocialLogin) {
      if (socialLoginData) {
        setFirstName(socialLoginData?.user?.firstName || '');
        setLastName(socialLoginData?.user?.lastName || '');
      }
    }
  }, [isSocialLogin, socialLoginData]);

  return (
    <WrapperScreen
      title={t(LOCALES.SIGNUP.CREATE_ACCOUNT)}
      stepNumber={1}
      onBackPress={() => navigation.goBack()}
      disabled={
        !isChecked ||
        !isUserNameAvailable ||
        !firstName.trim() ||
        !lastName.trim() ||
        !userName.trim() ||
        !REGEX.USERNAME.test(userName)
      }
      onContinue={onContinue}
      onLogin={() => navigation.navigate('SignIn')}>
      <View style={styles.container}>
        <Text style={textStyles}>{t(LOCALES.SIGNUP.FIRST_NAME)}</Text>
        <TextField
          placeholder={t(LOCALES.SIGNUP.FIRST_NAME_PLACEHOLDER)}
          parentStyle={{marginBottom: 20}}
          value={firstName}
          onChangeText={setFirstName}
        />
        <Text style={textStyles}>{t(LOCALES.SIGNUP.LAST_NAME)}</Text>
        <TextField
          placeholder={t(LOCALES.SIGNUP.LAST_NAME_PLACEHOLDER)}
          parentStyle={{marginBottom: 20}}
          value={lastName}
          onChangeText={setLastName}
        />
        <Text style={textStyles}>{t(LOCALES.SIGNUP.USER_NAME)}</Text>
        <TextField
          placeholder={t(LOCALES.SIGNUP.USER_NAME_PLACEHOLDER)}
          rightIcon={rightIcon}
          value={userName}
          onChangeText={setUserName}
          parentStyle={{marginBottom: 20}}
        />
        <View style={styles.checkbox}>
          <CheckBox value={isChecked} onChange={value => setIsChecked(value)} />
          <Text style={textContainerStyle}>
            {t(LOCALES.SIGNUP.LINKTEXT_1)}{' '}
            <Text style={linkStyle}>{t(LOCALES.SIGNUP.LINKTEXT_2)}</Text>{' '}
            {t(LOCALES.SIGNUP.LINKTEXT_3)}{' '}
            <Text style={linkStyle}>{t(LOCALES.SIGNUP.LINKTEXT_4)}</Text>
          </Text>
        </View>
      </View>
    </WrapperScreen>
  );
};

export default CreateAccount;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginHorizontal: 20,
  },
  textField: {
    fontSize: responsiveFontSize(14),
    marginBottom: 10,
  },
  checkbox: {flex: 1, flexDirection: 'row', marginBottom: 20},
});
