import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import WrapperScreen from '../WrapperScreen';
import {NationalityInformationScreenProps} from '../../../../types/navigation/authTypes';
import {useTranslation} from 'react-i18next';
import LOCALES from '../../../../localization/constants';
import Picker from '../../../../components/Picker';
import useTheme from '../../../../theme/hooks/useTheme';
import CountryPickerModal from '../components/CountryPickerModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import {useAppDispatch, useAppSelector} from '../../../../store';
import {setSignUpUserData} from '../../../../store/slice/authSlice';

const NationalityInformation = ({
  navigation,
}: NationalityInformationScreenProps) => {
  const {t} = useTranslation();
  const [country, setCountry] = useState('');
  const {COLORS, FONTS} = useTheme();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const dispatch = useAppDispatch();
  const {signUpUserData} = useAppSelector(state => state.auth);

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

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const onCountrySelect = useCallback((item: any) => {
    setCountry(item.name);
    bottomSheetModalRef.current?.close();
  }, []);

  const onContinue = useCallback(() => {
    dispatch(
      setSignUpUserData({
        ...signUpUserData,
        nationality: country,
      }),
    );
    navigation.navigate('SetPassword');
  }, [signUpUserData, country]);

  return (
    <>
      <WrapperScreen
        title={t(LOCALES.SIGNUP.NATIONALITY_INFORMATION)}
        stepNumber={5}
        onBackPress={() => navigation.goBack()}
        disabled={!country}
        onContinue={onContinue}>
        <View style={{marginTop: 30, marginHorizontal: 20}}>
          <Text style={textStyles}>{t(LOCALES.SIGNUP.COUNTRY)}</Text>
          <Picker
            placeholder={t(LOCALES.SIGNUP.COUNTRY_PLACEHOLDER)}
            value={country}
            onPress={handlePresentModalPress}
          />
        </View>
      </WrapperScreen>
      <CountryPickerModal
        isNationalityScreen={true}
        bottomSheetModalRef={bottomSheetModalRef}
        onCountrySelect={onCountrySelect}
      />
    </>
  );
};

export default NationalityInformation;

const styles = StyleSheet.create({
  textField: {
    fontSize: responsiveFontSize(14),
    marginBottom: 10,
  },
});
