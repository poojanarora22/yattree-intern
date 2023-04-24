import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import useTheme from '../../theme/hooks/useTheme';
import { responsiveFontSize } from '../../theme/responsiveFontSize';

const EmptyComponent = () => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  return (
    <View style={[styles.container, {backgroundColor: COLORS.PRIMARY_COLOR}]}>
      <StatusBar
        backgroundColor={COLORS.STATUS_BAR_COLOR}
        barStyle={BAR_STYLE}
      />
      <Text
        style={[
          styles.label,
          {color: COLORS.PRIMARY_TEXT_COLOR, fontFamily: FONTS.MONTSERRAT.BOLD},
        ]}>
        COMING SOON ...
      </Text>
    </View>
  );
};

export default EmptyComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: responsiveFontSize(20),
  },
});
