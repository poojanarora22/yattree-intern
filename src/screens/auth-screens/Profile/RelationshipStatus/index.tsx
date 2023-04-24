import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import WrapperScreen from '../WrapperScreen';
import {COMMITTED_ICON, SINGLE_ICON} from '../../../../assets/icons/svg';
import Check from '../../../../assets/icons/svg/Check';
import {useTranslation} from 'react-i18next';
import LOCALES from '../../../../localization/constants';
import useTheme from '../../../../theme/hooks/useTheme';
import Chip from '../../../../components/Chip';
import {RelationshipStatusScreenProps} from '../../../../types/navigation/authTypes';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';

const RelationshipStatus = ({navigation}: RelationshipStatusScreenProps) => {
  const {t} = useTranslation();
  const DATA = useMemo(
    () => [
      {
        id: 0,
        title: t(LOCALES.PROFILE.SINGLE),
        icon: <SINGLE_ICON />,
        isSelected: true,
      },
      {
        id: 1,
        title: t(LOCALES.PROFILE.COMMITTED),
        icon: <COMMITTED_ICON />,
        isSelected: false,
      },
    ],
    [],
  );
  const {COLORS, FONTS} = useTheme();
  const [chipData, setChipData] = useState(DATA);

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

  return (
    <WrapperScreen onContinue={() => navigation.navigate('EnableLocation')}>
      <View style={{margin: 30}}>
        <Text
          style={[
            styles.label,
            {
              fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
              color: COLORS.PRIMARY_TEXT_COLOR,
            },
          ]}>
          {t(LOCALES.PROFILE.DESCRIPTION_9)}
        </Text>
        {chipData.map(data => (
          <Chip
            onPress={() => handleChipPress(data.id)}
            key={data.id}
            isSelected={data.isSelected}
            title={data.title}
            customLabelStyle={{fontFamily: FONTS.MONTSERRAT.MEDIUM}}
            containerStyle={styles.chipContainer}
            leftIcon={() => leftIcon(data)}
            rightIcon={data.isSelected ? <Check /> : null}
            customRightIconStyle={styles.chipRightIcon}
          />
        ))}
      </View>
    </WrapperScreen>
  );
};

export default RelationshipStatus;

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
  label: {
    alignSelf: 'center',
    marginBottom: 30,
    fontSize: responsiveFontSize(16),
  },
});
