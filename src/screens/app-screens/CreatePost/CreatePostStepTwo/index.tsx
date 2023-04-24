import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import WrapperScreen from '../WrapperScreen';
import {CreatePostStepTwoScreenProps} from '../../../../types/navigation/appTypes';
import LOCALES from '../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import useTheme from '../../../../theme/hooks/useTheme';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import TextField from '../../../../components/TextField';
import Picker from '../../../../components/Picker';
import {useAppDispatch, useAppSelector} from '../../../../store';
import Chip from '../../../../components/Chip';
import Hotel from '../../../../assets/icons/svg/Hotel';
import Hostel from '../../../../assets/icons/svg/Hostel';
import Motel from '../../../../assets/icons/svg/Motel';
import Camping from '../../../../assets/icons/svg/Camping';
import CheckBox from '../../../../components/CheckBox';
import PICKER_ICON from '../../../../assets/icons/svg/DropdownArrow';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import LanguagesModal from '../components/LanguagesModal';
import CustomModal from '../components/CustomModal';
import {
  modalTypes,
  setCustomModalResult,
} from '../../../../store/slice/createPostSlice';
import {useApi} from '../../../../hooks/useApi';
import {URL} from '../../../../constants/URLS';
import {appAlert} from '../../../../components/appAlert';

const CreatePostStepTwo = ({navigation}: CreatePostStepTwoScreenProps) => {
  const {COLORS, FONTS} = useTheme();
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const languagesModalRef = useRef<BottomSheetModal>(null);
  const CustomModalRef = useRef<BottomSheetModal>(null);
  const [itinerary, setItinerary] = useState('');
  const [gearList, setGearList] = useState('');
  const [notes, setNotes] = useState('');
  const [modalType, setModalType] = useState<modalTypes | null>(null);
  const {
    customModalResult,
    stepOneData,
    destinationList,
    editTourData,
    editTourId,
  } = useAppSelector(state => state.createPost);

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
    [COLORS, FONTS],
  );
  const {selectedCreatePostOption, destinationPhotoIdsList} = useAppSelector(
    state => state.createPost,
  );

  const isActivities = useMemo(
    () =>
      selectedCreatePostOption?.title === t(LOCALES.CREATE_POST.LBL_ACTIVITIES),
    [selectedCreatePostOption, LOCALES],
  );

  const isHolidays = useMemo(
    () =>
      selectedCreatePostOption?.title === t(LOCALES.CREATE_POST.LBL_HOLIDAYS),
    [selectedCreatePostOption, LOCALES],
  );

  const isEvents = useMemo(
    () => selectedCreatePostOption?.title === t(LOCALES.CREATE_POST.LBL_EVENTS),
    [selectedCreatePostOption, LOCALES],
  );

  const DATA = useMemo(
    () => [
      {
        id: 0,
        title: t(LOCALES.CREATE_POST.LBL_HOTEL),
        value: 'HOTEL',
        isSelected: editTourData?.accommodation?.includes('HOTEL'),
        icon: <Hotel />,
        selectedIcon: <Hotel color={COLORS.PRIMARY_COLOR} />,
      },
      {
        id: 1,
        title: t(LOCALES.CREATE_POST.LBL_HOSTEL),
        value: 'HOSTEL',
        isSelected: editTourData?.accommodation?.includes('HOSTEL'),
        icon: <Hostel />,
        selectedIcon: <Hostel color={COLORS.PRIMARY_COLOR} />,
      },
      {
        id: 2,
        title: t(LOCALES.CREATE_POST.LBL_MOTEL),
        value: 'MOTEL',
        isSelected: editTourData?.accommodation?.includes('MOTEL'),
        icon: <Motel />,
        selectedIcon: <Motel color={COLORS.PRIMARY_COLOR} />,
      },
      {
        id: 3,
        title: t(LOCALES.CREATE_POST.LBL_CAMPING),
        value: 'CAMPING',
        isSelected: editTourData?.accommodation?.includes('CAMPING'),
        icon: <Camping />,
        selectedIcon: <Camping color={COLORS.PRIMARY_COLOR} />,
      },
    ],
    [editTourData],
  );
  const [language, setLanguage] = useState([
    {
      id: 0,
      name: 'English',
      value: 'ENGLISH',
      isSelected: false,
    },
    {
      id: 1,
      name: 'Mandarin Chinese',
      value: 'MANDARIN_CHINESE',
      isSelected: false,
    },
    {
      id: 2,
      name: 'Spanish',
      value: 'SPANISH',
      isSelected: false,
    },
    {
      id: 3,
      name: 'Hindi',
      value: 'HINDI',
      isSelected: false,
    },
    {
      id: 4,
      name: 'Urdu',
      value: 'URDU',
      isSelected: false,
    },
    {
      id: 5,
      name: 'Arabic',
      value: 'ARABIC',
      isSelected: false,
    },
    {
      id: 6,
      name: 'Malay',
      value: 'MALAY',
      isSelected: false,
    },
    {
      id: 7,
      name: 'Russian',
      value: 'RUSSIAN',
      isSelected: false,
    },
    {
      id: 8,
      name: 'Bengali',
      value: 'BENGALI',
      isSelected: false,
    },
    {
      id: 9,
      name: 'Portuguese',
      value: 'PORTUGUESE',
      isSelected: false,
    },
    {
      id: 10,
      name: 'French',
      value: 'FRENCH',
      isSelected: false,
    },
    {
      id: 11,
      name: 'Hausa',
      value: 'HAUSA',
      isSelected: false,
    },
    {
      id: 12,
      name: 'Punjabi',
      value: 'PUNJABI',
      isSelected: false,
    },
    {
      id: 13,
      name: 'German',
      value: 'GERMAN',
      isSelected: false,
    },
    {
      id: 14,
      name: 'Japanese',
      value: 'JAPANESE',
      isSelected: false,
    },
    {
      id: 15,
      name: 'Persian',
      value: 'PERSIAN',
      isSelected: false,
    },
    {
      id: 16,
      name: 'Swahili',
      value: 'SWAHILI',
      isSelected: false,
    },
    {
      id: 17,
      name: 'Vietnamese',
      value: 'VIETNAMESE',
      isSelected: false,
    },
    {
      id: 18,
      name: 'Telugu',
      value: 'TELUGU',
      isSelected: false,
    },
    {
      id: 19,
      name: 'Italian',
      value: 'ITALIAN',
      isSelected: false,
    },
    {
      id: 20,
      name: 'Javanese',
      value: 'JAVANESE',
      isSelected: false,
    },
    {
      id: 21,
      name: 'Wu Chinese',
      value: 'WU_CHINESE',
      isSelected: false,
    },
    {
      id: 22,
      name: 'Korean',
      value: 'KOREAN',
      isSelected: false,
    },
    {
      id: 23,
      name: 'Tamil',
      value: 'TAMIL',
      isSelected: false,
    },
    {
      id: 24,
      name: 'Marathi',
      value: 'MARATHI',
      isSelected: false,
    },
    {
      id: 25,
      name: 'Yue Chinese',
      value: 'YUE_CHINESE',
      isSelected: false,
    },
    {
      id: 26,
      name: 'Dutch',
      value: 'DUTCH',
      isSelected: false,
    },
    {
      id: 27,
      name: 'Turkish',
      value: 'TURKISH',
      isSelected: false,
    },
    {
      id: 28,
      name: 'Indonesian',
      value: 'INDONESIAN',
      isSelected: false,
    },
  ]);

  const [accommodationOptions, setAccommodationOptions] = useState(DATA);

  const handleChipPress = useCallback((id: number) => {
    const arr = accommodationOptions.map(item => {
      if (item.id === id) {
        item.isSelected = !item.isSelected;
      }
      return item;
    });
    setAccommodationOptions(arr);
  }, []);

  const handleLanguagesChange = useCallback((id: number) => {
    const arr = language.map(item => {
      if (item.id === id) {
        item.isSelected = !item.isSelected;
      }
      return item;
    });
    setLanguage(arr);
  }, []);

  const handleLanguagesModalPress = useCallback(() => {
    languagesModalRef.current?.present();
  }, []);

  const handleCustomModalPress = useCallback(() => {
    CustomModalRef.current?.present();
  }, []);

  const [addTour, addTourResponse, addTourError, isAddTourLoading] = useApi({
    url: editTourId ? URL.ADD_TOUR + '/' + editTourId : URL.ADD_TOUR,
    method: editTourId ? 'PUT' : 'POST',
  });

  useEffect(() => {
    if (addTourResponse) {
      if (addTourResponse?.statusCode === 200) {
        let message = '';
        if (isHolidays) {
          message = editTourId
            ? t(LOCALES.SUCCESS.LBL_HOLIDAY_UPDATE_SUCCESS)
            : t(LOCALES.SUCCESS.LBL_HOLIDAY_SUCCESS);
        } else if (isEvents) {
          message = editTourId
            ? t(LOCALES.SUCCESS.LBL_EVENT_UPDATE_SUCCESS)
            : t(LOCALES.SUCCESS.LBL_EVENT_SUCCESS);
        } else if (isActivities) {
          message = editTourId
            ? t(LOCALES.SUCCESS.LBL_ACTIVITY_UPDATE_SUCCESS)
            : t(LOCALES.SUCCESS.LBL_ACTIVITY_SUCCESS);
        }
        appAlert({
          title: t(LOCALES.SUCCESS.LBL_SUCCESS),
          message: message,
        });
        navigation.navigate('Root', {
          screen: 'Home',
        });
      }
    }
  }, [addTourResponse, editTourId]);

  useEffect(() => {
    if (addTourError) {
      if (addTourError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: addTourError?.message,
        });
      }
    }
  }, [addTourError]);

  const getTourType = useCallback(() => {
    if (isHolidays) {
      return 'HOLIDAY';
    } else if (isEvents) {
      return 'EVENT';
    } else if (isActivities) {
      return 'ACTIVITY';
    } else {
      return '';
    }
  }, [isHolidays, isActivities, isEvents]);

  const onContinue = () => {
    let formdata = new FormData();
    // Step One Data
    formdata.append('tourType', getTourType());
    formdata.append('title', stepOneData?.title);
    formdata.append('minBudget[currency]', 'GBP');
    formdata.append('maxBudget[currency]', 'GBP');
    formdata.append('minBudget[value]', stepOneData?.minBudget);
    formdata.append('maxBudget[value]', stepOneData?.maxBudget);
    formdata.append('description', stepOneData?.description);
    formdata.append('matesNumber', stepOneData?.matesNumber);
    formdata.append('flexibility', customModalResult?.FLEXIBILITY?.value);
    destinationPhotoIdsList?.map((item: any, index: number) =>
      formdata.append(`destinationPhotoIds[${index}]`, item),
    );
    if (isHolidays) {
      destinationList?.map((item: any, index: number) => {
        formdata.append(`destinations[${index}][city]`, item?.city);
        formdata.append(`destinations[${index}][country]`, item?.country);
        formdata.append(`destinations[${index}][latitude]`, item?.latitude);
        formdata.append(`destinations[${index}][longitude]`, item?.longitude);
        formdata.append(`destinations[${index}][startDate]`, item?.startDate);
        formdata.append(`destinations[${index}][endDate]`, item?.endDate);
      });
    } else {
      destinationList?.map((item: any, index: number) => {
        formdata.append(`destinations[${index}][address]`, item?.address);
        formdata.append(`destinations[${index}][city]`, item?.city);
        formdata.append(`destinations[${index}][state]`, item?.state);
        formdata.append(`destinations[${index}][country]`, item?.country);
        formdata.append(`destinations[${index}][latitude]`, item?.latitude);
        formdata.append(`destinations[${index}][longitude]`, item?.longitude);
        formdata.append(`destinations[${index}][zipcode]`, item?.zipcode);
        formdata.append(`destinations[${index}][startDate]`, item?.startDate);
        formdata.append(`destinations[${index}][endDate]`, item?.endDate);
        formdata.append(`destinations[${index}][startTime]`, item?.startTime);
        formdata.append(`destinations[${index}][endTime]`, item?.endTime);
      });
    }
    isActivities &&
      formdata.append('subCategoryId', customModalResult?.CATEGORY?.value);

    // Step Two Data
    formdata.append(
      'lookingFor',
      customModalResult?.LOOKING_FOR?.value || 'ANY',
    );
    if (isEvents && customModalResult?.CATEGORY?.value) {
      formdata.append('subCategoryId', customModalResult?.CATEGORY?.value);
    }
    if (isHolidays) {
      formdata.append(
        'workWithTravel',
        customModalResult?.WORK_WITH_TRAVEL?.value,
      );
    }
    if (isActivities && gearList.trim()) {
      formdata.append('requiredGears', gearList);
    }
    if (isActivities && customModalResult?.DIFFICULTY?.value) {
      formdata.append(
        'activityDifficulty',
        customModalResult?.DIFFICULTY?.value,
      );
    }
    itinerary.trim() && formdata.append('journeyDetails', itinerary);
    notes.trim() && formdata.append('notes', notes);

    accommodationOptions
      ?.filter(item => item?.isSelected)
      ?.map((item: any, index: number) => {
        formdata.append(`accommodation[${index}]`, item?.value);
      });

    language
      ?.filter(item => item?.isSelected)
      ?.map((item: any, index: number) => {
        formdata.append(`languages[${index}]`, item?.value);
      });

    addTour(formdata);
  };

  const getDifficulty = (name: string) => {
    if (name === 'EASY') {
      return t(LOCALES.CREATE_POST.LBL_EASY);
    } else if (name === 'MEDIUM') {
      return t(LOCALES.CREATE_POST.LBL_MEDIUM);
    } else if (name === 'HARD') {
      return t(LOCALES.CREATE_POST.LBL_HARD);
    } else if (name === 'EXPERT') {
      return t(LOCALES.CREATE_POST.LBL_EXPERT);
    } else {
      return '';
    }
  };

  useEffect(() => {
    if (editTourData) {
      setNotes(editTourData?.notes);
      setItinerary(editTourData?.journeyDetails);
      setGearList(editTourData?.requiredGears);
      if (editTourData?.languages?.length > 0) {
        const result = language?.map((item: any, index: number) => {
          item.isSelected = editTourData?.languages?.includes(item?.value);
          return item;
        });
        setLanguage(result);
      }
      dispatch(
        setCustomModalResult({
          ...customModalResult,
          ['LOOKING_FOR']: {
            title: getLookingFor(editTourData?.lookingFor),
            value: editTourData?.lookingFor,
          },
          ['WORK_WITH_TRAVEL']: {
            title: getWorkWithTravel(editTourData?.workWithTravel),
            value: editTourData?.workWithTravel,
          },
          ['CATEGORY']: {
            title: editTourData?.subCategory?.subCategoryName,
            value: editTourData?.subCategoryId,
          },
          ['DIFFICULTY']: {
            title: getDifficulty(editTourData?.activityDifficulty),
            value: editTourData?.activityDifficulty,
          },
        }),
      );
    }
  }, [editTourData]);

  const getLookingFor = (name: string) => {
    if (name === 'MALE') {
      return t(LOCALES.CREATE_POST.LBL_MALE);
    } else if (name === 'FEMALE') {
      return t(LOCALES.CREATE_POST.LBL_FEMALE);
    } else if (name === 'OTHER') {
      return t(LOCALES.CREATE_POST.LBL_OTHER);
    } else {
      return t(LOCALES.CREATE_POST.LBL_ANY);
    }
  };

  const getWorkWithTravel = (name: boolean) => {
    if (name) {
      return t(LOCALES.CREATE_POST.LBL_YES);
    } else {
      return t(LOCALES.CREATE_POST.LBL_NO);
    }
  };

  return (
    <WrapperScreen
      stepNumber={2}
      loading={isAddTourLoading}
      disabled={isAddTourLoading}
      onBackPress={() => navigation.goBack()}
      onContinue={onContinue}>
      <View style={styles.container}>
        <Text style={titleStyle}>{t(LOCALES.CREATE_POST.LBL_LOOKING_FOR)}</Text>
        <Picker
          value={customModalResult?.LOOKING_FOR?.title}
          onPress={() => {
            setModalType('LOOKING_FOR');
            handleCustomModalPress();
          }}
        />
        {isHolidays && (
          <View style={{marginVertical: 20}}>
            <Text style={titleStyle}>
              {t(LOCALES.CREATE_POST.LBL_WORK_TRAVEL)}
            </Text>
            <Picker
              value={customModalResult?.WORK_WITH_TRAVEL?.title}
              onPress={() => {
                setModalType('WORK_WITH_TRAVEL');
                handleCustomModalPress();
              }}
            />
          </View>
        )}
        {isEvents && (
          <View style={{marginVertical: 20}}>
            <Text style={titleStyle}>
              {t(LOCALES.CREATE_POST.LBL_CATEGORIES)}
            </Text>
            <Picker
              value={customModalResult?.CATEGORY?.title}
              onPress={() => {
                setModalType('CATEGORY');
                handleCustomModalPress();
              }}
            />
          </View>
        )}
        {isActivities && (
          <>
            <Text style={[titleStyle, {marginTop: 20}]}>
              {t(LOCALES.CREATE_POST.LBL_DIFFICULTY)}
            </Text>
            <Picker
              value={customModalResult?.DIFFICULTY?.title}
              onPress={() => {
                setModalType('DIFFICULTY');
                handleCustomModalPress();
              }}
            />
          </>
        )}
        {isActivities && (
          <>
            <Text style={[titleStyle, {marginTop: 20}]}>
              {t(LOCALES.CREATE_POST.LBL_GEARS_LIST)}
            </Text>
            <TextField
              parentStyle={{marginBottom: 20}}
              containerStyle={{
                height: 88,
                paddingVertical: 10,
              }}
              textInputStyle={{height: '100%'}}
              multiline={true}
              onChangeText={setGearList}
              value={gearList}
            />
          </>
        )}
        <Text style={titleStyle}>{t(LOCALES.CREATE_POST.LBL_ITINERARY)}</Text>
        <TextField
          containerStyle={{height: 145, paddingVertical: 10}}
          textInputStyle={{height: '100%'}}
          multiline={true}
          value={itinerary}
          onChangeText={setItinerary}
        />
        <View>
          <Text
            style={{
              fontSize: responsiveFontSize(16),
              fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
              color: COLORS.PRIMARY_TEXT_COLOR,
            }}>
            {t(LOCALES.CREATE_POST.LBL_ACCOMMODATION)}
          </Text>
          <View style={styles.wrapRow}>
            {accommodationOptions.map(item => (
              <Chip
                onPress={() => !isAddTourLoading && handleChipPress(item.id)}
                isSelected={item.isSelected}
                key={item.id}
                title={item.title}
                leftIcon={!item.isSelected ? item.icon : item.selectedIcon}
                customLeftIconStyle={{marginRight: 10}}
                parentStyle={{width: '46%', marginBottom: 20}}
                customLabelStyle={
                  item.isSelected && {
                    color: COLORS.PRIMARY_COLOR,
                    fontFamily: FONTS.MONTSERRAT.MEDIUM,
                  }
                }
                containerStyle={[
                  {width: '100%'},
                  item.isSelected && {
                    backgroundColor: COLORS.TERTIARY_COLOR,
                    borderColor: COLORS.TERTIARY_COLOR,
                  },
                ]}
              />
            ))}
          </View>
          <Text
            style={{
              marginVertical: 10,
              fontSize: responsiveFontSize(16),
              fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
              color: COLORS.PRIMARY_TEXT_COLOR,
            }}>
            {t(LOCALES.CREATE_POST.LBL_SELECT_LANGUAGES)}
          </Text>
          {language.filter(item => item.isSelected).length > 0
            ? language
                .filter(item => item.isSelected)
                .map(item => (
                  <Pressable
                    style={styles.row}
                    key={item.id}
                    onPress={() =>
                      !isAddTourLoading && handleLanguagesChange(item.id)
                    }>
                    <Text
                      style={{
                        fontSize: responsiveFontSize(14),
                        fontFamily: FONTS.MONTSERRAT.REGULAR,
                        color: COLORS.PRIMARY_TEXT_COLOR,
                      }}>
                      {item.name}
                    </Text>
                    <CheckBox
                      value={item.isSelected}
                      onChange={() =>
                        !isAddTourLoading && handleLanguagesChange(item.id)
                      }
                    />
                  </Pressable>
                ))
            : language.slice(0, 3).map(item => (
                <Pressable
                  style={styles.row}
                  key={item.id}
                  onPress={() =>
                    !isAddTourLoading && handleLanguagesChange(item.id)
                  }>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(14),
                      fontFamily: FONTS.MONTSERRAT.REGULAR,
                      color: COLORS.PRIMARY_TEXT_COLOR,
                    }}>
                    {item.name}
                  </Text>
                  <CheckBox
                    value={item.isSelected}
                    onChange={() =>
                      !isAddTourLoading && handleLanguagesChange(item.id)
                    }
                  />
                </Pressable>
              ))}
          <View style={styles.row}>
            <Pressable
              disabled={isAddTourLoading}
              onPress={handleLanguagesModalPress}
              style={{
                borderBottomWidth: 2,
                borderColor: COLORS.PRIMARY_TEXT_COLOR,
                marginRight: 8,
              }}>
              <Text
                style={{
                  color: COLORS.FEED_PRIMARY_TEXT_COLOR,
                  fontSize: responsiveFontSize(14),
                  fontFamily: FONTS.MONTSERRAT.MEDIUM,
                }}>
                {t(LOCALES.CREATE_POST.LBL_SHOW_MORE)}
              </Text>
            </Pressable>
            <PICKER_ICON />
            <View style={{flex: 1}} />
          </View>
          <Text style={[titleStyle, {marginTop: 20}]}>
            {t(LOCALES.CREATE_POST.LBL_NOTES)}
          </Text>
          <TextField
            containerStyle={{height: 145, paddingVertical: 10}}
            textInputStyle={{height: '100%'}}
            multiline={true}
            value={notes}
            onChangeText={setNotes}
            editable={!isAddTourLoading}
          />
        </View>
      </View>
      <LanguagesModal
        bottomSheetModalRef={languagesModalRef}
        language={language}
        handleLanguagesChange={handleLanguagesChange}
      />
      <CustomModal bottomSheetModalRef={CustomModalRef} type={modalType} />
    </WrapperScreen>
  );
};

export default CreatePostStepTwo;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginHorizontal: 20,
  },
  title: {
    fontSize: responsiveFontSize(14),
    marginBottom: 10,
  },
  wrapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
});
