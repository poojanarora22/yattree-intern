import React from 'react';
import {View, StyleSheet} from 'react-native';
import {slides} from '../Data';
import {ONBOARDING_PROGRESS} from '../../../../assets/icons/svg';
import useTheme from '../../../../theme/hooks/useTheme';

type DotsViewType = {
  currentIndex: number;
};

const DotsView = ({currentIndex}: DotsViewType) => {
  const {COLORS} = useTheme();
  return (
    <View style={styles.parent}>
      {slides.map((item, index) => {
        return index === currentIndex ? (
          <ONBOARDING_PROGRESS
            height={17}
            width={17}
            marginRight={8}
            key={item.key}
          />
        ) : (
          <View
            key={item.key}
            style={[
              styles.dotContainer,
              {backgroundColor: COLORS.TERTIARY_COLOR},
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  dotContainer: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  image: {
    height: 17,
    width: 17,
    resizeMode: 'contain',
    marginRight: 8,
  },
});
export default DotsView;
