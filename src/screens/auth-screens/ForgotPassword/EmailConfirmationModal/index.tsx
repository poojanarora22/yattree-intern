import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';

import {OPEN_MAIL} from '../../../../assets/icons/svg';
import useTheme from '../../../../theme/hooks/useTheme';
import Button from '../../../../components/Button';
import LOCALES from '../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';

type ModalTypes = {
  showModal: boolean;
  loading?: boolean;
  isForgotPasswordScreen?: boolean;
  closeModal: () => void;
  onOpenMail: () => void;
  onSkip: () => void;
};

const EmailConfirmationModal = ({
  showModal,
  isForgotPasswordScreen = true,
  loading = false,
  closeModal = () => {},
  onOpenMail = () => {},
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
          <View
            style={[
              styles.container,
              {backgroundColor: COLORS.SECONDARY_MODAL_BACKGROUND_COLOR},
            ]}>
            <OPEN_MAIL alignSelf="center" />
            <View style={{marginTop: 42, marginBottom: 10}}>
              <Text
                style={[
                  styles.label,
                  {
                    fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                    color: COLORS.MODAL_TEXT_COLOR,
                  },
                ]}>
                {t(LOCALES.FORGOT_PASSWORD.MODAL_TITLE)}
              </Text>
              <Text
                style={[
                  styles.description,
                  {
                    fontFamily: FONTS.MONTSERRAT.MEDIUM,
                    color: COLORS.MODAL_TEXT_COLOR,
                  },
                ]}>
                {isForgotPasswordScreen
                  ? t(LOCALES.FORGOT_PASSWORD.MODAL_DESCRIPTION)
                  : t(LOCALES.SIGNUP.MODAL_DESCRIPTION_1)}
              </Text>
            </View>
            <Button
              title={t(LOCALES.FORGOT_PASSWORD.MODAL_BUTTON_TEXT_1)}
              onPress={onOpenMail}
              loading={loading}
            />
            <View style={{marginBottom: 20}} />
            <Button
              title={t(LOCALES.FORGOT_PASSWORD.MODAL_BUTTON_TEXT_2)}
              containerStyle={{
                backgroundColor: COLORS.TERTIARY_BUTTON_COLOR,
              }}
              customLabelStyle={{
                color: COLORS.PRIMARY_BUTTON_COLOR,
              }}
              onPress={onSkip}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default EmailConfirmationModal;

const styles = StyleSheet.create({
  parent: {flex: 1, justifyContent: 'flex-end'},
  container: {
    margin: 20,
    borderRadius: 24,
    minHeight: 400,
    padding: 20,
    paddingTop: 40,
  },
  label: {
    fontSize: responsiveFontSize(16),
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: responsiveFontSize(14),
    marginBottom: 20,
  },
});
