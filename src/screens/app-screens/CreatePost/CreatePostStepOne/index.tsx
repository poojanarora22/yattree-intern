import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {CreatePostStepOneScreenProps} from '../../../../types/navigation/appTypes';
import WrapperScreen from '../WrapperScreen';
import LOCALES from '../../../../localization/constants';
import useTheme from '../../../../theme/hooks/useTheme';
import TextField from '../../../../components/TextField';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import Chip from '../../../../components/Chip';
import LocationWithStroke from '../../../../assets/icons/svg/LocationWithStroke';
import Picker from '../../../../components/Picker';
import UploadPhotos from '../components/UploadPhotos';
import {useAppDispatch, useAppSelector} from '../../../../store';
import Add from '../../../../assets/icons/svg/Add';
import Close from '../../../../assets/icons/svg/Close';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import CustomModal from '../components/CustomModal';
import {
  modalTypes,
  setCategoryList,
  setCustomModalResult,
  setDestinationList,
  setDestinationPhotoIdsList,
  setEditTourData,
  setStepOneData,
} from '../../../../store/slice/createPostSlice';
import axios from 'axios';
import {URL, BASE_URL} from '../../../../constants/URLS';
import {getTokens, getVerifiedToken} from '../../../../utilities/token';
import {setFileOnServer} from '../../../../utilities/uploadDocument';
import {appAlert} from '../../../../components/appAlert';
import {useApi} from '../../../../hooks/useApi';
import moment from 'moment';

