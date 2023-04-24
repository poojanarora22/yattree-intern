import {Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import useTheme from '../../../../../../theme/hooks/useTheme';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import DatePicker from 'react-native-date-picker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import RadioButton from '../../../../../../components/RadioButton';
import {useTranslation} from 'react-i18next';
import LOCALES from '../../../../../../localization/constants';
import {ARROW_RIGHT, CALENDAR} from '../../../../../../assets/icons/svg';
import Male from '../../../../../../assets/icons/svg/Male';
import Female from '../../../../../../assets/icons/svg/Female';
import Other from '../../../../../../assets/icons/svg/Other';
import CustomMultiSlider from '../CustomMultiSlider';
import Chip from '../../../../../../components/Chip';
import Button from '../../../../../../components/Button';
import {responsiveFontSize} from '../../../../../../theme/responsiveFontSize';
import {BlurView} from '@react-native-community/blur';
import moment from 'moment';
import {appAlert} from '../../../../../../components/appAlert';
import {ScrollView} from 'react-native-gesture-handler';

type FilterModalType = {
  bottomSheetModalRef: any;
  handleLocationModalPress: () => void;
  setFilterData: any;
  selectedLocation: any;
  filterData: any;
  setIsModalOpen: any;
};

type MatesType = {
  id: number;
  title: string;
  isSelected: boolean;
}[];

const FilterModal = ({
  bottomSheetModalRef,
  handleLocationModalPress,
  setFilterData,
  selectedLocation,
  filterData,
  setIsModalOpen,
}: FilterModalType) => {
  const {FONTS, COLORS} = useTheme();
  const {t} = useTranslation();
  const {bottom} = useSafeAreaInsets();
  const snapPoints = useMemo(() => ['60%', '85%'], []);
  const lineStyle = useMemo(
    () => [{borderColor: COLORS.RADIO_BUTTON_BACKGROUND_COLOR}, styles.line],
    [],
  );
  const [matesNumber, setMatesNumber] = useState<MatesType>([]);
  const [openCalender, setOpenCalender] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isStartDateSet, setIsStartDateSet] = useState(true);
  const [filter, setFilter] = useState<any>(null);
  const [KMRange, setKMRange] = useState<{
    min: number;
    max: number;
  }>({min: 0, max: 100});
  const [location, setLocation] = useState('');
  const [budgetRange, setBudgetRange] = useState<{
    min: number;
    max: number;
  }>({min: 0, max: 10000});
  const [resetSlider, setResetSlider] = useState(false);

  useEffect(() => {
    const arr = [
      {
        id: 0,
        title: 'Any',
        isSelected: false,
      },
    ];
    for (let i = 1; i <= 30; i++) {
      arr.push({
        id: i,
        title: JSON.stringify(i),
        isSelected: false,
      });
    }
    setMatesNumber(arr);
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      setLocation(selectedLocation);
    }
  }, [selectedLocation]);

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

  const SortFieldOptions = [
    {
      id: 1,
      title: t(LOCALES.HOME.FILTER_OPTION_1),
      isSelected: true,
      value: 'createdAt',
    },
    {
      id: 2,
      title: t(LOCALES.HOME.FILTER_OPTION_2),
      isSelected: false,
      value: 'title',
    },
    {
      id: 3,
      title: t(LOCALES.HOME.FILTER_OPTION_3),
      isSelected: false,
      value: 'matesNumber',
    },
    {
      id: 4,
      title: t(LOCALES.HOME.FILTER_OPTION_4),
      isSelected: false,
      value: 'duration',
    },
    {
      id: 5,
      title: t(LOCALES.HOME.FILTER_OPTION_5),
      isSelected: false,
      value: 'maxBudget',
    },
  ];

  const GenderPreference = [
    {
      id: 0,
      title: t(LOCALES.HOME.FILTER_OPTION_9),
      icon: <Male />,
      selectedIcon: <Male color={COLORS.PRIMARY_COLOR} />,
      value: 'MALE',
      isSelected: false,
    },
    {
      id: 1,
      title: t(LOCALES.HOME.FILTER_OPTION_10),
      icon: <Female />,
      selectedIcon: <Female color={COLORS.PRIMARY_COLOR} />,
      value: 'FEMALE',
      isSelected: false,
    },
    {
      id: 2,
      title: t(LOCALES.HOME.FILTER_OPTION_11),
      icon: <Other />,
      selectedIcon: <Other color={COLORS.PRIMARY_COLOR} />,
      value: 'ANY',
      isSelected: false,
    },
  ];

  const [sortFieldOptions, setSortFieldOptions] = useState(SortFieldOptions);
  const [genderPreference, setGenderPreference] = useState(GenderPreference);

  const handleSortFieldOptionsPress = useCallback(
    (id: number) => {
      const arr = sortFieldOptions.map(item => {
        if (item.id === id) {
          item.isSelected = true;
          setFilter({
            ...filter,
            sortBy: item.value,
          });
        } else {
          item.isSelected = false;
        }
        return item;
      });
      setSortFieldOptions(arr);
    },
    [filter],
  );

  const handleMatesPress = useCallback(
    (id: number) => {
      const arr = matesNumber.map(item => {
        if (item.id === id) {
          item.isSelected = true;
          if (item.title === 'Any') {
            const data = {...filter};
            delete data['matesNumber'];
            setFilter({
              ...data,
            });
          } else {
            setFilter({
              ...filter,
              matesNumber: item.id,
            });
          }
        } else {
          item.isSelected = false;
        }
        return item;
      });
      setMatesNumber(arr);
    },
    [matesNumber, filter],
  );

  const handleGenderPreferencePress = useCallback(
    (id: number) => {
      const arr = genderPreference.map(item => {
        if (item.id === id) {
          item.isSelected = true;
          setFilter({
            ...filter,
            lookingFor: item.value,
          });
        } else {
          item.isSelected = false;
        }
        return item;
      });
      setGenderPreference(arr);
    },
    [filter],
  );

  const handleKMChange = useCallback(
    (min: number, max: number) => {
      if (min === 0 && max === 100) return;
      setKMRange({min, max});
      setResetSlider(false);
      if (location) {
        setFilter({
          ...filter,
          minRadius: min,
          maxRadius: max,
        });
      }
    },
    [filter, location],
  );

  const handleBudgetChange = useCallback(
    (min: number, max: number) => {
      if (min === 0 && max === 10000) return;
      setBudgetRange({min, max});
      setFilter({
        ...filter,
        minBudget: min,
        maxBudget: max,
      });
      setResetSlider(false);
    },
    [filter],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      backgroundStyle={{backgroundColor: COLORS.MODAL_BACKGROUND_COLOR}}
      snapPoints={snapPoints}
      handleComponent={handleComponent}
      backdropComponent={renderBackdrop}
      onChange={(index: number) => setIsModalOpen(!(index < 1))}>
      <BottomSheetScrollView style={[styles.contentContainerStyle]}>
        <View style={styles.container}>
          <Text
            style={[
              styles.filter,
              {
                fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                color: COLORS.PRIMARY_TEXT_COLOR,
              },
            ]}>
            {t(LOCALES.HOME.FILTER)}
          </Text>
          <View>
            <Text
              style={[
                styles.title,
                {
                  fontFamily: FONTS.MONTSERRAT.MEDIUM,
                  color: COLORS.FILTER_TITLE_COLOR,
                },
              ]}>
              {t(LOCALES.HOME.FILTER_TITLE_1)}
            </Text>
            {sortFieldOptions.map(item => {
              return (
                <Pressable
                  onPress={() => handleSortFieldOptionsPress(item.id)}
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
                    onChange={() => handleSortFieldOptionsPress(item.id)}
                  />
                </Pressable>
              );
            })}
          </View>
          <View style={lineStyle} />
          <View>
            <Text
              style={[
                styles.title,
                {
                  fontFamily: FONTS.MONTSERRAT.MEDIUM,
                  color: COLORS.FILTER_TITLE_COLOR,
                },
              ]}>
              {t(LOCALES.HOME.FILTER_TITLE_3)}
            </Text>
            <Pressable onPress={handleLocationModalPress} style={styles.row}>
              <Text
                style={[
                  styles.option,
                  {
                    fontFamily: FONTS.MONTSERRAT.REGULAR,
                    color: COLORS.PRIMARY_TEXT_COLOR,
                  },
                ]}>
                {location}
              </Text>
              <ARROW_RIGHT />
            </Pressable>
          </View>
          <View style={lineStyle} />
          <View>
            <Text
              style={[
                styles.title,
                {
                  fontFamily: FONTS.MONTSERRAT.MEDIUM,
                  color: COLORS.FILTER_TITLE_COLOR,
                },
              ]}>
              {t(LOCALES.HOME.FILTER_TITLE_4)}
            </Text>
            <View style={styles.row}>
              <Text
                style={[
                  styles.option,
                  {
                    fontFamily: FONTS.MONTSERRAT.REGULAR,
                    color: COLORS.PRIMARY_TEXT_COLOR,
                  },
                ]}>
                {KMRange?.min} Km - {KMRange?.max} Km
              </Text>
            </View>
            <CustomMultiSlider
              min={0}
              max={100}
              getValues={handleKMChange}
              resetSlider={resetSlider}
              values={KMRange}
            />
          </View>
          <View style={lineStyle} />
          <View>
            <Text
              style={[
                styles.title,
                {
                  fontFamily: FONTS.MONTSERRAT.MEDIUM,
                  color: COLORS.FILTER_TITLE_COLOR,
                },
              ]}>
              {t(LOCALES.HOME.FILTER_TITLE_5)}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {matesNumber?.map(item => {
                return (
                  <Chip
                    onPress={() => handleMatesPress(item.id)}
                    key={item.id}
                    isSelected={item.isSelected}
                    title={item.title}
                    customLabelStyle={{
                      fontFamily: FONTS.MONTSERRAT.MEDIUM,
                      color: item.isSelected
                        ? COLORS.PRIMARY_COLOR
                        : COLORS.PRIMARY_TEXT_COLOR,
                      flex: 0,
                      fontSize: responsiveFontSize(14),
                    }}
                    containerStyle={[
                      item.isSelected && {
                        backgroundColor: COLORS.TERTIARY_BUTTON_COLOR,
                        borderColor: COLORS.TERTIARY_BUTTON_COLOR,
                      },
                      styles.chipContainer,
                    ]}
                    parentStyle={{width: 'auto'}}
                  />
                );
              })}
            </ScrollView>
          </View>
          <View style={lineStyle} />
          <View>
            <Text
              style={[
                styles.title,
                {
                  fontFamily: FONTS.MONTSERRAT.MEDIUM,
                  color: COLORS.FILTER_TITLE_COLOR,
                },
              ]}>
              {t(LOCALES.HOME.FILTER_TITLE_6)}
            </Text>
            <View style={styles.row}>
              {genderPreference?.map(item => (
                <Chip
                  onPress={() => handleGenderPreferencePress(item.id)}
                  key={item.id}
                  isSelected={item.isSelected}
                  title={item.title}
                  customLabelStyle={{
                    fontFamily: FONTS.MONTSERRAT.MEDIUM,
                    color: item.isSelected
                      ? COLORS.PRIMARY_COLOR
                      : COLORS.PRIMARY_TEXT_COLOR,
                    fontSize: responsiveFontSize(12),
                  }}
                  leftIcon={item.isSelected ? item.selectedIcon : item.icon}
                  customLeftIconStyle={{marginRight: 8}}
                  containerStyle={[
                    item.isSelected && {
                      backgroundColor: COLORS.TERTIARY_BUTTON_COLOR,
                      borderColor: COLORS.TERTIARY_BUTTON_COLOR,
                    },
                    {height: 50},
                  ]}
                  parentStyle={styles.genderPreferenceChipContainer}
                />
              ))}
            </View>
          </View>
          <View style={lineStyle} />
          <View>
            <Text
              style={[
                styles.title,
                {
                  fontFamily: FONTS.MONTSERRAT.MEDIUM,
                  color: COLORS.FILTER_TITLE_COLOR,
                },
              ]}>
              {t(LOCALES.HOME.FILTER_TITLE_7)}
            </Text>
            <View style={styles.row}>
              <Text
                style={[
                  styles.option,
                  {
                    fontFamily: FONTS.MONTSERRAT.REGULAR,
                    color: COLORS.PRIMARY_TEXT_COLOR,
                  },
                ]}>
                £{budgetRange?.min} - £{budgetRange?.max}
              </Text>
            </View>
            <CustomMultiSlider
              min={0}
              max={10000}
              getValues={handleBudgetChange}
              resetSlider={resetSlider}
              values={budgetRange}
            />
          </View>
          <View style={lineStyle} />
          <View>
            <Text
              style={[
                styles.title,
                {
                  fontFamily: FONTS.MONTSERRAT.MEDIUM,
                  color: COLORS.FILTER_TITLE_COLOR,
                },
              ]}>
              {t(LOCALES.HOME.FILTER_TITLE_8)}
            </Text>
            <View style={styles.row}>
              <Chip
                onPress={() => {
                  setOpenCalender(true);
                  setIsStartDateSet(true);
                }}
                title={startDate.toLocaleDateString()}
                leftIcon={<CALENDAR />}
                customLabelStyle={{fontFamily: FONTS.MONTSERRAT.MEDIUM}}
                customLeftIconStyle={{marginRight: 8}}
                parentStyle={{width: '48%'}}
              />
              <Chip
                onPress={() => {
                  setOpenCalender(true);
                  setIsStartDateSet(false);
                }}
                title={endDate.toLocaleDateString()}
                leftIcon={<CALENDAR />}
                customLabelStyle={{fontFamily: FONTS.MONTSERRAT.MEDIUM}}
                customLeftIconStyle={{marginRight: 8}}
                parentStyle={{width: '48%'}}
              />
            </View>
          </View>
        </View>
      </BottomSheetScrollView>
      <View
        style={[
          styles.row,
          styles.footer,
          {
            backgroundColor: COLORS.MODAL_BACKGROUND_COLOR,
            borderColor: COLORS.RADIO_BUTTON_BACKGROUND_COLOR,
            paddingBottom: Platform.OS === 'ios' ? bottom : 20,
          },
        ]}>
        <Button
          title={t(LOCALES.HOME.FILTER_BUTTON_1)}
          containerStyle={{
            width: '48%',
            backgroundColor: COLORS.MODAL_BACKGROUND_COLOR,
            alignItems: 'flex-start',
          }}
          onPress={() => {
            setSortFieldOptions(SortFieldOptions);
            setGenderPreference(GenderPreference);
            setKMRange({min: 0, max: 100});
            setBudgetRange({min: 0, max: 10000});
            setStartDate(new Date());
            setEndDate(new Date());
            setLocation('');
            const arr = [
              {
                id: 0,
                title: 'Any',
                isSelected: false,
              },
            ];
            for (let i = 1; i <= 30; i++) {
              arr.push({
                id: i,
                title: JSON.stringify(i),
                isSelected: false,
              });
            }
            setMatesNumber(arr);
            setFilter(null);
            setResetSlider(true);
            setFilterData(null);
          }}
        />
        <Button
          title={t(LOCALES.HOME.FILTER_BUTTON_2)}
          containerStyle={{width: '48%'}}
          onPress={() => {
            if (filter?.startDate || filter?.endDate) {
              if (!filter?.startDate) {
                appAlert({
                  title: t(LOCALES.ERROR.LBL_ERROR),
                  message: 'Please select a start date',
                });
                return;
              }
              if (!filter?.endDate) {
                appAlert({
                  title: t(LOCALES.ERROR.LBL_ERROR),
                  message: 'Please select a end date',
                });
                return;
              }
              if (startDate.getTime() > endDate.getTime()) {
                appAlert({
                  title: t(LOCALES.ERROR.LBL_ERROR),
                  message: 'Please select a valid end date',
                });
                return;
              }
            }
            setFilterData({...filterData, ...filter});
            bottomSheetModalRef?.current?.close();
          }}
        />
      </View>
      <DatePicker
        modal
        open={openCalender}
        date={new Date()}
        mode="date"
        onConfirm={date => {
          if (isStartDateSet) {
            setStartDate(date);
            setFilter({
              ...filter,
              startDate: moment(date).format('YYYY-MM-DD'),
            });
          } else {
            setEndDate(date);
            setFilter({
              ...filter,
              endDate: moment(date).format('YYYY-MM-DD'),
            });
          }
          setOpenCalender(false);
        }}
        onCancel={() => {
          setOpenCalender(false);
        }}
      />
    </BottomSheetModal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
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
  contentContainerStyle: {flex: 1},
  container: {
    marginHorizontal: 20,
    marginBottom: 120,
  },
  filter: {
    fontSize: responsiveFontSize(14),
    marginTop: 12,
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: responsiveFontSize(14),
    marginBottom: 10,
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
  line: {
    marginVertical: 20,
    borderTopWidth: 1,
  },
  chipContainer: {
    width: 'auto',
    borderRadius: 17,
    marginHorizontal: 10,
    height: 50,
    paddingHorizontal: 20,
  },
  genderPreferenceChipContainer: {
    height: 50,
    width: '30%',
  },
  footer: {
    position: 'absolute',
    start: 0,
    end: 0,
    bottom: 0,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    paddingTop: 10,
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
