import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import {
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import useTheme from '../../../../theme/hooks/useTheme';
import {useTranslation} from 'react-i18next';
import LOCALES from '../../../../localization/constants';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import {BlurView} from '@react-native-community/blur';
import ForwardArrow from '../../../../assets/icons/svg/ForwardArrow';

type MoreModalType = {
  bottomSheetModalRef: any;
  onEdit: () => void;
  onDelete: () => void;
};

const MoreModal = ({
  bottomSheetModalRef,
  onEdit = () => {},
  onDelete = () => {},
}: MoreModalType) => {
  const {COLORS, FONTS} = useTheme();
  const {t} = useTranslation();
  const initialSnapPoints = useMemo(() => [150, 'CONTENT_HEIGHT'], []);

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
        <View style={styles.container}>
          <Pressable style={[styles.row, styles.section]} onPress={onEdit}>
            <Text
              style={{
                color: COLORS.PRIMARY_TEXT_COLOR,
                fontFamily: FONTS.MONTSERRAT.MEDIUM,
                fontSize: responsiveFontSize(14),
              }}>
              {t(LOCALES.FORUMS.LBL_EDIT_QUESTION)}
            </Text>
            <ForwardArrow />
          </Pressable>
          <View
            style={{
              height: 1,
              width: '100%',
              backgroundColor: COLORS.CHIP_INACTIVE_BORDER_COLOR,
            }}
          />
          <Pressable style={styles.section} onPress={onDelete}>
            <Text
              style={{
                color: COLORS.PRIMARY_TEXT_COLOR,
                fontFamily: FONTS.MONTSERRAT.MEDIUM,
                fontSize: responsiveFontSize(14),
              }}>
              {t(LOCALES.FORUMS.LBL_DELETE_QUESTION)}
            </Text>
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default MoreModal;

const styles = StyleSheet.create({
  contentContainerStyle: {},
  container: {
    marginHorizontal: 20,
    marginBottom: 30,
    marginTop: 10,
  },
  handle: {
    height: 3,
    width: 60,
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  section: {
    paddingVertical: 20,
  },
});
