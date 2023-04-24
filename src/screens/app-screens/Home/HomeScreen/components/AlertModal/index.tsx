import {Linking, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import {
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import useTheme from '../../../../../../theme/hooks/useTheme';
import {CALL_ICON} from '../../../../../../assets/icons/svg';
import {useTranslation} from 'react-i18next';
import LOCALES from '../../../../../../localization/constants';
import {responsiveFontSize} from '../../../../../../theme/responsiveFontSize';
import {BlurView} from '@react-native-community/blur';

type AlertModalType = {
  bottomSheetModalRef: any;
  setIsModalOpen: any;
  SOSList: any[];
};

const AlertModal = ({
  bottomSheetModalRef,
  SOSList,
  setIsModalOpen,
}: AlertModalType) => {
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

  const title = useMemo(
    () => [
      styles.title,
      {
        color: COLORS.PRIMARY_TEXT_COLOR,
        fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
      },
    ],
    [COLORS, FONTS],
  );

  const firstLabel = useMemo(
    () => [
      {
        color: COLORS.PRIMARY_TEXT_COLOR,
        fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
        fontSize: responsiveFontSize(16),
      },
    ],
    [COLORS, FONTS],
  );

  const secondLabel = useMemo(
    () => [
      {
        color: COLORS.ALERT_TEXT_COLOR,
        fontFamily: FONTS.MONTSERRAT.REGULAR,
        fontSize: responsiveFontSize(14),
        marginTop: 7,
      },
    ],
    [COLORS, FONTS],
  );

  const handleCallPress = useCallback((phoneNumber: number) => {
    Linking.openURL(`tel:${phoneNumber}`);
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
      enablePanDownToClose={true}
      onChange={(index: number) => setIsModalOpen(!(index < 1))}>
      <BottomSheetView
        style={[styles.contentContainerStyle]}
        onLayout={handleContentLayout}>
        <View>
          <Text style={title}>{t(LOCALES.HOME.ALERT_MODAL_TEXT)}</Text>
          {SOSList.length > 0 ? (
            <View style={styles.labelContainer}>
              {SOSList?.map((item: any, index: number) => (
                <View style={styles.row} key={index}>
                  <View>
                    <Text style={firstLabel}>{item?.name}</Text>
                    <Text style={secondLabel}>{item?.number}</Text>
                  </View>
                  <Pressable
                    onPress={() => handleCallPress(item?.number)}
                    style={[
                      styles.icon,
                      {backgroundColor: COLORS.ALERT_BACKGROUND_COLOR},
                    ]}>
                    <CALL_ICON />
                  </Pressable>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.nodata}>
              <Text
                style={{
                  color: COLORS.PRIMARY_TEXT_COLOR,
                  fontFamily: FONTS.MONTSERRAT.BOLD,
                  textAlign: 'center',
                }}>
                {t(LOCALES.SUCCESS.LBL_NO_DATA)}
              </Text>
            </View>
          )}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default AlertModal;

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
  title: {
    fontSize: responsiveFontSize(14),
    alignSelf: 'center',
  },
  labelContainer: {
    marginHorizontal: 40,
    marginTop: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  icon: {
    height: 43,
    width: 43,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 0,
  },
  nodata: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
