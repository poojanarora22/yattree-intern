import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import useTheme from '../../../../theme/hooks/useTheme';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../../../components/Header';
import LOCALES from '../../../../localization/constants';
import {ChangePasswordScreenProps} from '../../../../types/navigation/appTypes';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import TextField from '../../../../components/TextField';
import {EYE, EYE_HIDE} from '../../../../assets/icons/svg';
import Button from '../../../../components/Button';
import {REGEX} from '../../../../constants';
import {useApi} from '../../../../hooks/useApi';
import {URL} from '../../../../constants/URLS';
import {appAlert} from '../../../../components/appAlert';

const ChangePassword = ({navigation}: ChangePasswordScreenProps) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();
  const titleStyle = useMemo(
    () => [
      [
        styles.title,
        {
          color: COLORS.SECONDARY_TEXT_COLOR,
          fontFamily: FONTS.MONTSERRAT.REGULAR,
        },
      ],
    ],
    [],
  );
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [
    resetPassword,
    resetPasswordResponse,
    resetPasswordError,
    isResetPasswordLoading,
  ] = useApi({
    url: URL.CHANGE_PASSWORD,
    method: 'PUT',
  });

  useEffect(() => {
    if (resetPasswordResponse) {
      if (resetPasswordResponse?.statusCode === 200) {
        appAlert({
          title: t(LOCALES.SUCCESS.LBL_SUCCESS),
          message: t(LOCALES.SUCCESS.LBL_RESET_PASSWORD),
        });
        navigation.goBack();
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

  const onChangePassword = () => {
    const data = {
      password: oldPassword,
      newPassword: newPassword,
      confirmPassword: confirmNewPassword,
    };
    resetPassword(data);
  };

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
      <Header
        title={t(LOCALES.SETTING.LBL_CHANGE_PASSWORD)}
        onBackPress={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            {/* <Text
              style={{
                color: COLORS.SECONDARY_TEXT_COLOR,
                fontSize: responsiveFontSize(14),
                fontFamily: FONTS.MONTSERRAT.MEDIUM,
                textAlign: 'center',
                marginBottom: 30,
              }}>
              {t(LOCALES.SETTING.LBL_PASSWORD_MUST_BE_DIFFERENT)}
            </Text> */}
            <Text style={titleStyle}>
              {t(LOCALES.SETTING.LBL_OLD_PASSWORD)}
            </Text>
            <TextField
              editable={!isResetPasswordLoading}
              rightIcon={showOldPassword ? <EYE_HIDE /> : <EYE />}
              onRightIconClick={() => setShowOldPassword(!showOldPassword)}
              secureTextEntry={!showOldPassword}
              value={oldPassword}
              onChangeText={setOldPassword}
            />
            <Text style={titleStyle}>
              {t(LOCALES.SETTING.LBL_NEW_PASSWORD)}
            </Text>
            <TextField
              editable={!isResetPasswordLoading}
              rightIcon={showNewPassword ? <EYE_HIDE /> : <EYE />}
              onRightIconClick={() => setShowNewPassword(!showNewPassword)}
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <Text style={titleStyle}>
              {t(LOCALES.SETTING.LBL_CONFIRM_NEW_PASSWORD)}
            </Text>
            <TextField
              editable={!isResetPasswordLoading}
              rightIcon={showConfirmNewPassword ? <EYE_HIDE /> : <EYE />}
              onRightIconClick={() =>
                setShowConfirmNewPassword(!showConfirmNewPassword)
              }
              secureTextEntry={!showConfirmNewPassword}
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
            />
            <Button
              title={t(LOCALES.SETTING.LBL_CHANGE_PASSWORD)}
              disabled={
                !oldPassword.trim() ||
                !newPassword.trim() ||
                !confirmNewPassword.trim() ||
                !REGEX.PASSWORD.test(oldPassword) ||
                !REGEX.PASSWORD.test(newPassword) ||
                !REGEX.PASSWORD.test(confirmNewPassword) ||
                !(newPassword.trim() === confirmNewPassword.trim()) ||
                isResetPasswordLoading
              }
              loading={isResetPasswordLoading}
              onPress={onChangePassword}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginHorizontal: 20,
  },
  title: {
    fontSize: responsiveFontSize(14),
    marginBottom: 10,
  },
});
