import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import useTheme from '../../../../../../theme/hooks/useTheme';

type MultiSliderType = {
  min: number;
  max: number;
  getValues: (min: number, max: number) => void;
  values: {
    min: number;
    max: number;
  };
  resetSlider: boolean;
};

const CustomMultiSlider = ({
  min = 0,
  max = 100,
  getValues = () => {},
  resetSlider = false,
  values,
}: MultiSliderType) => {
  const {width} = Dimensions.get('window');
  const {COLORS} = useTheme();
  const [minValue, setMinValue] = useState<number>(min);
  const [maxValue, setMaxValue] = useState<number>(max);

  useEffect(() => {
    getValues(minValue, maxValue);
  }, [minValue, maxValue]);

  useEffect(() => {
    if (resetSlider) {
      setMinValue(min);
      setMaxValue(max);
    }
  }, [resetSlider]);

  useEffect(() => {
    if (values) {
      setMinValue(values.min);
      setMaxValue(values.max);
    }
  }, [values]);

  return (
    <MultiSlider
      sliderLength={width - 40}
      min={min}
      max={max}
      trackStyle={{height: 2}}
      selectedStyle={{backgroundColor: COLORS.SECONDARY_COLOR}}
      unselectedStyle={{
        backgroundColor: COLORS.RADIO_BUTTON_BACKGROUND_COLOR,
      }}
      markerOffsetY={3}
      values={[minValue, maxValue]}
      onValuesChange={(values: number[]) => {
        setMinValue(values[0]);
        setMaxValue(values[1]);
      }}
      customMarker={() => (
        <View
          style={[styles.marker, {backgroundColor: COLORS.TERTIARY_COLOR}]}
        />
      )}
    />
  );
};

export default CustomMultiSlider;

const styles = StyleSheet.create({
  marker: {
    height: 21,
    width: 21,
    borderRadius: 10,
  },
});
