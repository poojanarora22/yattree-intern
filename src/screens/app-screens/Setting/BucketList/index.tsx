import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../../../components/Header';
import Button from '../../../../components/Button';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import useTheme from '../../../../theme/hooks/useTheme';
import LOCALES from '../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {BucketListScreenProps} from '../../../../types/navigation/appTypes';
import TextField from '../../../../components/TextField';
import {DELETE_ICON, SEARCH} from '../../../../assets/icons/svg';
import Location from '../../../../assets/icons/svg/Location';
import {GooglePlaceDetail} from 'react-native-google-places-autocomplete';
import AutocompleteAddress from '../../../../components/AutocompleteAddressModal';
import {useApi} from '../../../../hooks/useApi';
import {URL} from '../../../../constants/URLS';
import {appAlert} from '../../../../components/appAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setUserDetails} from '../../../../store/slice/authSlice';
import {useAppDispatch} from '../../../../store';
import {setProfileInformation} from '../../../../store/slice/profileSlice';

type addressType = {
  id?: number;
  displayName?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  latitude?: string;
  longitude?: string;
};

const BucketList = ({navigation}: BucketListScreenProps) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const [autocompleteAddress, setAutocompleteAddress] =
    React.useState<GooglePlaceDetail | null>(null);
  const [autocompleteAddressList, setAutocompleteAddressList] = React.useState<
    addressType[]
  >([]);

  useEffect(() => {
    if (autocompleteAddress) {
      let object: addressType = {};
      object.id = Date.now();
      object.address = autocompleteAddress.formatted_address;
      object.latitude = autocompleteAddress.geometry.location.lat.toString();
      object.longitude = autocompleteAddress.geometry.location.lng.toString();
      for (let i = 0; i < autocompleteAddress.address_components.length; i++) {
        if (
          autocompleteAddress.address_components[i].types[0] === 'postal_code'
        ) {
          object.zipcode = autocompleteAddress.address_components[i].long_name;
        }
        if (autocompleteAddress.address_components[i].types[0] === 'country') {
          object.country = autocompleteAddress.address_components[i].long_name;
        }
        if (
          autocompleteAddress.address_components[i].types[0] ===
          'administrative_area_level_1'
        ) {
          object.state = autocompleteAddress.address_components[i].long_name;
        }
        if (autocompleteAddress.address_components[i].types[0] === 'locality') {
          object.city = autocompleteAddress.address_components[i].long_name;
        }
        if (autocompleteAddress.address_components[i].types[0] === 'route') {
          object.displayName =
            autocompleteAddress.address_components[i].long_name;
        }
      }
      setAutocompleteAddressList([...autocompleteAddressList, object]);
    }
  }, [autocompleteAddress]);

  const removeAddress = useCallback(
    (id: number) => {
      const result = autocompleteAddressList?.filter(
        address => address.id !== id,
      );
      setAutocompleteAddressList(result);
    },
    [autocompleteAddressList],
  );

  const [
    updateProfile,
    updateProfileResponse,
    updateProfileError,
    isUpdateProfileLoading,
  ] = useApi({
    url: URL.UPDATE_PROFILE,
    method: 'PUT',
  });

  useEffect(() => {
    if (updateProfileResponse) {
      if (updateProfileResponse?.statusCode === 200) {
        appAlert({
          title: t(LOCALES.SUCCESS.LBL_SUCCESS),
          message: t(LOCALES.SUCCESS.LBL_BUCKET_LIST_ADDED_SUCCESS),
        });
        const result = updateProfileResponse?.data?.user;
        dispatch(setUserDetails(result));
        dispatch(
          setProfileInformation({
            name: result?.firstName + ' ' + result?.lastName,
            bio: result?.bio,
            interests: result?.interests,
            wishLists: result?.wishLists,
            socialHandleLinks: result?.socialHandleLinks,
          }),
        );
        AsyncStorage.setItem('userDetails', JSON.stringify(result));
        navigation.goBack();
      }
    }
  }, [updateProfileResponse]);

  useEffect(() => {
    if (updateProfileError) {
      if (updateProfileError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: updateProfileError?.message,
        });
      }
    }
  }, [updateProfileError]);

  const renderItem = useCallback(
    (item: addressType) => {
      return (
        <Pressable style={styles.card} key={item?.id}>
          <View
            style={[
              styles.location,
              {
                backgroundColor: COLORS.PRIMARY_CHIP_COLOR,
                borderColor: COLORS.CHIP_INACTIVE_BORDER_COLOR,
              },
            ]}>
            <Location />
          </View>
          <View style={styles.labelContainer}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: responsiveFontSize(14),
                fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                color: COLORS.PRIMARY_TEXT_COLOR,
              }}>
              {item?.displayName}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontSize: responsiveFontSize(14),
                marginTop: 7,
                fontFamily: FONTS.MONTSERRAT.REGULAR,
                color: COLORS.PROFILE_TEXT_COLOR,
              }}>
              {item?.address}
            </Text>
          </View>
          <Pressable
            disabled={isUpdateProfileLoading}
            onPress={() => item?.id && removeAddress(item?.id)}>
            <DELETE_ICON />
          </Pressable>
        </Pressable>
      );
    },
    [autocompleteAddressList, isUpdateProfileLoading],
  );

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
        title={t(LOCALES.SETTING.LBL_BUCKET_LIST)}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContainer}>
        <View style={{flex: 1, justifyContent: 'flex-start'}}>
          <View style={styles.container}>
            <AutocompleteAddress
              setAutocompleteAddress={setAutocompleteAddress}
              placeholder={t(LOCALES.PROFILE.SELECT_PLACES)}
              isLocationModalScreen={false}
            />
            <View style={{marginBottom: 30}} />
            {autocompleteAddressList.map(renderItem)}
          </View>
        </View>
      </ScrollView>
      <View style={{marginHorizontal: 20}}>
        <Button
          title={t(LOCALES.SETTING.LBL_SUBMIT)}
          containerStyle={{
            marginBottom: Platform.OS === 'android' ? 20 : 0,
          }}
          disabled={
            isUpdateProfileLoading || autocompleteAddressList.length === 0
          }
          loading={isUpdateProfileLoading}
          onPress={() => {
            let formdata = new FormData();
            autocompleteAddressList?.map((item: addressType, index: number) => {
              item?.address &&
                formdata.append(`wishLists[${index}][address]`, item?.address);
              item?.city &&
                formdata.append(`wishLists[${index}][city]`, item?.city);
              item?.state &&
                formdata.append(`wishLists[${index}][state]`, item?.state);
              item?.country &&
                formdata.append(`wishLists[${index}][country]`, item?.country);
              item?.zipcode &&
                formdata.append(`wishLists[${index}][zipcode]`, item?.zipcode);
              item?.latitude &&
                formdata.append(
                  `wishLists[${index}][latitude]`,
                  item?.latitude,
                );
              item?.longitude &&
                formdata.append(
                  `wishLists[${index}][longitude]`,
                  item?.longitude,
                );
            });
            updateProfile(formdata);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default BucketList;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  location: {
    height: 47,
    width: 47,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  card: {
    height: 62,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  labelContainer: {flex: 1, paddingHorizontal: 12},
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
});
