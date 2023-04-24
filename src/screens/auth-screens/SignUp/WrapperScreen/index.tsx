import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {ReactNode} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

import useTheme from '../../../../theme/hooks/useTheme';
import Header from '../../../../components/Header';
import StepBar from '../components/StepBar';
import Button from '../../../../components/Button';
import DotsView from '../components/DotsView';
import ForwardArrow from '../../../../assets/icons/svg/ForwardArrow';
import {useTranslation} from 'react-i18next';
import LOCALES from '../../../../localization/constants';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';

type WrapperScreenType = {
  title: string;
  children: ReactNode;
  stepNumber: number;
  onBackPress?: () => void;
  onContinue?: () => void;
  loading?: boolean;
  disabled?: boolean;
  onLogin?: () => void;
};

const WrapperScreen = ({
  title,
  children,
  stepNumber = 1,
  onBackPress = () => {},
  onContinue = () => {},
  loading = false,
  disabled = false,
  onLogin = () => {},
}: WrapperScreenType) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.APP_BACKGROUND_COLOR,
      }}>
      <StatusBar
        backgroundColor={COLORS.STATUS_BAR_COLOR}
        barStyle={BAR_STYLE}
      />
      <KeyboardAvoidingView
        style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled>
        <Header title={title} onBackPress={onBackPress} />
        <StepBar stepNumber={stepNumber} totalSteps={6} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainer}>
          <View style={{flex: 1, justifyContent: 'flex-start'}}>
            {children}
          </View>
          <View
            style={{flex: 1, justifyContent: 'flex-end', marginHorizontal: 20}}>
            <DotsView stepNumber={stepNumber} totalSteps={6} />
            <Button
              title={
                stepNumber === 6
                  ? t(LOCALES.SIGNUP.BUTTON_TEXT_1)
                  : t(LOCALES.SIGNUP.BUTTON_TEXT)
              }
              onPress={onContinue}
              containerStyle={{
                marginTop: 40,
                marginBottom:
                  stepNumber > 2 && Platform.OS === 'android' ? 20 : 0,
              }}
              loading={loading}
              disabled={disabled}
            />
            {(stepNumber === 1 || stepNumber === 2) && (
              <View style={styles.footerContainer}>
                <Text
                  style={[
                    styles.footer,
                    {
                      color: COLORS.PRIMARY_TEXT_COLOR,
                      fontFamily: FONTS.MONTSERRAT.REGULAR,
                    },
                  ]}>
                  {t(LOCALES.SIGNUP.ACCOUNT_CONFIRMATION)}
                </Text>
                <Pressable style={styles.loginContainer} onPress={onLogin}>
                  <Text
                    style={[
                      styles.login,
                      {
                        color: COLORS.SECONDARY_COLOR,
                        fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                      },
                    ]}>
                    {t(LOCALES.SIGNUP.LOGIN)}
                  </Text>
                  <ForwardArrow color={COLORS.SECONDARY_COLOR} />
                </Pressable>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default WrapperScreen;

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  login: {
    fontSize: responsiveFontSize(14),
    marginRight: 8,
  },
  footer: {
    marginBottom: 16,
    fontSize: responsiveFontSize(14),
  },
  footerContainer: {marginTop: 30, marginBottom: 30},
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
});
