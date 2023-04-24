import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import useTheme from '../../../../../theme/hooks/useTheme';
import {VERIFY_PHONE_NUMBER} from '../../../../../assets/icons/svg';
import LOCALES from '../../../../../localization/constants';
import Button from '../../../../../components/Button';
import {useTranslation} from 'react-i18next';
import {responsiveFontSize} from '../../../../../theme/responsiveFontSize';

type ModalTypes = {
  showModal: boolean;
  disabledResendAccessCode: boolean;
  disabledVerify: boolean;
  closeModal: () => void;
  onVerify: (otp: string) => void;
  onResendAccessCode: () => void;
};

const VerifyPhoneNumber = ({
  showModal,
  disabledResendAccessCode = false,
  disabledVerify = false,
  closeModal = () => {},
  onVerify = () => {},
  onResendAccessCode = () => {},
}: ModalTypes) => {
  const {COLORS, FONTS} = useTheme();
  const [counter, setCounter] = useState(60);
  const {t} = useTranslation();
  const CELL_COUNT = 4;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    if (showModal) {
      setValue('');
      setCounter(60);
    }
  }, [showModal]);

  React.useEffect(() => {
    const timer = setInterval(() => setCounter(counter - 1), 1000);
    if (counter <= 0) clearInterval(timer);
    return () => clearInterval(timer);
  }, [counter]);

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
          <KeyboardAvoidingView style={{}} behavior={'padding'} enabled>
            <View
              style={[
                styles.container,
                {backgroundColor: COLORS.SECONDARY_MODAL_BACKGROUND_COLOR},
              ]}>
              <VERIFY_PHONE_NUMBER alignSelf="center" />
              <View style={{marginVertical: 42}}>
                <Text
                  style={[
                    styles.label,
                    {
                      fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                      color: COLORS.MODAL_TEXT_COLOR,
                    },
                  ]}>
                  {t(LOCALES.SIGNUP.MODAL_TITLE)}
                </Text>
                <Text
                  style={[
                    styles.description,
                    {
                      fontFamily: FONTS.MONTSERRAT.MEDIUM,
                      color: COLORS.MODAL_TEXT_COLOR,
                    },
                  ]}>
                  {t(LOCALES.SIGNUP.MODAL_DESCRIPTION)}
                </Text>
              </View>
              <CodeField
                ref={ref}
                {...props}
                value={value}
                onChangeText={setValue}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({index, symbol, isFocused}) => (
                  <Text
                    key={index}
                    style={[
                      styles.cell,
                      {
                        fontFamily: FONTS.MONTSERRAT.MEDIUM,
                        color: COLORS.MODAL_TEXT_COLOR,
                      },
                      isFocused && {borderColor: COLORS.SECONDARY_COLOR},
                    ]}
                    onLayout={getCellOnLayoutHandler(index)}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                )}
              />
              <Button
                title={t(LOCALES.SIGNUP.MODAL_BUTTON_TEXT_1)}
                onPress={() => onVerify(value)}
                disabled={disabledVerify}
                loading={disabledVerify}
              />
              <View style={{marginBottom: 20}} />
              {/* <Button
                title={t(LOCALES.SIGNUP.MODAL_BUTTON_TEXT_2)}
                containerStyle={{
                  backgroundColor: COLORS.TERTIARY_BUTTON_COLOR,
                }}
                customLabelStyle={{
                  color: COLORS.RESEND_CODE_COLOR,
                  textDecorationLine: 'underline',
                }}
                onPress={onResendAccessCode}
                disabled={disabledResendAccessCode}
              /> */}
              <Text style={{color: COLORS.INPUT_PLACEHOLDER_COLOR}}>
                {t(LOCALES.SIGNUP.MODAL_BUTTON_TEXT_2)}
                <Text
                  onPress={() => {
                    if (counter <= 0) {
                      onResendAccessCode();
                      setCounter(60);
                    }
                  }}
                  style={{
                    color: COLORS.RESEND_CODE_COLOR,
                    opacity: counter <= 0 ? 1 : 0.2,
                  }}>
                  {t(LOCALES.SIGNUP.MODAL_BUTTON_TEXT_3)}
                </Text>
                <Text style={{color: COLORS.INPUT_PLACEHOLDER_COLOR}}>
                  {t(LOCALES.SIGNUP.MODAL_BUTTON_TEXT_4)}
                </Text>
                <Text style={{color: COLORS.RESEND_CODE_COLOR}}>
                  00:{counter}
                </Text>
              </Text>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default VerifyPhoneNumber;

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
  },
  codeFieldRoot: {marginBottom: 40, alignSelf: 'center'},
  cell: {
    width: 52,
    height: 52,
    borderRadius: 18,
    fontSize: responsiveFontSize(16),
    borderWidth: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginHorizontal: 11,
    paddingTop: Platform.OS === 'ios' ? 16 : 0,
    borderColor: '#BFBFBF',
  },
});
