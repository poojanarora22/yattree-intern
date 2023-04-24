import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {RadioButtonType} from '../../types/components/RadioButton';
import useTheme from '../../theme/hooks/useTheme';

const RadioButton = ({value = false, onChange = () => {}}: RadioButtonType) => {
  const {COLORS} = useTheme();
  return (
    <Pressable
      onPress={() => {
        onChange(!value);
      }}>
      <View
        style={[
          styles.container,
          {backgroundColor: COLORS.RADIO_BUTTON_BACKGROUND_COLOR},
        ]}>
        {value && (
          <View
            style={[
              styles.dot,
              {backgroundColor: COLORS.RADIO_BUTTON_DOT_COLOR},
            ]}
          />
        )}
      </View>
    </Pressable>
  );
};

export default RadioButton;

const styles = StyleSheet.create({
  container: {
    height: 24,
    width: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
  },
});
