import {StyleSheet, View} from 'react-native';
import React, {useCallback} from 'react';
import useTheme from '../../../../../theme/hooks/useTheme';

type DotsViewTypes = {
  stepNumber: number;
  totalSteps: number;
};

const DotsView = ({stepNumber, totalSteps}: DotsViewTypes) => {
  const {COLORS} = useTheme();

  const getDotsStyle = useCallback(
    (index: number) => [
      styles.dotContainer,
      {
        backgroundColor:
          stepNumber > index + 1
            ? COLORS.SECONDARY_COLOR
            : stepNumber === index + 1
            ? COLORS.PRIMARY_COLOR
            : COLORS.SIGNUP_PROGRESS_BACKGROUND_COLOR,
        borderWidth: stepNumber === index + 1 ? 1 : 0,
        borderColor: COLORS.SECONDARY_COLOR,
      },
    ],
    [stepNumber],
  );

  return (
    <View style={styles.container}>
      {[...Array(totalSteps).keys()].map(index => {
        return <View key={index} style={getDotsStyle(index)} />;
      })}
    </View>
  );
};

export default DotsView;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dotContainer: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
});
