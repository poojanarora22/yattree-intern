import {
  Dimensions,
  FlatList,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import useTheme from '../../../theme/hooks/useTheme';
import {slides} from './Data';
import IntroScreen from './IntroScreen';
import DotsView from './DotsView';
import ScreenFooter from './ScreenFooter';
import {OnboardingScreenProps} from '../../../types/navigation/authTypes';
import {getParamsFromURL} from '../../../utilities/functions';

const Onboarding = ({navigation}: OnboardingScreenProps) => {
  const {COLORS, BAR_STYLE} = useTheme();
  const screenWidth = Dimensions.get('screen').width - 16;
  const [currentIndex, setCurrentIndex] = useState(0);
  const insets = useSafeAreaInsets();

  const goToSignIn = useCallback(() => {
    navigation.navigate('SignIn');
  }, [navigation]);

  useEffect(() => {
    Linking.getInitialURL().then(url => {
      console.log('Deep Link URL', url);
      if (url && url.includes('reset-password')) {
        const params = getParamsFromURL(url);
        if (params?.email && params?.token) {
          navigation.navigate('ResetPassword', {
            email: params.email,
            token: params.token,
          });
        }
      }
    });
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Platform.OS === 'ios' ? insets.top : 0,
          backgroundColor: COLORS.APP_BACKGROUND_COLOR,
        },
      ]}>
      <StatusBar
        backgroundColor={COLORS.STATUS_BAR_COLOR}
        barStyle={BAR_STYLE}
      />
      <FlatList
        data={slides}
        keyExtractor={item => item.key}
        renderItem={({item}) => <IntroScreen item={item} />}
        pagingEnabled
        onMomentumScrollEnd={e => {
          const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
          setCurrentIndex(index);
        }}
        style={{flexGrow: 0}}
        bounces
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      <DotsView currentIndex={currentIndex} />
      <ScreenFooter onLogin={goToSignIn} onSkip={goToSignIn} />
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});
