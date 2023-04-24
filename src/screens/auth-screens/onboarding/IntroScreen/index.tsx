import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';

import useTheme from '../../../../theme/hooks/useTheme';
import {useTranslation} from 'react-i18next';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height * 0.65;

const IntroScreen = ({item}: any) => {
  const {t} = useTranslation();
  const {COLORS, FONTS} = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.ImgContainer}>
        <Image source={item.imageUri} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.title,
            {
              fontFamily: FONTS.MONTSERRAT.BOLD,
              color: COLORS.PRIMARY_TEXT_COLOR,
            },
          ]}>
          {t(item.title)}
        </Text>
      </View>
    </View>
  );
};

export default IntroScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
  },
  ImgContainer: {
    width: screenWidth,
    height: screenHeight,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  title: {
    fontSize: responsiveFontSize(15),
    textAlign: 'center',
    lineHeight: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
});
