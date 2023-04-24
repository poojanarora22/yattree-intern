import {Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import useTheme from '../../../../../theme/hooks/useTheme';
import {useTranslation} from 'react-i18next';
import {BlurView} from '@react-native-community/blur';
import {DELETE_ACCOUNT, EYE, EYE_HIDE} from '../../../../../assets/icons/svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {responsiveFontSize} from '../../../../../theme/responsiveFontSize';
import Button from '../../../../../components/Button';
import LOCALES from '../../../../../localization/constants';
import TextField from '../../../../../components/TextField';
import {useApi} from '../../../../../hooks/useApi';
import {URL} from '../../../../../constants/URLS';
import {appAlert} from '../../../../../components/appAlert';
import useCleanUp from '../../../../../hooks/useCleanUp';

type DeleteAccountModalType = {
  bottomSheetModalRef: any;
};

const DeleteAccountModal = ({bottomSheetModalRef}: DeleteAccountModalType) => {
  const {COLORS, FONTS} = useTheme();
  const {t} = useTranslation();
  const [isFocused, setIsFocused] = useState(false);
  const initialSnapPoints = useMemo(() => [150, 'CONTENT_HEIGHT'], []);
  const {bottom} = useSafeAreaInsets();
  const [logoutUser] = useCleanUp();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const renderBackdrop = useCallback(
    () => (
      <Pressable
        onPress={() => bottomSheetModalRef?.current?.close()}
        style={styles.absolute}>
        <BlurView
          style={styles.absolute}
          blurType="dark"
          blurAmount={10}
          reducedTransparencyFallbackColor="white"
        />
      </Pressable>
    ),
    [],
  );

  const handleComponent = useCallback(() => {
    return (
      <View style={styles.handleContainer}>
        <View
          style={[styles.handle, {backgroundColor: COLORS.TERTIARY_COLOR}]}
        />
      </View>
    );
  }, []);

  const [
    deleteAccount,
    deleteAccountResponse,
    deleteAccountError,
    isDeleteAccountLoading,
  ] = useApi({
    url: URL.DELETE_ACCOUNT,
    method: 'DELETE',
  });

  useEffect(() => {
    if (deleteAccountResponse) {
      if (deleteAccountResponse?.statusCode === 200) {
        logoutUser();
      }
    }
  }, [deleteAccountResponse]);

  useEffect(() => {
    if (deleteAccountError) {
      if (deleteAccountError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: deleteAccountError?.message,
        });
      }
    }
  }, [deleteAccountError]);

  const getInputStyle = useCallback(() => {
    if (isFocused) {
      return [
        styles.outlinedInput,
        {
          backgroundColor: COLORS.INPUT_BACKGROUND_COLOR,
          borderColor: COLORS.INPUT_ACTIVE_BORDER_COLOR,
        },
      ];
    } else {
      return [
        styles.fillInput,
        {
          backgroundColor: COLORS.INPUT_BACKGROUND_COLOR,
          borderColor: COLORS.INPUT_INACTIVE_BORDER_COLOR,
        },
      ];
    }
  }, [isFocused]);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      snapPoints={animatedSnapPoints}
      backgroundStyle={{backgroundColor: COLORS.MODAL_BACKGROUND_COLOR}}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      backdropComponent={renderBackdrop}
      handleComponent={handleComponent}
      enablePanDownToClose={true}>
      <BottomSheetView
        style={[styles.contentContainerStyle]}
        onLayout={handleContentLayout}>
        <View
          style={{
            paddingBottom: Platform.OS === 'ios' ? bottom : 20,
            marginHorizontal: 20,
          }}>
          <View
            style={[
              styles.icon,
              {
                backgroundColor: COLORS.INPUT_BACKGROUND_COLOR,
                borderColor: COLORS.INPUT_INACTIVE_BORDER_COLOR,
              },
            ]}>
            <DELETE_ACCOUNT />
          </View>
          <Text
            style={{
              color: COLORS.PRIMARY_TEXT_COLOR,
              fontSize: responsiveFontSize(16),
              fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
              textAlign: 'center',
              marginBottom: 12,
            }}>
            {t(LOCALES.SETTING.LBL_DELETE_ACCOUNT_CONFIRMATION)}
          </Text>
          <Text
            style={{
              color: COLORS.PRIMARY_TEXT_COLOR,
              fontSize: responsiveFontSize(14),
              fontFamily: FONTS.MONTSERRAT.REGULAR,
              textAlign: 'center',
              marginBottom: 30,
            }}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry’s standard.
          </Text>
          <Text
            style={[
              styles.password,
              {
                color: COLORS.SECONDARY_TEXT_COLOR,
                fontFamily: FONTS.MONTSERRAT.REGULAR,
              },
            ]}>
            {t(LOCALES.SIGNIN.PASSWORD)}
          </Text>
          <View style={getInputStyle()}>
            <BottomSheetTextInput
              placeholder={t(LOCALES.SIGNIN.PASSWORD_PLACEHOLDER)}
              placeholderTextColor={COLORS.INPUT_PLACEHOLDER_COLOR}
              secureTextEntry={!showPassword}
              value={password}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChangeText={setPassword}
              style={[
                styles.textInput,
                {
                  fontFamily: FONTS.MONTSERRAT.REGULAR,
                  color: COLORS.INPUT_TEXT_COLOR,
                },
              ]}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EYE_HIDE /> : <EYE />}
            </Pressable>
          </View>
          <View style={styles.row}>
            <Button
              title={t(LOCALES.SETTING.LBL_CANCEL)}
              containerStyle={{
                width: '45%',
                borderWidth: 1,
                backgroundColor: COLORS.PRIMARY_CHIP_COLOR,
                borderColor: COLORS.CHIP_INACTIVE_BORDER_COLOR,
              }}
              onPress={() => bottomSheetModalRef?.current?.close()}
            />
            <Button
              title={t(LOCALES.SETTING.LBL_DELETE)}
              containerStyle={{width: '45%'}}
              disabled={!password.trim() || isDeleteAccountLoading}
              loading={isDeleteAccountLoading}
              onPress={() => {
                const data = {
                  password: password,
                };
                deleteAccount(data);
              }}
            />
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default DeleteAccountModal;

const styles = StyleSheet.create({
  contentContainerStyle: {},
  handle: {
    height: 3,
    width: 60,
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 15,
  },
  handleContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 0,
  },
  icon: {
    alignSelf: 'center',
    height: 82,
    width: 82,
    borderRadius: 31,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginTop: 10,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  password: {
    fontSize: responsiveFontSize(14),
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    fontSize: responsiveFontSize(16),
    justifyContent: 'center',
  },
  fillInput: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
    paddingHorizontal: 18,
    borderWidth: 1,
    marginBottom: 30,
  },
  outlinedInput: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
    paddingHorizontal: 18,
    borderWidth: 1,
    marginBottom: 30,
  },
});
