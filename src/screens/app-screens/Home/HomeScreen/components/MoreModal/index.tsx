import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
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
import ForwardArrow from '../../../../../../assets/icons/svg/ForwardArrow';
import {useAppSelector} from '../../../../../../store';

type MoreModalType = {
  bottomSheetModalRef: any;
  setIsModalOpen: any;
  tourType: string;
  userId: string;
  tourStatus: string;
  onEdit: () => void;
  onDelete: () => void;
  onReport: () => void;
};

const MoreModal = ({
  bottomSheetModalRef,
  tourType,
  userId,
  tourStatus,
  onEdit = () => {},
  onDelete = () => {},
  onReport = () => {},
  setIsModalOpen,
}: MoreModalType) => {
  const {COLORS, FONTS} = useTheme();
  const {t} = useTranslation();
  const {userDetails} = useAppSelector(state => state.auth);
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

  const getTitle = (name: string) => {
    if (name === 'HOLIDAY') {
      return t(LOCALES.HOME.HOLIDAY);
    } else if (name === 'EVENT') {
      return t(LOCALES.HOME.EVENT);
    } else if (name === 'ACTIVITY') {
      return t(LOCALES.HOME.ACTIVITY);
    } else {
      return '';
    }
  };

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
          {userDetails?.id === userId ? (
            <>
              {tourStatus !== 'COMPLETED' && (
                <>
                  <Pressable
                    style={[styles.row, styles.section]}
                    onPress={onEdit}>
                    <Text
                      style={{
                        color: COLORS.PRIMARY_TEXT_COLOR,
                        fontFamily: FONTS.MONTSERRAT.MEDIUM,
                        fontSize: responsiveFontSize(14),
                      }}>
                      {t(LOCALES.HOME.EDIT)} {getTitle(tourType)}
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
                </>
              )}
              <Pressable style={styles.section} onPress={onDelete}>
                <Text
                  style={{
                    color: COLORS.PRIMARY_TEXT_COLOR,
                    fontFamily: FONTS.MONTSERRAT.MEDIUM,
                    fontSize: responsiveFontSize(14),
                  }}>
                  {t(LOCALES.HOME.DELETE)} {getTitle(tourType)}
                </Text>
              </Pressable>
            </>
          ) : (
            <Pressable style={styles.section} onPress={onReport}>
              <Text
                style={{
                  color: COLORS.PRIMARY_TEXT_COLOR,
                  fontFamily: FONTS.MONTSERRAT.MEDIUM,
                  fontSize: responsiveFontSize(14),
                }}>
                {t(LOCALES.PROFILE.REPORT)} {getTitle(tourType)}
              </Text>
            </Pressable>
          )}
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
