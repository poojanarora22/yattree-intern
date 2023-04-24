import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Geolocation from '@react-native-community/geolocation';
import {EnableLocationScreenProps} from '../../../../types/navigation/authTypes';
import WrapperScreen from '../WrapperScreen';
import {MAP} from '../../../../assets/images';
import useTheme from '../../../../theme/hooks/useTheme';
import LOCALES from '../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import {setProfileSetupUserData} from '../../../../store/slice/authSlice';
import {useAppDispatch, useAppSelector} from '../../../../store';
import {appAlert} from '../../../../components/appAlert';

const EnableLocation = ({navigation}: EnableLocationScreenProps) => {
  const {COLORS, FONTS} = useTheme();
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {profileSetupUserData} = useAppSelector(state => state.auth);

  return (
    <WrapperScreen
      isLocationScreen={true}
      onContinue={() => {
        Geolocation.getCurrentPosition(
          info => {
            dispatch(
              setProfileSetupUserData({
                ...profileSetupUserData,
                latitude: info?.coords?.latitude,
                longitude: info?.coords?.longitude,
              }),
            );
            navigation.navigate('Interests');
          },
          error => {
            appAlert({
              title: t(LOCALES.ERROR.LBL_ERROR),
              message: error?.message,
            });
            console.log('Error while getting location...', error);
          },
          {timeout: 20000},
        );
      }}
      onSkip={() => navigation.navigate('Interests')}>
      <View style={styles.container}>
        <Image source={MAP} style={styles.image} />
        <View style={styles.labelContainer}>
          <Text
            style={[
              styles.label,
              {
                color: COLORS.PRIMARY_TEXT_COLOR,
                fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                fontSize: responsiveFontSize(16),
              },
            ]}>
            {t(LOCALES.PROFILE.DESCRIPTION_10)}
          </Text>
          <Text
            style={[
              styles.label,
              {
                marginTop: 8,
                color: COLORS.PROFILE_TEXT_COLOR,
                fontFamily: FONTS.MONTSERRAT.REGULAR,
                marginBottom: 30,
              },
            ]}>
            {t(LOCALES.PROFILE.DESCRIPTION_11)}
          </Text>
        </View>
      </View>
    </WrapperScreen>
  );
};

export default EnableLocation;

const styles = StyleSheet.create({
  container: {
    marginTop: -20,
  },
  labelContainer: {marginTop: 20},
  label: {
    textAlign: 'center',
    fontSize: responsiveFontSize(14),
  },
  image: {
    width: '100%',
    height: 420,
    resizeMode: 'contain',
  },
});
