import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {ReactNode, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import useTheme from '../../../../theme/hooks/useTheme';
import {useTranslation} from 'react-i18next';
import {APP_LOGO} from '../../../../assets/images';
import Button from '../../../../components/Button';
import LOCALES from '../../../../localization/constants';
import SkipModal from './SkipModal';

type WrapperScreenType = {
  children: ReactNode;
  onContinue?: () => void;
  onSkip?: () => void;
  loading?: boolean;
  disabled?: boolean;
  isLocationScreen?: boolean;
};

const WrapperScreen = ({
  children,
  onContinue = () => {},
  onSkip = () => {},
  loading = false,
  disabled = false,
  isLocationScreen = false,
}: WrapperScreenType) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();
  const [showModal, setShowModal] = useState(false);
  return (
    <>
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
          <ScrollView
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContainer}>
            <View style={{flex: 1, justifyContent: 'flex-start'}}>
              <View style={styles.imageContainer}>
                <Image source={APP_LOGO} style={styles.image} />
              </View>
              {children}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title={
                  isLocationScreen
                    ? t(LOCALES.PROFILE.BUTTON_TEXT_5)
                    : t(LOCALES.PROFILE.BUTTON_TEXT_1)
                }
                onPress={onContinue}
                loading={loading}
                disabled={disabled}
              />
              <View style={{marginTop: 10}} />
              <Button
                title={t(LOCALES.PROFILE.BUTTON_TEXT_2)}
                containerStyle={{
                  backgroundColor: COLORS.SECONDARY_BUTTON_COLOR,
                }}
                customLabelStyle={{
                  color: COLORS.SECONDARY_COLOR,
                }}
                onPress={() => setShowModal(true)}
                disabled={loading}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <SkipModal
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        onVerify={() => setShowModal(false)}
        onSkip={() => {
          setShowModal(false);
          onSkip();
        }}
      />
    </>
  );
};

export default WrapperScreen;

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  imageContainer: {
    height: 66,
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  image: {
    height: 26,
    width: 172,
    resizeMode: 'contain',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginHorizontal: 20,
  },
});
