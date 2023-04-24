import {Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import useTheme from '../../../../../theme/hooks/useTheme';
import {useTranslation} from 'react-i18next';
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import {responsiveFontSize} from '../../../../../theme/responsiveFontSize';
import LOCALES from '../../../../../localization/constants';
import {useAppDispatch, useAppSelector} from '../../../../../store';
import {BlurView} from '@react-native-community/blur';
import RadioButton from '../../../../../components/RadioButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import {
  modalTypes,
  setCategoryList,
  setCustomModalResult,
} from '../../../../../store/slice/createPostSlice';

type CustomModalType = {
  bottomSheetModalRef: any;
  type: modalTypes | null;
};

const CustomModal = ({bottomSheetModalRef, type}: CustomModalType) => {
  const dispatch = useAppDispatch();
  const {COLORS, FONTS} = useTheme();
  const {t} = useTranslation();
  const {customModalResult, categoryList, editTourData} = useAppSelector(
    state => state.createPost,
  );
  const [lookingForList, setLookingFor] = useState([
    {
      id: 0,
      title: t(LOCALES.CREATE_POST.LBL_MALE),
      value: 'MALE',
      isSelected: editTourData?.lookingFor === 'MALE',
    },
    {
      id: 1,
      title: t(LOCALES.CREATE_POST.LBL_FEMALE),
      value: 'FEMALE',
      isSelected: editTourData?.lookingFor === 'FEMALE',
    },
    {
      id: 2,
      title: t(LOCALES.CREATE_POST.LBL_OTHER),
      value: 'OTHER',
      isSelected: editTourData?.lookingFor === 'OTHER',
    },
    {
      id: 3,
      title: t(LOCALES.CREATE_POST.LBL_ANY),
      value: 'ANY',
      isSelected: editTourData?.lookingFor === 'ANY',
    },
  ]);
  const [difficultyList, setDifficultyList] = useState([
    {
      id: 0,
      title: t(LOCALES.CREATE_POST.LBL_EASY),
      value: 'EASY',
      isSelected: editTourData?.activityDifficulty === 'EASY',
    },
    {
      id: 1,
      title: t(LOCALES.CREATE_POST.LBL_MEDIUM),
      value: 'MEDIUM',
      isSelected: editTourData?.activityDifficulty === 'MEDIUM',
    },
    {
      id: 2,
      title: t(LOCALES.CREATE_POST.LBL_HARD),
      value: 'HARD',
      isSelected: editTourData?.activityDifficulty === 'HARD',
    },
    {
      id: 3,
      title: t(LOCALES.CREATE_POST.LBL_EXPERT),
      value: 'EXPERT',
      isSelected: editTourData?.activityDifficulty === 'EXPERT',
    },
  ]);
  const [workWithTravelList, setWorkWithTravelList] = useState([
    {
      id: 0,
      title: t(LOCALES.CREATE_POST.LBL_YES),
      value: true,
      isSelected: editTourData?.workWithTravel || false,
    },
    {
      id: 1,
      title: t(LOCALES.CREATE_POST.LBL_NO),
      value: false,
      isSelected: !editTourData?.workWithTravel || false,
    },
  ]);

  const [flexibilityList, setFlexibilityList] = useState([
    {
      id: 0,
      title: t(LOCALES.CREATE_POST.LBL_FLEXIBLE_WITH_DATE),
      value: 'FLEXIBLE_WITH_DATE',
      isSelected: editTourData?.flexibility === 'FLEXIBLE_WITH_DATE',
    },
    // {
    //   id: 1,
    //   title: t(LOCALES.CREATE_POST.LBL_FLEXIBLE_WITH_TIME),
    //   value: 'FLEXIBLE_WITH_TIME',
    //   isSelected: editTourData?.flexibility === 'FLEXIBLE_WITH_TIME',
    // },
    {
      id: 1,
      title: t(LOCALES.CREATE_POST.LBL_FLEXIBLE_WITH_BUDGET),
      value: 'FLEXIBLE_WITH_BUDGET',
      isSelected: editTourData?.flexibility === 'FLEXIBLE_WITH_BUDGET',
    },
    // {
    //   id: 2,
    //   title: t(LOCALES.CREATE_POST.LBL_FLEXIBLE_WITH_BOTH_DATE_AND_TIME),
    //   value: 'FLEXIBLE_WITH_BOTH_DATE_AND_TIME',
    //   isSelected:
    //     editTourData?.flexibility === 'FLEXIBLE_WITH_BOTH_DATE_AND_TIME',
    // },
    {
      id: 2,
      title: t(LOCALES.CREATE_POST.LBL_FLEXIBLE_WITH_BOTH_BUDGET_AND_DATE),
      value: 'FLEXIBLE_WITH_BUDGET_AND_DATE',
      isSelected: editTourData?.flexibility === 'FLEXIBLE_WITH_BUDGET_AND_DATE',
    },
    {
      id: 3,
      title: t(LOCALES.CREATE_POST.LBL_NOT_AT_ALL_FLEXIBLE),
      value: 'NOT_AT_ALL_FLEXIBLE',
      isSelected: editTourData?.flexibility === 'NOT_AT_ALL_FLEXIBLE',
    },
  ]);

  const [numberOfMatesList, setNumberOfMatesList] = useState<
    {
      id: number;
      isSelected: boolean;
    }[]
  >([]);

  const {bottom} = useSafeAreaInsets();
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

  useEffect(() => {
    const array = [];
    for (let i = 1; i <= 30; i++) {
      array.push({
        id: i,
        isSelected: editTourData?.matesNumber === i,
      });
    }
    setNumberOfMatesList(array);
  }, [editTourData]);

  const onMatesChange = (id: number) => {
    const arr = numberOfMatesList.map(item => {
      if (item.id === id) {
        item.isSelected = true;
        dispatch(
          setCustomModalResult({
            ...customModalResult,
            ['NUMBER_OF_MATES']: {
              title: item?.id,
              value: item?.id,
            },
          }),
        );
        bottomSheetModalRef?.current?.close();
      } else {
        item.isSelected = false;
      }
      return item;
    });
    setNumberOfMatesList(arr);
  };

  const onFlexibilityChange = (id: number) => {
    const arr = flexibilityList.map(item => {
      if (item.id === id) {
        item.isSelected = true;
        dispatch(
          setCustomModalResult({
            ...customModalResult,
            ['FLEXIBILITY']: {
              title: item?.title,
              value: item?.value,
            },
          }),
        );
        bottomSheetModalRef?.current?.close();
      } else {
        item.isSelected = false;
      }
      return item;
    });
    setFlexibilityList(arr);
  };

  const onLookingForChange = (id: number) => {
    const arr = lookingForList.map(item => {
      if (item.id === id) {
        item.isSelected = true;
        dispatch(
          setCustomModalResult({
            ...customModalResult,
            ['LOOKING_FOR']: {
              title: item?.title,
              value: item?.value,
            },
          }),
        );
        bottomSheetModalRef?.current?.close();
      } else {
        item.isSelected = false;
      }
      return item;
    });
    setLookingFor(arr);
  };

  const onWorkWithTravelChange = (id: number) => {
    const arr = workWithTravelList.map(item => {
      if (item.id === id) {
        item.isSelected = true;
        dispatch(
          setCustomModalResult({
            ...customModalResult,
            ['WORK_WITH_TRAVEL']: {
              title: item?.title,
              value: item?.value,
            },
          }),
        );
        bottomSheetModalRef?.current?.close();
      } else {
        item.isSelected = false;
      }
      return item;
    });
    setWorkWithTravelList(arr);
  };

  const onDifficultyChange = (id: number) => {
    const arr = difficultyList.map(item => {
      if (item.id === id) {
        item.isSelected = true;
        dispatch(
          setCustomModalResult({
            ...customModalResult,
            ['DIFFICULTY']: {
              title: item?.title,
              value: item?.value,
            },
          }),
        );
        bottomSheetModalRef?.current?.close();
      } else {
        item.isSelected = false;
      }
      return item;
    });
    setDifficultyList(arr);
  };
  const onCategoryChange = (id: number) => {
    let array = [...categoryList];
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === id) {
        array[i] = {
          ...array[i],
          isSelected: true,
        };
        dispatch(
          setCustomModalResult({
            ...customModalResult,
            ['CATEGORY']: {
              title: array[i].title,
              value: array[i].value,
            },
          }),
        );
        bottomSheetModalRef?.current?.close();
      } else {
        array[i] = {
          ...array[i],
          isSelected: false,
        };
      }
    }
    dispatch(setCategoryList(array));
  };

  const numberOfMates = () => {
    return (
      <ScrollView
        style={[
          styles.matesContainer,
          {marginBottom: Platform.OS === 'android' ? 20 : bottom},
        ]}
        showsVerticalScrollIndicator={false}>
        {numberOfMatesList.map(numberOfMates => {
          return (
            <Pressable
              key={numberOfMates?.id}
              onPress={() => onMatesChange(numberOfMates?.id)}
              style={styles.mates}>
              <RadioButton
                value={numberOfMates?.isSelected}
                onChange={() => onMatesChange(numberOfMates?.id)}
              />
              <Text
                style={{
                  color: COLORS.PRIMARY_TEXT_COLOR,
                  fontFamily: FONTS.MONTSERRAT.BOLD,
                  marginHorizontal: 20,
                }}>
                {numberOfMates?.id}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    );
  };

  const flexibility = () => {
    return (
      <View
        style={[
          styles.flexibilityContainer,
          {marginBottom: Platform.OS === 'android' ? 20 : bottom},
        ]}>
        {flexibilityList.map(flexibility => {
          return (
            <Pressable
              key={flexibility?.id}
              onPress={() => onFlexibilityChange(flexibility?.id)}
              style={styles.flexibility}>
              <RadioButton
                value={flexibility?.isSelected}
                onChange={() => onFlexibilityChange(flexibility?.id)}
              />
              <Text
                style={{
                  color: COLORS.PRIMARY_TEXT_COLOR,
                  fontFamily: FONTS.MONTSERRAT.BOLD,
                  marginHorizontal: 20,
                }}>
                {flexibility?.title}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  };

  const lookingFor = () => {
    return (
      <View
        style={[
          styles.flexibilityContainer,
          {marginBottom: Platform.OS === 'android' ? 20 : bottom},
        ]}>
        {lookingForList.map(lookingFor => {
          return (
            <Pressable
              key={lookingFor?.id}
              onPress={() => onLookingForChange(lookingFor?.id)}
              style={styles.flexibility}>
              <RadioButton
                value={lookingFor?.isSelected}
                onChange={() => onLookingForChange(lookingFor?.id)}
              />
              <Text
                style={{
                  color: COLORS.PRIMARY_TEXT_COLOR,
                  fontFamily: FONTS.MONTSERRAT.BOLD,
                  marginHorizontal: 20,
                }}>
                {lookingFor?.title}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  };

  const workWithTravel = () => {
    return (
      <View
        style={[
          styles.flexibilityContainer,
          {marginBottom: Platform.OS === 'android' ? 20 : bottom},
        ]}>
        {workWithTravelList.map(item => {
          return (
            <Pressable
              key={item?.id}
              onPress={() => onWorkWithTravelChange(item?.id)}
              style={styles.flexibility}>
              <RadioButton
                value={item?.isSelected}
                onChange={() => onWorkWithTravelChange(item?.id)}
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

  const category = () => {
    return (
      <View
        style={[
          styles.flexibilityContainer,
          {marginBottom: Platform.OS === 'android' ? 20 : bottom},
        ]}>
        {categoryList.map((item: any) => {
          return (
            <Pressable
              key={item?.id}
              onPress={() => onCategoryChange(item?.id)}
              style={styles.flexibility}>
              <RadioButton
                value={item?.isSelected}
                onChange={() => onCategoryChange(item?.id)}
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
  const difficulty = () => {
    return (
      <View
        style={[
          styles.flexibilityContainer,
          {marginBottom: Platform.OS === 'android' ? 20 : bottom},
        ]}>
        {difficultyList.map((item: any) => {
          return (
            <Pressable
              key={item?.id}
              onPress={() => onDifficultyChange(item?.id)}
              style={styles.flexibility}>
              <RadioButton
                value={item?.isSelected}
                onChange={() => onDifficultyChange(item?.id)}
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
      case 'NUMBER_OF_MATES':
        return numberOfMates();
      case 'FLEXIBILITY':
        return flexibility();
      case 'LOOKING_FOR':
        return lookingFor();
      case 'WORK_WITH_TRAVEL':
        return workWithTravel();
      case 'CATEGORY':
        return category();
      case 'DIFFICULTY':
        return difficulty();
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
  matesContainer: {
    marginHorizontal: 20,
    height: 600,
  },
  mates: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  flexibilityContainer: {
    marginHorizontal: 20,
  },
  flexibility: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
});
