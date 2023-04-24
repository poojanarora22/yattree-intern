import {
  BackHandler,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../../../components/Header';
import useTheme from '../../../../theme/hooks/useTheme';
import {ChooseDestinationScreenProps} from '../../../../types/navigation/appTypes';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import Picker from '../../../../components/Picker';
import {useTranslation} from 'react-i18next';
import LOCALES from '../../../../localization/constants';
import Chip from '../../../../components/Chip';
import DatePicker from 'react-native-date-picker';
import Button from '../../../../components/Button';
import moment from 'moment';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import LocationModal from '../../Home/HomeScreen/components/LocationModal';
import {useAppDispatch, useAppSelector} from '../../../../store';
import {setDestinationList} from '../../../../store/slice/createPostSlice';
import {appAlert} from '../../../../components/appAlert';

type addressType = {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  latitude?: string;
  longitude?: string;
};

const ChooseDestination = ({navigation}: ChooseDestinationScreenProps) => {
  const {t} = useTranslation();
  const {COLORS, FONTS, BAR_STYLE} = useTheme();
  const dispatch = useAppDispatch();
  const locationModalRef = useRef<BottomSheetModal>(null);
  const [pickerValue, setPickerValue] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<addressType | null>(
    null,
  );
  const [openCalender, setOpenCalender] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isStartDateSet, setIsStartDateSet] = useState(true);
  const {selectedCreatePostOption, destinationList} = useAppSelector(
    state => state.createPost,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const backAction = () => {
      if (isModalOpen) {
        locationModalRef?.current?.close();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [isModalOpen]);

  const textStyles = useMemo(
    () => [
      styles.textField,
      {
        color: COLORS.SECONDARY_TEXT_COLOR,
        fontFamily: FONTS.MONTSERRAT.REGULAR,
      },
    ],
    [COLORS, FONTS],
  );

  const handleLocationModalPress = useCallback(() => {
    locationModalRef.current?.present();
  }, []);
  const isHolidays =
    selectedCreatePostOption?.title === t(LOCALES.CREATE_POST.LBL_HOLIDAYS);

  useEffect(() => {
    if (selectedLocation) {
      if (isHolidays) {
        let result = '';
        if (selectedLocation?.city && selectedLocation?.country) {
          result = selectedLocation?.city + ', ' + selectedLocation?.country;
        } else {
          result = selectedLocation?.country || '';
        }
        setPickerValue(result);
      } else {
        setPickerValue(selectedLocation?.address || '');
      }
    }
  }, [selectedLocation]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.APP_BACKGROUND_COLOR,
      }}>
      <StatusBar
        backgroundColor={COLORS.STATUS_BAR_COLOR}
        barStyle={BAR_STYLE}
      />
      <Header
        title={t(LOCALES.CREATE_POST.LBL_DESTINATION)}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <View style={{flex: 1, justifyContent: 'flex-start'}}>
          <Text style={textStyles}>
            {isHolidays
              ? t(LOCALES.CREATE_POST.LBL_SELECT_DESTINATION)
              : t(LOCALES.CREATE_POST.LBL_SELECT_DESTINATION)}
          </Text>
          <Picker value={pickerValue} onPress={handleLocationModalPress} />
          <View style={styles.row}>
            <View style={styles.dateContainer}>
              <Text style={textStyles}>
                {isHolidays
                  ? t(LOCALES.CREATE_POST.LBL_CHECK_IN_DATE)
                  : t(LOCALES.CREATE_POST.LBL_START_DATE_TIME)}
              </Text>
              <Chip
                title={moment(startDate).format(
                  isHolidays ? 'ddd, DD MMM' : 'ddd, DD MMM, H:mm',
                )}
                onPress={() => {
                  setOpenCalender(true);
                  setIsStartDateSet(true);
                }}
              />
            </View>
            <View style={styles.dateContainer}>
              <Text style={textStyles}>
                {isHolidays
                  ? t(LOCALES.CREATE_POST.LBL_CHECK_OUT_DATE)
                  : t(LOCALES.CREATE_POST.LBL_END_DATE_TIME)}
              </Text>
              <Chip
                title={moment(endDate).format(
                  isHolidays ? 'ddd, DD MMM' : 'ddd, DD MMM, H:mm',
                )}
                onPress={() => {
                  setOpenCalender(true);
                  setIsStartDateSet(false);
                }}
              />
            </View>
          </View>
        </View>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Button
            title={t(LOCALES.CREATE_POST.LBL_SUBMIT)}
            disabled={!pickerValue.trim()}
            onPress={() => {
              if (
                isHolidays &&
                (startDate > endDate ||
                  (startDate.getDate() === endDate.getDate() &&
                    startDate.getMonth() === endDate.getMonth() &&
                    startDate.getFullYear() === endDate.getFullYear()))
              ) {
                appAlert({
                  title: t(LOCALES.ERROR.LBL_ERROR),
                  message: 'Please select a valid end date',
                });
              } else if (
                !isHolidays &&
                endDate.getTime() < startDate.getTime()
              ) {
                appAlert({
                  title: t(LOCALES.ERROR.LBL_ERROR),
                  message: 'Please select a valid time or date',
                });
              } else {
                dispatch(
                  setDestinationList([
                    ...destinationList,
                    {
                      ...selectedLocation,
                      startDate: moment(startDate).format('YYYY-MM-DD'),
                      displayStartDate: moment(startDate).format('ddd, DD MMM'),
                      displayEndDate: moment(endDate).format('ddd, DD MMM'),
                      endDate: moment(endDate).format('YYYY-MM-DD'),
                      startTime: moment(startDate).format('HH:mm'),
                      endTime: moment(endDate).format('HH:mm'),
                      id: Date.now(),
                    },
                  ]),
                );
                navigation.goBack();
              }
            }}
            containerStyle={{marginBottom: Platform.OS === 'android' ? 20 : 0}}
          />
        </View>
      </View>
      <LocationModal
        bottomSheetModalRef={locationModalRef}
        setSelectedLocation={setSelectedLocation}
        setIsModalOpen={setIsModalOpen}
      />
      <DatePicker
        modal
        open={openCalender}
        date={new Date()}
        minimumDate={new Date()}
        mode={isHolidays ? 'date' : 'datetime'}
        onConfirm={date => {
          if (isStartDateSet) {
            setStartDate(date);
          } else {
            setEndDate(date);
          }
          setOpenCalender(false);
        }}
        onCancel={() => {
          setOpenCalender(false);
        }}
      />
    </SafeAreaView>
  );
};

export default ChooseDestination;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginHorizontal: 20,
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  textField: {
    fontSize: responsiveFontSize(14),
    marginBottom: 10,
  },
  row: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },
  dateContainer: {
    width: '45%',
  },
});
