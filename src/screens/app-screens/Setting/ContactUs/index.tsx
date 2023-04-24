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
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import useTheme from '../../../../theme/hooks/useTheme';
import LOCALES from '../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../../../components/Header';
import {ContactUsScreenProps} from '../../../../types/navigation/appTypes';
import TextField from '../../../../components/TextField';
import Button from '../../../../components/Button';
import {REGEX} from '../../../../constants';
import {useApi} from '../../../../hooks/useApi';
import {URL} from '../../../../constants/URLS';
import {appAlert} from '../../../../components/appAlert';

const ContactUs = ({navigation}: ContactUsScreenProps) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
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

  const [contactUs, contactUsResponse, contactUsError, isContactUsLoading] =
    useApi({
      url: URL.CONTACT_US,
      method: 'POST',
    });

  useEffect(() => {
    if (contactUsResponse) {
      if (contactUsResponse?.statusCode === 200) {
        appAlert({
          title: t(LOCALES.SUCCESS.LBL_SUCCESS),
          message: t(LOCALES.SUCCESS.LBL_CONTACT_US_SUCCESS),
        });
        navigation.goBack();
      }
    }
  }, [contactUsResponse]);

  useEffect(() => {
    if (contactUsError) {
      if (contactUsError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: contactUsError?.message,
        });
      }
    }
  }, [contactUsError]);

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
        title={t(LOCALES.SETTING.LBL_CONTACT_US)}
        onBackPress={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <Text style={titleStyle}>{t(LOCALES.SETTING.LBL_USER_NAME)}</Text>
            <TextField
              parentStyle={{marginBottom: 20}}
              value={name}
              onChangeText={setName}
            />
            <Text style={titleStyle}>{t(LOCALES.SETTING.LBL_EMAIL)}</Text>
            <TextField
              parentStyle={{marginBottom: 20}}
              value={email}
              onChangeText={setEmail}
            />
            <Text style={titleStyle}>{t(LOCALES.SETTING.LBL_MESSAGE)}</Text>
            <TextField
              containerStyle={{height: 145, paddingVertical: 10}}
              textInputStyle={{height: '100%'}}
              multiline={true}
              value={message}
              onChangeText={setMessage}
            />
            <Button
              title={t(LOCALES.SETTING.LBL_SUBMIT)}
              onPress={() => {
                const data = {
                  username: name,
                  email: email,
                  message: message,
                };
                contactUs(data);
              }}
              disabled={
                name.trim().length === 0 ||
                email.trim().length === 0 ||
                message.trim().length === 0 ||
                !REGEX.EMAIL.test(email) ||
                isContactUsLoading
              }
              loading={isContactUsLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ContactUs;

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
