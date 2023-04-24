import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import useTheme from '../../../../../theme/hooks/useTheme';
import {useTranslation} from 'react-i18next';
import {
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import {responsiveFontSize} from '../../../../../theme/responsiveFontSize';
import LOCALES from '../../../../../localization/constants';
import Holidays from '../../../../../assets/icons/svg/Holidays';
import Events from '../../../../../assets/icons/svg/Events';
import Activities from '../../../../../assets/icons/svg/Activities';
import {useAppDispatch} from '../../../../../store';
import {setSelectedCreatePostOption} from '../../../../../store/slice/createPostSlice';
import {BlurView} from '@react-native-community/blur';

type CreatePostModalType = {
  bottomSheetModalRef: any;
  handleBackNavigation: () => void;
  handleForwardNavigation: () => void;
};

const CreatePostModal = ({
  bottomSheetModalRef,
  handleBackNavigation,
  handleForwardNavigation,
}: CreatePostModalType) => {
  const dispatch = useAppDispatch();
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

  const titleStyle: StyleProp<TextStyle> = useMemo(
    () => [
      {
        fontFamily: FONTS.MONTSERRAT.MEDIUM,
        color: COLORS.PRIMARY_TEXT_COLOR,
        fontSize: responsiveFontSize(11),
        marginTop: 10,
        textAlign: 'center',
      },
    ],
    [FONTS, COLORS],
  );

  const handleOnChange = useCallback((index: number) => {
    if (index === -1) {
      handleBackNavigation();
    }
  }, []);

  const createPostOptions = useMemo(
    () => [
      {
        id: 0,
        title: t(LOCALES.CREATE_POST.LBL_HOLIDAYS),
        icon: <Holidays />,
      },
      {
        id: 1,
        title: t(LOCALES.CREATE_POST.LBL_EVENTS),
        icon: <Events />,
      },
      {
        id: 2,
        title: t(LOCALES.CREATE_POST.LBL_ACTIVITIES),
        icon: <Activities />,
      },
    ],
    [],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      backgroundStyle={{backgroundColor: COLORS.MODAL_BACKGROUND_COLOR}}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      backdropComponent={renderBackdrop}
      handleComponent={handleComponent}
      enablePanDownToClose={true}
      onChange={handleOnChange}>
      <BottomSheetView
        style={styles.contentContainerStyle}
        onLayout={handleContentLayout}>
        <View style={styles.container}>
          <Text
            style={[
              styles.create,
              {
                fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                color: COLORS.PRIMARY_TEXT_COLOR,
              },
            ]}>
            {t(LOCALES.CREATE_POST.LBL_CREATE)}
          </Text>
          <View style={styles.row}>
            {createPostOptions?.map(item => (
              <View key={item?.id}>
                <Pressable
                  onPress={() => {
                    bottomSheetModalRef?.current?.close();
                    dispatch(
                      setSelectedCreatePostOption({
                        id: item?.id,
                        title: item?.title,
                      }),
                    );
                    handleForwardNavigation();
                  }}
                  style={[styles.icon, {borderColor: COLORS.SECONDARY_COLOR}]}>
                  {item?.icon}
                </Pressable>
                <Text style={titleStyle}>{item?.title}</Text>
              </View>
            ))}
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default CreatePostModal;

const styles = StyleSheet.create({
  contentContainerStyle: {},
  container: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  handleContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handle: {
    height: 3,
    width: 60,
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 15,
  },
  create: {
    fontSize: responsiveFontSize(16),
    marginTop: 12,
    alignSelf: 'center',
    marginBottom: 30,
  },
  icon: {
    height: 90,
    width: 90,
    borderRadius: 28,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#BB85BB14',
    marginHorizontal: 13,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
