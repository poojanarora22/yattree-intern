import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import useTheme from '../../../../../../theme/hooks/useTheme';
import {useTranslation} from 'react-i18next';
import LOCALES from '../../../../../../localization/constants';
import {responsiveFontSize} from '../../../../../../theme/responsiveFontSize';
import {BlurView} from '@react-native-community/blur';
import {useAppSelector} from '../../../../../../store';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Check from '../../../../../../assets/icons/svg/Check';
import Button from '../../../../../../components/Button';
import {useApi} from '../../../../../../hooks/useApi';
import {URL} from '../../../../../../constants/URLS';
import {appAlert} from '../../../../../../components/appAlert';

type ReportModalType = {
  bottomSheetModalRef: any;
  setIsModalOpen: any;
  userData: any;
  onClose: () => void;
};

const ReportModal = ({
  bottomSheetModalRef,
  setIsModalOpen,
  userData,
  onClose = () => {},
}: ReportModalType) => {
  const {COLORS, FONTS} = useTheme();
  const {t} = useTranslation();
  const {userDetails} = useAppSelector(state => state.auth);
  const initialSnapPoints = useMemo(() => [150, 'CONTENT_HEIGHT'], []);
  const {bottom} = useSafeAreaInsets();
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

  const [blockUser, blockUserResponse, blockUserError, isBlockUserLoading] =
    useApi({
      url: URL.BLOCK,
      method: 'POST',
    });

  useEffect(() => {
    if (blockUserResponse) {
      if (blockUserResponse?.statusCode === 200) {
        appAlert({
          title: t(LOCALES.SUCCESS.LBL_SUCCESS),
          message: t(LOCALES.SUCCESS.LBL_BLOCK_USER_SUCCESS),
        });
      }
    }
  }, [blockUserResponse]);

  useEffect(() => {
    if (blockUserError) {
      if (blockUserError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: blockUserError?.message,
        });
      }
    }
  }, [blockUserError]);

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
      enablePanDownToClose={true}
      onChange={(index: number) => setIsModalOpen(!(index < 1))}>
      <BottomSheetView
        style={[styles.contentContainerStyle]}
        onLayout={handleContentLayout}>
        <View style={styles.container}>
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
                  borderColor: COLORS.INPUT_ACTIVE_BORDER_COLOR,
                },
              ]}>
              <Check width={25} height={17} />
            </View>
            <Text
              style={{
                color: COLORS.PRIMARY_TEXT_COLOR,
                fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                fontSize: responsiveFontSize(14),
                textAlign: 'center',
              }}>
              Thanks for reporting this post
            </Text>
            <Text
              style={{
                color: COLORS.SECONDARY_TEXT_COLOR,
                fontFamily: FONTS.MONTSERRAT.REGULAR,
                fontSize: responsiveFontSize(14),
                textAlign: 'center',
                marginVertical: 10,
                marginHorizontal: 20,
              }}>
              your feedback is important in helping us keep the yaatrees
              community safe.
            </Text>
            {!isBlockUserLoading ? (
              <Text
                onPress={() => {
                  const data = {
                    blockedUserId: userData?.id,
                  };
                  blockUser(data);
                }}
                style={{
                  color: COLORS.SECONDARY_COLOR,
                  fontFamily: FONTS.MONTSERRAT.MEDIUM,
                  fontSize: responsiveFontSize(14),
                  textAlign: 'center',
                  marginVertical: 10,
                  marginHorizontal: 20,
                }}>
                Block @{userData?.userName}
              </Text>
            ) : (
              <View
                style={{
                  marginVertical: 10,
                  marginHorizontal: 20,
                }}>
                <ActivityIndicator />
              </View>
            )}
            <Button
              title="Close"
              containerStyle={{
                marginTop: 30,
              }}
              onPress={onClose}
            />
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default ReportModal;

const styles = StyleSheet.create({
  contentContainerStyle: {},
  container: {},
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
    marginTop: 30,
    marginBottom: 20,
  },
});
