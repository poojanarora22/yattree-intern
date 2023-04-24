import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import WrapperScreen from '../WrapperScreen';
import {GenderInformationScreenProps} from '../../../../types/navigation/authTypes';
import Chip from '../../../../components/Chip';
import {FEMALE, MALE, OTHER_GENDER} from '../../../../assets/icons/svg';
import Check from '../../../../assets/icons/svg/Check';
import useTheme from '../../../../theme/hooks/useTheme';
import LOCALES from '../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '../../../../store';
import {setSignUpUserData} from '../../../../store/slice/authSlice';

const GenderInformation = ({navigation}: GenderInformationScreenProps) => {
  const {t} = useTranslation();
  const DATA = useMemo(
    () => [
      {
        id: 0,
        title: t(LOCALES.SIGNUP.MALE),
        icon: <MALE />,
        isSelected: true,
        value: 'MALE',
      },
      {
        id: 1,
        title: t(LOCALES.SIGNUP.FEMALE),
        icon: <FEMALE />,
        isSelected: false,
        value: 'FEMALE',
      },
      {
        id: 2,
        title: t(LOCALES.SIGNUP.OTHER),
        icon: <OTHER_GENDER />,
        isSelected: false,
        value: 'OTHER',
      },
    ],
    [],
  );
  const {signUpUserData} = useAppSelector(state => state.auth);
  const {COLORS, FONTS} = useTheme();
  const [chipData, setChipData] = useState(DATA);
  const dispatch = useAppDispatch();

  const leftIcon = useCallback((data: any) => {
    return (
      <View
        style={[
          styles.chipLeftIcon,
          {
            backgroundColor: data.isSelected
              ? COLORS.SECONDARY_COLOR
              : COLORS.PRIMARY_COLOR,
          },
        ]}>
        {data.icon}
      </View>
    );
  }, []);

  const handleChipPress = useCallback((id: number) => {
    const arr = chipData.map(item => {
      if (item.id === id) {
        item.isSelected = true;
      } else {
        item.isSelected = false;
      }
      return item;
    });
    setChipData(arr);
  }, []);

  const onContinue = useCallback(() => {
    const result = chipData.find(item => item.isSelected);
    dispatch(
      setSignUpUserData({
        ...signUpUserData,
        gender: result?.value,
      }),
    );
    navigation.navigate('BirthDateInformation');
  }, [signUpUserData, chipData]);

  return (
    <WrapperScreen
      title={t(LOCALES.SIGNUP.GENDER_INFORMATION)}
      stepNumber={3}
      onBackPress={() => navigation.goBack()}
      onContinue={onContinue}>
      <View style={{margin: 30}}>
        {chipData.map(data => (
          <Chip
            onPress={() => handleChipPress(data.id)}
            key={data.id}
            isSelected={data.isSelected}
            title={data.title}
            customLabelStyle={{fontFamily: FONTS.MONTSERRAT.MEDIUM}}
            containerStyle={styles.chipContainer}
            leftIcon={() => leftIcon(data)}
            onLeftIconClick={() => handleChipPress(data.id)}
            rightIcon={data.isSelected ? <Check /> : null}
            customRightIconStyle={styles.chipRightIcon}
          />
        ))}
      </View>
    </WrapperScreen>
  );
};

export default GenderInformation;

const styles = StyleSheet.create({
  chipContainer: {
    borderRadius: 59,
    height: 86,
    marginBottom: 30,
  },
  chipLeftIcon: {
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 26,
  },
  chipRightIcon: {marginRight: 15},
});
