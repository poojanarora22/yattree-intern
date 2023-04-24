import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React, {ReactNode} from 'react';
import useTheme from '../../../../theme/hooks/useTheme';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../../../components/Header';
import StepBar from '../../../auth-screens/SignUp/components/StepBar';
import DotsView from '../../../auth-screens/SignUp/components/DotsView';
import Button from '../../../../components/Button';
import LOCALES from '../../../../localization/constants';
import {useAppSelector} from '../../../../store';

type WrapperScreenType = {
  children: ReactNode;
  stepNumber: number;
  onBackPress?: () => void;
  onContinue?: () => void;
  loading?: boolean;
  disabled?: boolean;
};

const WrapperScreen = ({
  children,
  stepNumber = 1,
  onBackPress = () => {},
  onContinue = () => {},
  loading = false,
  disabled = false,
}: WrapperScreenType) => {
  const {COLORS, BAR_STYLE} = useTheme();
  const {t} = useTranslation();
  const {selectedCreatePostOption, editTourId} = useAppSelector(
    state => state.createPost,
  );

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
        <Header
          title={`${
            editTourId
              ? t(LOCALES.HOME.EDIT)
              : t(LOCALES.CREATE_POST.LBL_CREATE)
          } ${selectedCreatePostOption?.title}`}
          onBackPress={onBackPress}
        />
        <StepBar stepNumber={stepNumber} totalSteps={2} />
        <ScrollView
          scrollEnabled={!disabled}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainer}>
          <View style={{flex: 1, justifyContent: 'flex-start'}}>
            {children}
          </View>
          <View
            style={{flex: 1, justifyContent: 'flex-end', marginHorizontal: 20}}>
            <DotsView stepNumber={stepNumber} totalSteps={2} />
            <Button
              title={
                stepNumber === 1
                  ? t(LOCALES.CREATE_POST.LBL_SAVE_CONTINUE)
                  : t(LOCALES.CREATE_POST.LBL_PUBLISH)
              }
              onPress={onContinue}
              containerStyle={{
                marginTop: 40,
                marginBottom: Platform.OS === 'android' ? 20 : 0,
              }}
              loading={loading}
              disabled={disabled}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default WrapperScreen;

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
});
