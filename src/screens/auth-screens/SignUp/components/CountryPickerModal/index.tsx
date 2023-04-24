import {Image, Pressable, StyleSheet, Text} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import useTheme from '../../../../../theme/hooks/useTheme';
import {responsiveFontSize} from '../../../../../theme/responsiveFontSize';
import axios from 'axios';
import {URL} from '../../../../../constants/URLS';

type CountryPickerModalType = {
  isNationalityScreen?: boolean;
  bottomSheetModalRef: any;
  onCountrySelect: (item: any) => void;
};

const CountryPickerModal = ({
  isNationalityScreen = false,
  bottomSheetModalRef,
  onCountrySelect = () => {},
}: CountryPickerModalType) => {
  const {FONTS, COLORS} = useTheme();
  const snapPoints = useMemo(() => ['50%', '80%'], []);
  const [country, setCountry] = useState([]);

  const dialCodeStyles = useMemo(
    () => [
      {
        width: '20%',
        fontSize: responsiveFontSize(14),
        fontFamily: FONTS.MONTSERRAT.MEDIUM,
        color: COLORS.PRIMARY_COLOR,
      },
    ],
    [FONTS, COLORS],
  );

  const nameStyles = useMemo(
    () => [
      {
        width: '70%',
        fontSize: responsiveFontSize(14),
        fontFamily: FONTS.MONTSERRAT.MEDIUM,
        color: COLORS.PRIMARY_COLOR,
        paddingHorizontal: 20,
      },
    ],
    [FONTS, COLORS],
  );

  useEffect(() => {
    axios
      .get(URL.GET_COUNTRIES_LIST)
      .then(response => {
        setCountry(response.data);
      })
      .catch(error => {
        console.log('Error while getting countries list...', error);
      });
  }, []);

  const renderItem = useCallback((data: any) => {
    const {item} = data;
    return (
      <Pressable style={styles.row} onPress={() => onCountrySelect(item)}>
        <Image source={{uri: item.flagUrl}} style={styles.flag} />
        <Text style={nameStyles}>{item.name}</Text>
        {!isNationalityScreen && (
          <Text style={dialCodeStyles}>{item.phoneCode}</Text>
        )}
      </Pressable>
    );
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} />,
    [],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}>
      <BottomSheetFlatList
        data={country}
        renderItem={renderItem}
        style={styles.container}
      />
    </BottomSheetModal>
  );
};

export default CountryPickerModal;

const styles = StyleSheet.create({
  container: {flex: 1, marginTop: 20, marginBottom: 30},
  row: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 20,
    paddingVertical: 10,
  },
  flag: {
    height: 20,
    width: 40,
  },
});
