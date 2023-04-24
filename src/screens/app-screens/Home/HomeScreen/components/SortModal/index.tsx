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
import RadioButton from '../../../../../../components/RadioButton';
import {BlurView} from '@react-native-community/blur';

type SortModalType = {
  bottomSheetModalRef: any;
  setIsModalOpen: any;
  setFilterData: any;
  filterData: any;
};

const SortModal = ({
  bottomSheetModalRef,
  setFilterData,
  filterData,
  setIsModalOpen,
}: SortModalType) => {
  const {COLORS, FONTS} = useTheme();
  const {t} = useTranslation();
  const initialSnapPoints = useMemo(() => [150, 'CONTENT_HEIGHT'], []);
  const SortByOptions = useMemo(
    () => [
      {
        id: 1,
        title: t(LOCALES.HOME.FILTER_OPTION_6),
        isSelected: false,
        value: 'asc',
      },
      {
        id: 2,
        title: t(LOCALES.HOME.FILTER_OPTION_7),
        isSelected: true,
        value: 'desc',
      },
    ],
    [],
  );

  const [sortByOptions, setSortByOptions] = useState(SortByOptions);

  const handleSortByOptionsPress = useCallback(
    (id: number) => {
      const arr = sortByOptions.map(item => {
        if (item.id === id) {
          item.isSelected = true;
          setFilterData({
            ...filterData,
            sortMode: item.value,
          });
          bottomSheetModalRef?.current?.close();
        } else {
          item.isSelected = false;
        }
        return item;
      });
      setSortByOptions(arr);
    },
    [filterData],
  );

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
      enablePanDownToClose={true}
      onChange={(index: number) => setIsModalOpen(!(index < 1))}>
      <BottomSheetView
        style={[styles.contentContainerStyle]}
        onLayout={handleContentLayout}>
        <View style={styles.container}>
          <Text
            style={[
              styles.sort,
              {
                fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                color: COLORS.PRIMARY_TEXT_COLOR,
              },
            ]}>
            {t(LOCALES.HOME.SORT)}
          </Text>
          {sortByOptions.map(item => {
            return (
              <Pressable
                onPress={() => handleSortByOptionsPress(item.id)}
                key={item.id}
                style={styles.row}>
                <Text
                  style={[
                    styles.option,
                    {
                      fontFamily: FONTS.MONTSERRAT.REGULAR,
                      color: COLORS.PRIMARY_TEXT_COLOR,
                    },
                  ]}>
                  {item.title}
                </Text>
                <RadioButton
                  value={item.isSelected}
                  onChange={() => handleSortByOptionsPress(item.id)}
                />
              </Pressable>
            );
          })}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default SortModal;

const styles = StyleSheet.create({
  contentContainerStyle: {},
  container: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  handle: {
    height: 3,
    width: 60,
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 15,
  },
  sort: {
    fontSize: responsiveFontSize(14),
    marginTop: 12,
    alignSelf: 'center',
    marginBottom: 30,
  },
  option: {
    fontSize: responsiveFontSize(14),
    paddingVertical: 10,
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
});