const CreatePostStepOne = ({navigation}: CreatePostStepOneScreenProps) => {
  const {COLORS, FONTS} = useTheme();
  const {t} = useTranslation();
  const {customModalResult, editTourData, editTourId} = useAppSelector(
    state => state.createPost,
  );
  const CustomModalRef = useRef<BottomSheetModal>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [matesNumber, setMatesNumber] = useState(0);
  const [description, setDescription] = useState('');
  const [modalType, setModalType] = useState<modalTypes | null>(null);
  const dispatch = useAppDispatch();

  const titleStyle = useMemo(
    () => [
      [
        styles.title,
        {
          color: COLORS.SECONDARY_TEXT_COLOR,
          fontFamily: FONTS.MONTSERRAT.REGULAR,
        },
      ],
    ],
    [],
  );
  const {selectedCreatePostOption, destinationList, destinationPhotoList} =
    useAppSelector(state => state.createPost);

  const isHolidays = useMemo(
    () =>
      selectedCreatePostOption?.title === t(LOCALES.CREATE_POST.LBL_HOLIDAYS),
    [selectedCreatePostOption, LOCALES],
  );

  const isEvents = useMemo(
    () => selectedCreatePostOption?.title === t(LOCALES.CREATE_POST.LBL_EVENTS),
    [selectedCreatePostOption, LOCALES],
  );

  const isActivities = useMemo(
    () =>
      selectedCreatePostOption?.title === t(LOCALES.CREATE_POST.LBL_ACTIVITIES),
    [selectedCreatePostOption, LOCALES],
  );

  const handleCustomModalPress = useCallback(() => {
    CustomModalRef.current?.present();
  }, []);

  const isAllFieldsValid = () => {
    if (!title.trim()) {
      appAlert({
        title: t(LOCALES.ERROR.LBL_ERROR),
        message: t(LOCALES.ERROR.LBL_TITLE_ERROR),
      });
    } else if (destinationList?.length === 0) {
      appAlert({
        title: t(LOCALES.ERROR.LBL_ERROR),
        message: t(LOCALES.ERROR.LBL_DESTINATION_ERROR),
      });
    } else if (matesNumber === 0) {
      appAlert({
        title: t(LOCALES.ERROR.LBL_ERROR),
        message: t(LOCALES.ERROR.LBL_MATES_ERROR),
      });
    } else if (isActivities && !customModalResult?.CATEGORY?.value) {
      appAlert({
        title: t(LOCALES.ERROR.LBL_ERROR),
        message: t(LOCALES.ERROR.LBL_CATEGORY_ERROR),
      });
    } else if (!minBudget.trim()) {
      appAlert({
        title: t(LOCALES.ERROR.LBL_ERROR),
        message: t(LOCALES.ERROR.LBL_MIN_BUDGET_ERROR),
      });
    } else if (!maxBudget.trim()) {
      appAlert({
        title: t(LOCALES.ERROR.LBL_ERROR),
        message: t(LOCALES.ERROR.LBL_MAX_BUDGET_ERROR),
      });
    } else if (parseInt(minBudget) > parseInt(maxBudget)) {
      appAlert({
        title: t(LOCALES.ERROR.LBL_ERROR),
        message: t(LOCALES.ERROR.LBL_VALID_MAX_BUDGET_ERROR),
      });
    } else if (!customModalResult?.FLEXIBILITY?.value) {
      appAlert({
        title: t(LOCALES.ERROR.LBL_ERROR),
        message: t(LOCALES.ERROR.LBL_FLEXIBILITY_ERROR),
      });
    } else if (!description.trim()) {
      appAlert({
        title: t(LOCALES.ERROR.LBL_ERROR),
        message: t(LOCALES.ERROR.LBL_DESCRIPTION_ERROR),
      });
    } else if (destinationPhotoList?.length === 0) {
      appAlert({
        title: t(LOCALES.ERROR.LBL_ERROR),
        message: t(LOCALES.ERROR.LBL_PHOTO_ERROR),
      });
    } else {
      return true;
    }
  };

  const [
    getCategoryList,
    categoryListResponse,
    categoryListError,
    isCategoryListLoading,
  ] = useApi({
    url: isEvents ? URL.EVENT_CATEGORY : URL.ACTIVITY_CATEGORY,
    method: 'GET',
  });

  useEffect(() => {
    if (!isHolidays) {
      getCategoryList();
    }
  }, [isHolidays]);

  useEffect(() => {
    if (categoryListResponse) {
      if (categoryListResponse?.statusCode === 200) {
        const array: any = [];
        categoryListResponse?.data?.subCategories?.map(
          (category: any, index: number) => {
            array.push({
              id: index,
              title: category?.subCategoryName,
              value: category?.id,
              isSelected: editTourData?.subCategoryId === category?.id,
            });
          },
        );
        dispatch(setCategoryList(array));
      }
    }
  }, [categoryListResponse, editTourData]);

  useEffect(() => {
    if (categoryListError) {
      if (categoryListError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: categoryListError?.message,
        });
      }
    }
  }, [categoryListError]);

  const onContinue = async () => {
    if (!isAllFieldsValid()) return;
    setLoading(true);
    const tokens = await getTokens();
    const newTokens = await getVerifiedToken(tokens);
    const options = {
      headers: {
        Accept: '*/*',
        'Content-Type': 'multipart/form-data',
        'x-client-id': '2a4ryDvb8ZZ3C3D2',
        'x-auth-token': newTokens?.accessToken,
      },
    };
    const idArrayList: any = [];
    await Promise.all(
      destinationPhotoList.map(async (item: any) => {
        const body = {
          fileName: item?.fileName,
          fileModule: item?.fileModule,
          mimeType: item?.mimeType,
        };
        const response = await axios.post(
          BASE_URL + URL.GET_UPLOAD_URL,
          body,
          options,
        );
        await setFileOnServer(response?.data?.data?.url, item?.uri);
        idArrayList.push(response?.data?.data?.fileId);
      }),
    );
    dispatch(setDestinationPhotoIdsList(idArrayList));
    dispatch(
      setStepOneData({
        title,
        minBudget,
        maxBudget,
        description,
        matesNumber,
      }),
    );
    navigation.navigate('CreatePostStepTwo');
    setLoading(false);
  };

  useEffect(() => {
    if (editTourData) {
      setTitle(editTourData?.title);
      setMinBudget(editTourData?.minBudget?.value?.toString());
      setMaxBudget(editTourData?.maxBudget?.value?.toString());
      setDescription(editTourData?.description);
      setMatesNumber(editTourData?.matesNumber);
      if (editTourData?.destinations?.length > 0) {
        let array: any = [];
        editTourData?.destinations?.map((destination: any, index: number) => {
          array.push({
            address: destination?.address,
            latitude: destination?.latitude,
            longitude: destination?.longitude,
            city: destination?.city,
            state: destination?.state,
            country: destination?.country,
            zipcode: destination?.zipcode,
            startDate: destination?.startDate,
            displayStartDate: moment(destination?.startDate).format(
              'ddd, DD MMM',
            ),
            displayEndDate: moment(destination?.endDate).format('ddd, DD MMM'),
            endDate: destination?.endDate,
            startTime: destination?.startTime,
            endTime: destination?.endTime,
            id: index,
          });
        });
        dispatch(setDestinationList(array));
      }
      dispatch(
        setCustomModalResult({
          ...customModalResult,
          ['FLEXIBILITY']: {
            title: getFlexibility(editTourData?.flexibility),
            value: editTourData?.flexibility,
          },
          ['CATEGORY']: {
            title: editTourData?.subCategory?.subCategoryName,
            value: editTourData?.subCategoryId,
          },
        }),
      );
    }
  }, [editTourData]);

  const [
    getTourDetails,
    tourDetailsResponse,
    tourDetailsError,
    isTourDetailsLoading,
  ] = useApi({
    url: URL.GET_TOUR_DETAIL + editTourId,
    method: 'GET',
  });

  useEffect(() => {
    if (tourDetailsResponse) {
      if (tourDetailsResponse?.statusCode === 200) {
        dispatch(setEditTourData(tourDetailsResponse?.data?.tour));
      }
    }
  }, [tourDetailsResponse]);

  useEffect(() => {
    if (tourDetailsError) {
      if (tourDetailsError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: tourDetailsError?.message,
        });
      }
    }
  }, [tourDetailsError]);

  useEffect(() => {
    if (editTourId) {
      getTourDetails();
    }
  }, [editTourId]);

  const getFlexibility = (name: string) => {
    if (name === 'FLEXIBLE_WITH_DATE') {
      return t(LOCALES.CREATE_POST.LBL_FLEXIBLE_WITH_DATE);
    } else if (name === 'FLEXIBLE_WITH_TIME') {
      return t(LOCALES.CREATE_POST.LBL_FLEXIBLE_WITH_TIME);
    } else if (name === 'FLEXIBLE_WITH_BOTH_DATE_AND_TIME') {
      return t(LOCALES.CREATE_POST.LBL_FLEXIBLE_WITH_BOTH_DATE_AND_TIME);
    } else if (name === 'NOT_AT_ALL_FLEXIBLE') {
      return t(LOCALES.CREATE_POST.LBL_NOT_AT_ALL_FLEXIBLE);
    } else if (name === 'FLEXIBLE_WITH_BUDGET') {
      return t(LOCALES.CREATE_POST.LBL_FLEXIBLE_WITH_BUDGET);
    } else if (name === 'FLEXIBLE_WITH_BUDGET_AND_DATE') {
      return t(LOCALES.CREATE_POST.LBL_FLEXIBLE_WITH_BOTH_BUDGET_AND_DATE);
    } else {
      return '';
    }
  };

  return (
    <WrapperScreen
      stepNumber={1}
      onBackPress={() => navigation.goBack()}
      loading={loading}
      disabled={loading}
      onContinue={onContinue}>
      <View style={styles.container}>
        <Text style={titleStyle}>{t(LOCALES.CREATE_POST.LBL_TITLE)}</Text>
        <TextField value={title} onChangeText={setTitle} />
        {destinationList?.length > 0 ? (
          <>
            <Text style={titleStyle}>
              {t(LOCALES.CREATE_POST.LBL_DESTINATION)}
            </Text>
            <View
              style={[
                styles.destinationListParent,
                {
                  backgroundColor: COLORS.PRIMARY_CHIP_COLOR,
                  borderColor: COLORS.CHIP_INACTIVE_BORDER_COLOR,
                },
              ]}>
              {destinationList.map((item: any, index) => (
                <View
                  key={index}
                  style={[
                    styles.destinationListContainer,
                    {
                      backgroundColor: COLORS.PRIMARY_CHIP_COLOR,
                      borderColor: COLORS.CHIP_INACTIVE_BORDER_COLOR,
                    },
                  ]}>
                  <View style={{width: '80%'}}>
                    <Text
                      style={{
                        color: COLORS.PRIMARY_TEXT_COLOR,
                        fontFamily: FONTS.MONTSERRAT.MEDIUM,
                        fontSize: responsiveFontSize(14),
                        marginBottom: 5,
                      }}>
                      {isHolidays
                        ? item?.city
                          ? item?.city + ', ' + item?.country
                          : item?.country
                        : item?.address}
                    </Text>
                    <Text
                      style={{
                        color: COLORS.SECONDARY_TEXT_COLOR,
                        fontFamily: FONTS.MONTSERRAT.REGULAR,
                        fontSize: responsiveFontSize(12),
                      }}>
                      {item?.displayStartDate} {t(LOCALES.CREATE_POST.LBL_TO)}{' '}
                      {item?.displayEndDate}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => {
                      dispatch(
                        setDestinationList(
                          destinationList.filter(
                            (e: any) => e?.id !== item?.id,
                          ),
                        ),
                      );
                    }}>
                    <Close />
                  </Pressable>
                </View>
              ))}
              <Chip
                onPress={() => navigation.navigate('ChooseDestination')}
                title={t(LOCALES.CREATE_POST.LBL_ADD_MORE)}
                leftIcon={<Add />}
                customLabelStyle={{flex: 0, marginLeft: 12}}
              />
            </View>
          </>
        ) : (
          <Chip
            onPress={() => navigation.navigate('ChooseDestination')}
            title={t(LOCALES.CREATE_POST.LBL_DESTINATION)}
            leftIcon={<LocationWithStroke color={COLORS.TERTIARY_COLOR} />}
            containerStyle={{marginBottom: 30}}
            customLabelStyle={{flex: 0, marginLeft: 12}}
          />
        )}
        <Text style={titleStyle}>
          {t(LOCALES.CREATE_POST.LBL_NUMBER_OF_MATES)}
        </Text>
        {/* <Picker
          value={customModalResult?.NUMBER_OF_MATES?.title}
          onPress={() => {
            setModalType('NUMBER_OF_MATES');
            handleCustomModalPress();
          }}
        /> */}
        <View style={styles.row}>
          <Pressable
            disabled={matesNumber === 0}
            onPress={() => {
              setMatesNumber(matesNumber - 1);
            }}
            style={[
              styles.plusIcon,
              {
                borderColor: COLORS.INPUT_INACTIVE_BORDER_COLOR,
                backgroundColor: COLORS.INPUT_BACKGROUND_COLOR,
              },
            ]}>
            <Text
              style={{
                color: COLORS.PRIMARY_TEXT_COLOR,
                fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                fontSize: responsiveFontSize(24),
              }}>
              -
            </Text>
          </Pressable>

          <View
            style={[
              styles.matesNumber,
              {
                borderColor: COLORS.INPUT_INACTIVE_BORDER_COLOR,
                backgroundColor: COLORS.INPUT_BACKGROUND_COLOR,
              },
            ]}>
            <Text
              style={{
                color: COLORS.INPUT_TEXT_COLOR,
                fontFamily: FONTS.MONTSERRAT.REGULAR,
                fontSize: responsiveFontSize(16),
              }}>
              {matesNumber}
            </Text>
          </View>

          <Pressable
            disabled={matesNumber === 30}
            onPress={() => {
              setMatesNumber(matesNumber + 1);
            }}
            style={[
              styles.plusIcon,
              {
                borderColor: COLORS.INPUT_INACTIVE_BORDER_COLOR,
                backgroundColor: COLORS.INPUT_BACKGROUND_COLOR,
              },
            ]}>
            <Text
              style={{
                color: COLORS.PRIMARY_TEXT_COLOR,
                fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                fontSize: responsiveFontSize(24),
              }}>
              +
            </Text>
          </Pressable>
        </View>

        {selectedCreatePostOption?.title ===
          t(LOCALES.CREATE_POST.LBL_ACTIVITIES) && (
          <>
            <Text style={[titleStyle, {marginTop: 30}]}>
              {t(LOCALES.CREATE_POST.LBL_CATEGORIES)}
            </Text>
            <Picker
              value={customModalResult?.CATEGORY?.title}
              onPress={() => {
                setModalType('CATEGORY');
                handleCustomModalPress();
              }}
            />
          </>
        )}
        <View style={styles.row}>
          <View style={styles.budget}>
            <Text style={titleStyle}>
              {t(LOCALES.CREATE_POST.LBL_MIN_BUDGET)}
            </Text>
            <TextField
              value={minBudget}
              onChangeText={setMinBudget}
              keyboardType="number-pad"
              editable={!loading}
              leftIcon={
                <Text
                  style={{
                    color: COLORS.PRIMARY_TEXT_COLOR,
                    fontSize: responsiveFontSize(16),
                    marginRight: 6,
                  }}>
                  £
                </Text>
              }
            />
          </View>
          <View style={styles.budget}>
            <Text style={titleStyle}>
              {t(LOCALES.CREATE_POST.LBL_MAX_BUDGET)}
            </Text>
            <TextField
              leftIcon={
                <Text
                  style={{
                    color: COLORS.PRIMARY_TEXT_COLOR,
                    fontSize: responsiveFontSize(16),
                    marginRight: 6,
                  }}>
                  £
                </Text>
              }
              value={maxBudget}
              onChangeText={setMaxBudget}
              keyboardType="number-pad"
              editable={!loading}
            />
          </View>
        </View>
        <Text style={titleStyle}>{t(LOCALES.CREATE_POST.LBL_FLEXIBILITY)}</Text>
        <Picker
          containerStyle={{marginBottom: 30}}
          value={customModalResult?.FLEXIBILITY?.title}
          onPress={() => {
            if (!loading) {
              setModalType('FLEXIBILITY');
              handleCustomModalPress();
            }
          }}
        />
        <Text style={titleStyle}>{t(LOCALES.CREATE_POST.LBL_DESCRIPTION)}</Text>
        <TextField
          containerStyle={{height: 145, paddingVertical: 10}}
          textInputStyle={{height: '100%'}}
          multiline={true}
          value={description}
          onChangeText={setDescription}
          editable={!loading}
        />
        <UploadPhotos disabled={loading} />
      </View>
      {!isTourDetailsLoading && (
        <CustomModal bottomSheetModalRef={CustomModalRef} type={modalType} />
      )}
    </WrapperScreen>
  );
};

export default CreatePostStepOne;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginHorizontal: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: responsiveFontSize(14),
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budget: {
    width: '45%',
    marginTop: 30,
  },
  destinationListParent: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 13,
    marginBottom: 30,
  },
  destinationListContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 13,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plusIcon: {
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  matesNumber: {
    flex: 1,
    height: 50,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    borderWidth: 1,
  },
});
