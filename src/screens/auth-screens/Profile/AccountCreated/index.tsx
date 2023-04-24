import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import useTheme from '../../../../theme/hooks/useTheme';
import {APP_LOGO, CREAT_PROFILE} from '../../../../assets/images';
import Button from '../../../../components/Button';
import LOCALES from '../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {AccountCreatedScreenProps} from '../../../../types/navigation/authTypes';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import {useAppSelector} from '../../../../store';
import {useApi} from '../../../../hooks/useApi';
import {URL} from '../../../../constants/URLS';
import {appAlert} from '../../../../components/appAlert';

const AccountCreated = ({navigation}: AccountCreatedScreenProps) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();
  const {userDetails} = useAppSelector(state => state.auth);

  const [
    updateFirstLogin,
    updateFirstLoginResponse,
    updateFirstLoginError,
    isUpdateFirstLoginLoading,
  ] = useApi({
    url: URL.UPDATE_FIRST_LOGIN,
    method: 'PUT',
  });

  useEffect(() => {
    if (updateFirstLoginResponse) {
      if (updateFirstLoginResponse?.statusCode === 200) {
        navigation.navigate('UploadPhoto');
      }
    }
  }, [updateFirstLoginResponse]);

  useEffect(() => {
    if (updateFirstLoginError) {
      if (updateFirstLoginError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: updateFirstLoginError?.message,
        });
      }
    }
  }, [updateFirstLoginError]);

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContainer}>
        <View style={{flex: 1, justifyContent: 'flex-start'}}>
          <View style={styles.imageContainer}>
            <Text
              style={[
                styles.welcomeText,
                {
                  color: COLORS.PRIMARY_TEXT_COLOR,
                  fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                },
              ]}>
              {t(LOCALES.PROFILE.WELCOME)}
            </Text>
            <Image source={APP_LOGO} style={styles.image} />
          </View>
          <Image source={CREAT_PROFILE} style={styles.profileImage} />
          <View style={{marginTop: 60}}>
            <Text
              style={[
                styles.title,
                {
                  fontFamily: FONTS.MONTSERRAT.REGULAR,
                  color: COLORS.PRIMARY_TEXT_COLOR,
                },
              ]}>
              {userDetails?.firstName} {userDetails?.lastName}
            </Text>
            <Text
              style={[
                styles.description,
                {
                  fontFamily: FONTS.MONTSERRAT.REGULAR,
                  color: COLORS.PROFILE_TEXT_COLOR,
                },
              ]}>
              {t(LOCALES.PROFILE.DESCRIPTION_1)}
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title={t(LOCALES.PROFILE.CREATE_PROFILE)}
            onPress={() => {
              const data = {
                isFirstLogin: false,
              };
              updateFirstLogin(data);
            }}
            disabled={isUpdateFirstLoginLoading}
            loading={isUpdateFirstLoginLoading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountCreated;

const styles = StyleSheet.create({
  imageContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: '18%',
  },
  image: {
    height: 40,
    width: 220,
    resizeMode: 'contain',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 20,
    marginTop: 50,
  },
  title: {
    alignSelf: 'center',
    marginBottom: 5,
    fontSize: responsiveFontSize(14),
  },
  description: {
    fontSize: responsiveFontSize(14),
    alignSelf: 'center',
    lineHeight: 22,
    textAlign: 'center',
  },
  profileImage: {
    alignSelf: 'center',
    marginTop: '18%',
    height: 260,
    width: '100%',
    resizeMode: 'center',
  },
  welcomeText: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(18),
    marginBottom: 10,
  },
});
