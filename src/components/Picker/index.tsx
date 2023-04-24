import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import useTheme from '../../theme/hooks/useTheme';
import {PickerType} from '../../types/components/Picker';
import PICKER_ICON from '../../assets/icons/svg/DropdownArrow';
import {responsiveFontSize} from '../../theme/responsiveFontSize';

const Picker = ({
  containerStyle = {},
  parentStyle = {},
  customLabelStyle = {},
  value = null,
  placeholder = '',
  onRightIconClick = () => {},
  onPress = () => {},
}: PickerType) => {
  const [isPickerSelected, setIsPickerSelected] = useState(false);
  const {COLORS, FONTS} = useTheme();

  useEffect(() => {
    if (value) {
      setIsPickerSelected(true);
    }
  }, [value]);

  const getInputStyle = useCallback(() => {
    if (isPickerSelected) {
      return [
        styles.outlinedPicker,
        {
          backgroundColor: COLORS.INPUT_BACKGROUND_COLOR,
          borderColor: COLORS.INPUT_ACTIVE_BORDER_COLOR,
        },
        containerStyle,
      ];
    } else {
      return [
        styles.fillPicker,
        {
          backgroundColor: COLORS.INPUT_BACKGROUND_COLOR,
          borderColor: COLORS.INPUT_INACTIVE_BORDER_COLOR,
        },
        containerStyle,
      ];
    }
  }, [isPickerSelected]);

  return (
    <Pressable style={[styles.container, parentStyle]} onPress={onPress}>
      <View style={getInputStyle()}>
        <Text
          numberOfLines={1}
          style={[
            styles.text,
            {
              fontFamily: FONTS.MONTSERRAT.REGULAR,
              color: value
                ? COLORS.CHIP_TEXT_COLOR
                : COLORS.INPUT_PLACEHOLDER_COLOR,
            },
            customLabelStyle,
          ]}>
          {value ? value : placeholder}
        </Text>
        <Pressable style={styles.rightIcon} onPress={onRightIconClick}>
          <PICKER_ICON />
        </Pressable>
      </View>
    </Pressable>
  );
};

export default Picker;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 13,
  },
  fillPicker: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  outlinedPicker: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  text: {
    flex: 1,
    fontSize: responsiveFontSize(16),
    justifyContent: 'center',
  },
  rightIcon: {},
});
