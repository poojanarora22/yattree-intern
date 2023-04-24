import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import useTheme from '../../theme/hooks/useTheme';
import {ButtonType} from '../../types/components/Button';
import {responsiveFontSize} from '../../theme/responsiveFontSize';

const Button = ({
  onPress = () => {},
  title,
  customLabelStyle = {},
  disabled = false,
  loading = false,
  icon,
  containerStyle = {},
  loaderColor = '#FFFFFF',
}: ButtonType) => {
  const {FONTS, COLORS} = useTheme();
  const getView = () => {
    let ele = null;
    if (loading) {
      ele = <ActivityIndicator size="small" color={loaderColor} />;
    } else if (icon) {
      ele = (
        <View style={styles.row}>
          <View>{icon}</View>
          <Text
            style={[
              styles.buttonText,
              {
                marginLeft: 10,
                fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                color: COLORS.BUTTON_TEXT_COLOR,
              },
              customLabelStyle,
            ]}>
            {title}
          </Text>
        </View>
      );
    } else {
      ele = (
        <Text
          style={[
            styles.buttonText,
            {
              fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
              color: COLORS.BUTTON_TEXT_COLOR,
            },
            customLabelStyle,
          ]}>
          {title}
        </Text>
      );
    }
    return ele;
  };
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.parent,
        {backgroundColor: COLORS.PRIMARY_BUTTON_COLOR},
        containerStyle,
        disabled ? styles.buttonDisbaled : {},
      ]}>
      {getView()}
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  parent: {
    width: '100%',
    borderRadius: 13,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    fontSize: responsiveFontSize(14),
  },

  buttonDisbaled: {
    opacity: 0.5,
  },
});
