import {Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import useTheme from '../../../../../theme/hooks/useTheme';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import {BlurView} from '@react-native-community/blur';
import LOCALES from '../../../../../localization/constants';
import RadioButton from '../../../../../components/RadioButton';
import {useAppSelector} from '../../../../../store';

type CustomModalType = {
  bottomSheetModalRef: any;
  type: 'GENDER' | 'RELATIONSHIP_STATUS' | null;
  setCustomModalResult: any;
  customModalResult: any;
};

const CustomModal = ({
  bottomSheetModalRef,
  type,
  setCustomModalResult,
  customModalResult,
}: CustomModalType) => {
  const {COLORS, FONTS} = useTheme();
  const {t} = useTranslation();
  const {bottom} = useSafeAreaInsets();
  const initialSnapPoints = useMemo(() => [150, 'CONTENT_HEIGHT'], []);
  const {userDetails} = useAppSelector(state => state.auth);

  const [genderList, setGenderList] = useState([
    {
      id: 0,
      title: t(LOCALES.CREATE_POST.LBL_MALE),
      value: 'MALE',
      isSelected: userDetails?.gender === 'MALE',
    },
    {
      id: 1,
      title: t(LOCALES.CREATE_POST.LBL_FEMALE),
      value: 'FEMALE',
      isSelected: userDetails?.gender === 'FEMALE',
    },
    {
      id: 2,
      title: t(LOCALES.CREATE_POST.LBL_OTHER),
      value: 'OTHER',
      isSelected: userDetails?.gender === 'OTHER',
    },
  ]);

  const [relationshipStatusList, setRelationshipStatusList] = useState([
    {
      id: 0,
      title: t(LOCALES.CREATE_POST.LBL_SINGLE),
      value: 'SINGLE',
      isSelected: userDetails?.relationShipStatus === 'SINGLE',
    },
    {
      id: 1,
      title: t(LOCALES.CREATE_POST.LBL_COMMITTED),
      value: 'COMMITTED',
      isSelected: userDetails?.relationShipStatus === 'COMMITTED',
    },
  ]);

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

  const onGenderChange = (id: number) => {
    const arr = genderList.map(item => {
      if (item.id === id) {
        item.isSelected = true;
        setCustomModalResult({
          ...customModalResult,
          ['GENDER']: {
            title: item?.title,
            value: item?.value,
          },
        });
        bottomSheetModalRef?.current?.close();
      } else {
        item.isSelected = false;
      }
      return item;
    });
    setGenderList(arr);
  };

  const onRelationshipStatusChange = (id: number) => {
    const arr = relationshipStatusList.map(item => {
      if (item.id === id) {
        item.isSelected = true;
        setCustomModalResult({
          ...customModalResult,
          ['RELATIONSHIP_STATUS']: {
            title: item?.title,
            value: item?.value,
          },
        });
        bottomSheetModalRef?.current?.close();
      } else {
        item.isSelected = false;
      }
      return item;
    });
    setRelationshipStatusList(arr);
  };

  const gender = () => {
    return (
      <View
        style={[
          styles.genderContainer,
          {marginBottom: Platform.OS === 'android' ? 20 : bottom},
        ]}>
        {genderList.map(item => {
          return (
            <Pressable
              key={item?.id}
              onPress={() => onGenderChange(item?.id)}
              style={styles.gender}>
              <RadioButton
                value={item?.isSelected}
                onChange={() => onGenderChange(item?.id)}
              />
              <Text
                style={{
                  color: COLORS.PRIMARY_TEXT_COLOR,
                  fontFamily: FONTS.MONTSERRAT.BOLD,
                  marginHorizontal: 20,
                }}>
                {item?.title}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  };

  const relationshipStatus = () => {
    return (
      <View
        style={[
          styles.genderContainer,
          {marginBottom: Platform.OS === 'android' ? 20 : bottom},
        ]}>
        {relationshipStatusList.map(item => {
          return (
            <Pressable
              key={item?.id}
              onPress={() => onRelationshipStatusChange(item?.id)}
              style={styles.gender}>
              <RadioButton
                value={item?.isSelected}
                onChange={() => onRelationshipStatusChange(item?.id)}
              />
              <Text
                style={{
                  color: COLORS.PRIMARY_TEXT_COLOR,
                  fontFamily: FONTS.MONTSERRAT.BOLD,
                  marginHorizontal: 20,
                }}>
                {item?.title}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  };

  const getRootView = () => {
    switch (type) {
      case 'GENDER':
        return gender();
      case 'RELATIONSHIP_STATUS':
        return relationshipStatus();
      default:
        return null;
    }
  };

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
      enablePanDownToClose={true}>
      <BottomSheetView
        style={styles.contentContainerStyle}
        onLayout={handleContentLayout}>
        {getRootView()}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  contentContainerStyle: {flex: 1},
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
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 0,
  },
  genderContainer: {
    marginHorizontal: 20,
  },
  gender: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
});
