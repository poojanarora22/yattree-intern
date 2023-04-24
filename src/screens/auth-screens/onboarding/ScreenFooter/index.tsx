import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import Button from '../../../../components/Button';
import useTheme from '../../../../theme/hooks/useTheme';
import LOCALES from '../../../../localization/constants';
import {useTranslation} from 'react-i18next';

type ScreenFooterType = {
  onLogin?: () => void;
  onSkip?: () => void;
};

const ScreenFooter = ({onLogin, onSkip}: ScreenFooterType) => {
  const {COLORS} = useTheme();
  const {t} = useTranslation();
  return (
    <View style={{margin: 20}}>
      <Button title={t(LOCALES.SIGNIN.LOGIN)} onPress={onLogin} />
      <View style={{marginTop: 10}} />
      <Button
        title={t(LOCALES.ONBOARDING.SKIP)}
        containerStyle={{
          backgroundColor: COLORS.SECONDARY_BUTTON_COLOR,
        }}
        onPress={onSkip}
      />
    </View>
  );
};

export default ScreenFooter;

const styles = StyleSheet.create({});
