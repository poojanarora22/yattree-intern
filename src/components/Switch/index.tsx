import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import {SwitchType} from '../../types/components/Switch';
import useTheme from '../../theme/hooks/useTheme';

const Switch = ({value = true, onChange = () => {}}: SwitchType) => {
  const {COLORS} = useTheme();
  return (
    <Pressable
      onPress={() => {
        onChange(!value);
      }}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: value
              ? COLORS.SWITCH_ACTIVE_COLOR
              : COLORS.SWITCH_INACTIVE_COLOR,
          },
        ]}>
        <View
          style={[
            styles.dot,
            {
              backgroundColor: COLORS.SWITCH_DOT_COLOR,
              alignSelf: value ? 'flex-end' : 'flex-start',
            },
          ]}></View>
      </View>
    </Pressable>
  );
};

export default Switch;

const styles = StyleSheet.create({
  container: {
    height: 26,
    width: 46,
    borderRadius: 100,
    padding: 3,
  },
  dot: {
    height: 20,
    width: 20,
    borderRadius: 10,
  },
});
