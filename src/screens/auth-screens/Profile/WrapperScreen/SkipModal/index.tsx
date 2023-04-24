import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';

import LOCALES from '../../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import useTheme from '../../../../../theme/hooks/useTheme';
import {RETURN_ICON} from '../../../../../assets/icons/svg';
import Button from '../../../../../components/Button';
import {responsiveFontSize} from '../../../../../theme/responsiveFontSize';
import {BlurView} from '@react-native-community/blur';

type ModalTypes = {
  showModal: boolean;
  closeModal: () => void;
  onVerify: () => void;
  onSkip: () => void;
};

const SkipModal = ({
  showModal,
  closeModal = () => {},
  onVerify = () => {},
  onSkip = () => {},
}: ModalTypes) => {
  const {FONTS, COLORS} = useTheme();
  const {t} = useTranslation();
  return (
    <Modal
      transparent
      visible={showModal}
      statusBarTranslucent={true}
      onDismiss={closeModal}
      animationType="fade"
      onRequestClose={closeModal}>
      <TouchableWithoutFeedback onPress={closeModal}>
        <View
          style={[
            styles.parent,
            {backgroundColor: COLORS.PRIMARY_MODAL_BACKGROUND_COLOR},
          ]}>
          <BlurView
            style={styles.absolute}
            blurType="dark"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
          />
          <View
            style={[
              styles.container,
              {backgroundColor: COLORS.TERTIARY_MODAL_BACKGROUND_COLOR},
            ]}>
            <RETURN_ICON alignSelf="center" />
            <Text
              style={[
                styles.description,
                {
                  fontFamily: FONTS.MONTSERRAT.MEDIUM,
                  color: COLORS.PRIMARY_TEXT_COLOR,
                },
              ]}>
              {t(LOCALES.PROFILE.DESCRIPTION_2)}
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                title={t(LOCALES.PROFILE.BUTTON_TEXT_3)}
                containerStyle={{width: '46%'}}
                onPress={onVerify}
              />
              <Button
                title={t(LOCALES.PROFILE.BUTTON_TEXT_4)}
                containerStyle={{
                  width: '46%',
                  backgroundColor: COLORS.SECONDARY_BUTTON_COLOR,
                }}
                onPress={onSkip}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SkipModal;

const styles = StyleSheet.create({
  parent: {flex: 1, justifyContent: 'flex-end'},
  container: {
    margin: 20,
    borderRadius: 24,
    minHeight: 360,
    padding: 20,
    paddingTop: 40,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  description: {
    textAlign: 'center',
    fontSize: responsiveFontSize(14),
    marginVertical: 45,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 0,
  },
});
