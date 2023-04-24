import {Pressable, StyleSheet, TextInput, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import useTheme from '../../theme/hooks/useTheme';
import {TextFieldType} from '../../types/components/TextField';
import {responsiveFontSize} from '../../theme/responsiveFontSize';

const TextField = ({
  leftIcon,
  rightIcon,
  containerStyle = {},
  textInputStyle = {},
  parentStyle = {},
  onLeftIconClick = () => {},
  onRightIconClick = () => {},
  customLeftIconStyle = {},
  customRightIconStyle = {},
  secureTextEntry = false,
  keyboardType = 'default',
  placeholder = '',
  onChangeText,
  value,
  maxLength,
  multiline = false,
  editable = true,
}: TextFieldType) => {
  const [isFocused, setIsFocused] = useState(false);
  const {COLORS, FONTS} = useTheme();

  const getInputStyle = useCallback(() => {
    if (isFocused) {
      return [
        styles.outlinedInput,
        {
          backgroundColor: COLORS.INPUT_BACKGROUND_COLOR,
          borderColor: COLORS.INPUT_ACTIVE_BORDER_COLOR,
        },
        containerStyle,
      ];
    } else {
      return [
        styles.fillInput,
        {
          backgroundColor: COLORS.INPUT_BACKGROUND_COLOR,
          borderColor: COLORS.INPUT_INACTIVE_BORDER_COLOR,
        },
        containerStyle,
      ];
    }
  }, [isFocused]);

  return (
    <View style={[styles.container, parentStyle]}>
      <View style={getInputStyle()}>
        {leftIcon ? (
          <Pressable style={customLeftIconStyle} onPress={onLeftIconClick}>
            {leftIcon}
          </Pressable>
        ) : null}

        <TextInput
          style={[
            styles.textInput,
            {
              fontFamily: FONTS.MONTSERRAT.REGULAR,
              color: COLORS.INPUT_TEXT_COLOR,
            },
            textInputStyle,
          ]}
          autoCapitalize={'none'}
          textAlignVertical={multiline ? 'top' : 'auto'}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor={COLORS.INPUT_PLACEHOLDER_COLOR}
          underlineColorAndroid="transparent"
          onChangeText={onChangeText}
          value={value}
          autoComplete={'off'}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={multiline}
          editable={editable}
        />

        {rightIcon ? (
          <Pressable style={customRightIconStyle} onPress={onRightIconClick}>
            {rightIcon}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

export default TextField;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 13,
    marginBottom: 30,
  },
  fillInput: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
    paddingHorizontal: 18,
    borderWidth: 1,
  },
  outlinedInput: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
    paddingHorizontal: 18,
    borderWidth: 1,
  },
  textInput: {
    flex: 1,
    fontSize: responsiveFontSize(16),
    justifyContent: 'center',
  },
});
