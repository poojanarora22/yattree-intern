import {Image, Keyboard, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useMemo, useState} from 'react';
import WrapperScreen from '../WrapperScreen';
import {USER_PROFILE} from '../../../../assets/images';
import useTheme from '../../../../theme/hooks/useTheme';
import LOCALES from '../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {BioScreenProps} from '../../../../types/navigation/authTypes';
import TextField from '../../../../components/TextField';
import {useAppDispatch, useAppSelector} from '../../../../store';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import {setProfileSetupUserData} from '../../../../store/slice/authSlice';

const Bio = ({navigation}: BioScreenProps) => {
  const {COLORS, FONTS} = useTheme();
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {profileSetupUserData} = useAppSelector(state => state.auth);
  const {profilePicture} = useAppSelector(state => state.profile);
  const {userDetails} = useAppSelector(state => state.auth);
  const [bio, setBio] = useState('');

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
  return (
    <WrapperScreen
      onContinue={() => {
        dispatch(
          setProfileSetupUserData({
            ...profileSetupUserData,
            bio: bio,
          }),
        );
        navigation.navigate('EnableLocation');
      }}
      onSkip={() => navigation.navigate('EnableLocation')}
      disabled={!bio.trim()}>
      <Pressable style={styles.container} onPress={() => Keyboard.dismiss()}>
        <Image
          source={profilePicture ? {uri: profilePicture} : USER_PROFILE}
          style={styles.image}
        />
        <View style={styles.labelContainer}>
          <Text
            style={[
              styles.label,
              {
                color: COLORS.PRIMARY_TEXT_COLOR,
                fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
              },
            ]}>
            {t(LOCALES.PROFILE.GREETING_TEXT)} {userDetails?.firstName}{' '}
            {userDetails?.lastName}!
          </Text>
          <Text
            style={[
              styles.label,
              {
                marginTop: 8,
                color: COLORS.PROFILE_TEXT_COLOR,
                fontFamily: FONTS.MONTSERRAT.REGULAR,
              },
            ]}>
            {t(LOCALES.PROFILE.DESCRIPTION_8)}
          </Text>
        </View>
        <View style={{marginHorizontal: 20}}>
          <Text style={textStyles}>{t(LOCALES.PROFILE.BIO)}</Text>
          <TextField
            containerStyle={{height: 145, paddingVertical: 10}}
            textInputStyle={{height: '100%'}}
            multiline={true}
            value={bio}
            onChangeText={setBio}
          />
        </View>
      </Pressable>
    </WrapperScreen>
  );
};

export default Bio;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContainer: {marginTop: 20},
  label: {
    textAlign: 'center',
    fontSize: responsiveFontSize(14),
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 50,
    // resizeMode: 'contain',
  },
  textField: {
    marginTop: 30,
    fontSize: responsiveFontSize(14),
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
});
