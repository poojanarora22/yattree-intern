import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

import Header from '../../../components/Header';
import {ForgotPasswordScreenProps} from '../../../types/navigation/authTypes';
import useTheme from '../../../theme/hooks/useTheme';
import {LOCK} from '../../../assets/icons/svg';
import TextField from '../../../components/TextField';
import Button from '../../../components/Button';
import LOCALES from '../../../localization/constants';
import {useTranslation} from 'react-i18next';
import EmailConfirmationModal from './EmailConfirmationModal';
import {responsiveFontSize} from '../../../theme/responsiveFontSize';
import {useApi} from '../../../hooks/useApi';
import {appAlert} from '../../../components/appAlert';
import {URL} from '../../../constants/URLS';
import {REGEX} from '../../../constants';
import {getParamsFromURL} from '../../../utilities/functions';

const ForgotPassword = ({navigation}: ForgotPasswordScreenProps) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');

  const [
    forgotPassword,
    forgotPasswordResponse,
    forgotPasswordError,
    isForgotPasswordLoading,
  ] = useApi({
    url: URL.FORGOT_PASSWORD,
    method: 'POST',
    isSecureEntry: false,
  });

  useEffect(() => {
    if (forgotPasswordResponse) {
      if (forgotPasswordResponse?.statusCode === 200) {
        setShowModal(true);
      }
    }
  }, [forgotPasswordResponse]);

  useEffect(() => {
    if (forgotPasswordError) {
      if (forgotPasswordError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: forgotPasswordError?.message,
        });
      }
    }
  }, [forgotPasswordError]);

  const onOpenMail = useCallback(() => {
    Linking.openURL('mailto://');
  }, []);

  const handleDynamicLink = (link: any) => {
    const params = getParamsFromURL(link?.url);
    if (params?.email && params?.token) {
      setShowModal(false);
      navigation.navigate('ResetPassword', {
        email: params.email,
        token: params.token,
      });
    }
  };

  useEffect(() => {
    Linking.addEventListener('url', handleDynamicLink);
    return () => Linking.removeAllListeners('url');
  }, []);

  return (
    <>
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
            title={t(LOCALES.FORGOT_PASSWORD.TITLE)}
            onBackPress={() => navigation.goBack()}
          />
          <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
            <View style={styles.container}>
              <LOCK alignSelf="center" />
              <Text
                style={[
                  styles.description,
                  {
                    color: COLORS.PRIMARY_TEXT_COLOR,
                    fontFamily: FONTS.MONTSERRAT.REGULAR,
                  },
                ]}>
                {t(LOCALES.FORGOT_PASSWORD.DESCRIPTION)}
              </Text>
              <View style={{marginTop: '20%', marginBottom: '10%'}}>
                <Text
                  style={[
                    styles.email,
                    {
                      color: COLORS.SECONDARY_TEXT_COLOR,
                      fontFamily: FONTS.MONTSERRAT.REGULAR,
                    },
                  ]}>
                  {t(LOCALES.FORGOT_PASSWORD.EMAIL)}
                </Text>
                <TextField
                  placeholder={t(LOCALES.FORGOT_PASSWORD.EMAIL_PLACEHOLDER)}
                  value={email}
                  onChangeText={setEmail}
                />
                <Button
                  title={t(LOCALES.FORGOT_PASSWORD.BUTTON_TEXT)}
                  disabled={
                    !email.trim() ||
                    !REGEX.EMAIL.test(email) ||
                    isForgotPasswordLoading
                  }
                  loading={isForgotPasswordLoading}
                  onPress={() => {
                    const body = {
                      email: email,
                    };
                    forgotPassword(body);
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <EmailConfirmationModal
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        isForgotPasswordScreen={true}
        onOpenMail={onOpenMail}
        onSkip={() => {
          setShowModal(false);
          navigation.goBack();
        }}
      />
    </>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    marginTop: '20%',
    marginHorizontal: 20,
  },
  description: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: responsiveFontSize(14),
  },
  email: {
    fontSize: responsiveFontSize(14),
    marginBottom: 10,
  },
});
