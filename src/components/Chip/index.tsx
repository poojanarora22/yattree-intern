import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import useTheme from '../../theme/hooks/useTheme';
import {ChipType} from '../../types/components/Chip';
import {responsiveFontSize} from '../../theme/responsiveFontSize';

const Chip = ({
  leftIcon,
  rightIcon,
  containerStyle = {},
  parentStyle = {},
  customLabelStyle = {},
  onLeftIconClick = () => {},
  onRightIconClick = () => {},
  customLeftIconStyle = {},
  customRightIconStyle = {},
  title,
  onPress = () => {},
  isSelected = false,
}: ChipType) => {
  const [isChipSelected, setIsChipSelected] = useState(isSelected);
  const {COLORS, FONTS} = useTheme();

  useEffect(() => {
    setIsChipSelected(isSelected);
  }, [isSelected]);

  const getInputStyle = useCallback(() => {
    if (isChipSelected) {
      return [
        styles.outlinedChip,
        {
          backgroundColor: COLORS.PRIMARY_CHIP_COLOR,
          borderColor: COLORS.CHIP_ACTIVE_BORDER_COLOR,
        },
        containerStyle,
      ];
    } else {
      return [
        styles.fillChip,
        {
          backgroundColor: COLORS.PRIMARY_CHIP_COLOR,
          borderColor: COLORS.CHIP_INACTIVE_BORDER_COLOR,
        },
        containerStyle,
      ];
    }
  }, [isChipSelected]);

  return (
    <Pressable style={[styles.container, parentStyle]} onPress={onPress}>
      <View style={getInputStyle()}>
        {leftIcon ? (
          <Pressable style={customLeftIconStyle} onPress={onLeftIconClick}>
            {leftIcon}
          </Pressable>
        ) : null}

        <Text
          style={[
            styles.text,
            {
              fontFamily: FONTS.MONTSERRAT.REGULAR,
              color: COLORS.CHIP_TEXT_COLOR,
            },
            customLabelStyle,
          ]}>
          {title}
        </Text>

        {rightIcon ? (
          <Pressable style={customRightIconStyle} onPress={onRightIconClick}>
            {rightIcon}
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
};

export default Chip;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 13,
  },
  fillChip: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
    paddingHorizontal: 15,
    borderWidth: 1,
  },
  outlinedChip: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
    paddingHorizontal: 15,
    borderWidth: 1,
  },
  text: {
    flex: 1,
    fontSize: responsiveFontSize(14),
    justifyContent: 'center',
  },
});
