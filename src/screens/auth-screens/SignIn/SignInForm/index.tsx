import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';

import useTheme from '../../../../theme/hooks/useTheme';
import TextField from '../../../../components/TextField';
import Button from '../../../../components/Button';
import {EYE, EYE_HIDE} from '../../../../assets/icons/svg';
import LOCALES from '../../../../localization/constants';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import {REGEX} from '../../../../constants';

type SignInFormTypes = {
  onForgotPassword: () => void;
  onLogin: (userId: string, password: string) => void;
  loading?: boolean;
};

const SignInForm = ({
  onForgotPassword = () => {},
  onLogin = () => {},
  loading = false,
}: SignInFormTypes) => {
  const {COLORS, FONTS} = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const {t} = useTranslation();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View>
      <Text
        style={[
          styles.signIn,
          {
            color: COLORS.PRIMARY_TEXT_COLOR,
            fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
          },
        ]}>
        {t(LOCALES.SIGNIN.SIGNIN)}
      </Text>
      <Text
        style={[
          styles.signInDescription,
          {
            color: COLORS.SECONDARY_TEXT_COLOR,
            fontFamily: FONTS.MONTSERRAT.REGULAR,
          },
        ]}>
        {t(LOCALES.SIGNIN.SIGNIN_DESCRIPTION)}
      </Text>
      <View>
        <Text
          style={[
            styles.userName,
            {
              color: COLORS.SECONDARY_TEXT_COLOR,
              fontFamily: FONTS.MONTSERRAT.REGULAR,
            },
          ]}>
          {t(LOCALES.SIGNIN.USER_NAME)}
        </Text>
        <TextField
          placeholder={t(LOCALES.SIGNIN.USER_NAME_PLACEHOLDER)}
          value={userId}
          onChangeText={setUserId}
        />
        <Text
          style={[
            styles.password,
            {
              color: COLORS.SECONDARY_TEXT_COLOR,
              fontFamily: FONTS.MONTSERRAT.REGULAR,
            },
          ]}>
          {t(LOCALES.SIGNIN.PASSWORD)}
        </Text>
        <TextField
          placeholder={t(LOCALES.SIGNIN.PASSWORD_PLACEHOLDER)}
          rightIcon={showPassword ? <EYE_HIDE /> : <EYE />}
          onRightIconClick={() => setShowPassword(!showPassword)}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <Text
          onPress={onForgotPassword}
          style={[
            styles.forgotPassword,
            {
              color: COLORS.PRIMARY_TEXT_COLOR,
              fontFamily: FONTS.MONTSERRAT.REGULAR,
            },
          ]}>
          {t(LOCALES.SIGNIN.FORGOT_PASSWORD)}
        </Text>
        <Button
          title={t(LOCALES.SIGNIN.LOGIN)}
          containerStyle={{marginVertical: 30}}
          onPress={() => onLogin(userId, password)}
          disabled={!userId.trim() || !password.trim() || loading}
          loading={loading}
        />
      </View>
    </View>
  );
};

export default SignInForm;

const styles = StyleSheet.create({
  signIn: {
    fontSize: responsiveFontSize(26),
  },
  signInDescription: {
    fontSize: responsiveFontSize(16),
    marginTop: 17,
    marginBottom: 23,
  },
  userName: {
    fontSize: responsiveFontSize(14),
    marginBottom: 10,
  },
  password: {
    fontSize: responsiveFontSize(14),
    marginBottom: 10,
  },
  forgotPassword: {
    fontSize: responsiveFontSize(14),
    alignSelf: 'flex-end',
  },
});
