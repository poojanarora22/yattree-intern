import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../components/Header';
import useTheme from '../../../theme/hooks/useTheme';
import {useTranslation} from 'react-i18next';
import {ResetPasswordScreenProps} from '../../../types/navigation/authTypes';
import LOCALES from '../../../localization/constants';
import TextField from '../../../components/TextField';
import Button from '../../../components/Button';
import {EYE, EYE_HIDE} from '../../../assets/icons/svg';
import {responsiveFontSize} from '../../../theme/responsiveFontSize';
import {useApi} from '../../../hooks/useApi';
import {URL} from '../../../constants/URLS';
import {appAlert} from '../../../components/appAlert';
import {REGEX} from '../../../constants';

const ResetPassword = ({navigation, route}: ResetPasswordScreenProps) => {
  const {token, email} = route.params;
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [
    resetPassword,
    resetPasswordResponse,
    resetPasswordError,
    isResetPasswordLoading,
  ] = useApi({
    url: URL.RESET_PASSWORD,
    method: 'POST',
    isSecureEntry: false,
  });

  useEffect(() => {
    if (resetPasswordResponse) {
      if (resetPasswordResponse?.statusCode === 200) {
        appAlert({
          title: t(LOCALES.SUCCESS.LBL_SUCCESS),
          message: t(LOCALES.SUCCESS.LBL_RESET_PASSWORD),
        });
        navigation.navigate('SignIn');
      }
    }
  }, [resetPasswordResponse]);

  useEffect(() => {
    if (resetPasswordError) {
      if (resetPasswordError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: resetPasswordError?.message,
        });
      }
    }
  }, [resetPasswordError]);

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
        <Header
          title={t(LOCALES.RESET_PASSWORD.TITLE)}
          onBackPress={() => navigation.navigate('SignIn')}
        />
        <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
          {/* <Text
            style={[
              styles.description,
              {
                color: COLORS.RESET_PASSWORD_DESCRIPTION_COLOR,
                fontFamily: FONTS.MONTSERRAT.MEDIUM,
              },
            ]}>
            {t(LOCALES.RESET_PASSWORD.DESCRIPTION)}
          </Text> */}
          <View style={{marginHorizontal: 20, marginTop: 30}}>
            <Text
              style={[
                styles.password,
                {
                  color: COLORS.SECONDARY_TEXT_COLOR,
                  fontFamily: FONTS.MONTSERRAT.REGULAR,
                },
              ]}>
              {t(LOCALES.RESET_PASSWORD.NEW_PASSWORD)}
            </Text>
            <TextField
              placeholder={t(LOCALES.RESET_PASSWORD.NEW_PASSWORD_PLACEHOLDER)}
              rightIcon={showNewPassword ? <EYE_HIDE /> : <EYE />}
              onRightIconClick={() => setShowNewPassword(!showNewPassword)}
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <Text
              style={[
                styles.password,
                {
                  color: COLORS.SECONDARY_TEXT_COLOR,
                  fontFamily: FONTS.MONTSERRAT.REGULAR,
                },
              ]}>
              {t(LOCALES.RESET_PASSWORD.CONFIRM_NEW_PASSWORD)}
            </Text>
            <TextField
              placeholder={t(
                LOCALES.RESET_PASSWORD.CONFIRM_NEW_PASSWORD_PLACEHOLDER,
              )}
              rightIcon={showConfirmNewPassword ? <EYE_HIDE /> : <EYE />}
              onRightIconClick={() =>
                setShowConfirmNewPassword(!showConfirmNewPassword)
              }
              secureTextEntry={!showConfirmNewPassword}
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
            />
            <Button
              title={t(LOCALES.RESET_PASSWORD.BUTTON_TEXT)}
              onPress={() => {
                const body = {
                  token: token,
                  email: email,
                  newPassword: newPassword,
                  confirmPassword: confirmNewPassword,
                };
                resetPassword(body);
              }}
              disabled={
                !newPassword.trim() ||
                !confirmNewPassword.trim() ||
                !REGEX.PASSWORD.test(newPassword) ||
                !REGEX.PASSWORD.test(confirmNewPassword) ||
                !(newPassword.trim() === confirmNewPassword.trim()) ||
                !REGEX.SPECIAL_CHAR_ONLY.test(newPassword) ||
                !REGEX.AT_LEAST_ONE_CAP_LETTER.test(newPassword) ||
                !REGEX.AT_LEAST_ONE_NUMBER.test(newPassword) ||
                !REGEX.SPECIAL_CHAR_ONLY.test(confirmNewPassword) ||
                !REGEX.AT_LEAST_ONE_CAP_LETTER.test(confirmNewPassword) ||
                !REGEX.AT_LEAST_ONE_NUMBER.test(confirmNewPassword) ||
                isResetPasswordLoading
              }
              loading={isResetPasswordLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  password: {
    fontSize: responsiveFontSize(14),
    marginBottom: 10,
  },
  description: {
    marginVertical: 30,
    fontSize: responsiveFontSize(14),
    textAlign: 'center',
  },
});
