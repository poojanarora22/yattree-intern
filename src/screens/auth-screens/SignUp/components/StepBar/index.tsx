import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import React from 'react';
import useTheme from '../../../../../theme/hooks/useTheme';

type StepBarTypes = {
  stepNumber: number;
  totalSteps: number;
};

const StepBar = ({stepNumber = 1, totalSteps = 1}: StepBarTypes) => {
  const {width} = useWindowDimensions();
  const {COLORS} = useTheme();
  return (
    <View
      style={{
        height: 1,
        width: (width / totalSteps) * stepNumber,
        backgroundColor: COLORS.SECONDARY_COLOR,
      }}
    />
  );
};

export default StepBar;

const styles = StyleSheet.create({});
