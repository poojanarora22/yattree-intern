import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useMemo} from 'react';
import WrapperScreen from '../WrapperScreen';
import {DELETE_ICON} from '../../../../assets/icons/svg';
import Location from '../../../../assets/icons/svg/Location';
import {useTranslation} from 'react-i18next';
import useTheme from '../../../../theme/hooks/useTheme';
import LOCALES from '../../../../localization/constants';
import {useAppDispatch, useAppSelector} from '../../../../store';
import {setIsUserSignedIn} from '../../../../store/slice/authSlice';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import AutocompleteAddress from '../../../../components/AutocompleteAddressModal';
import {GooglePlaceDetail} from 'react-native-google-places-autocomplete';
import {useApi} from '../../../../hooks/useApi';
import {appAlert} from '../../../../components/appAlert';
import {URL} from '../../../../constants/URLS';

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

const BucketList = () => {
  const {t} = useTranslation();
  const {COLORS, FONTS} = useTheme();
  const dispatch = useAppDispatch();
  const {profileSetupUserData} = useAppSelector(state => state.auth);
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
          <Pressable onPress={() => item?.id && removeAddress(item?.id)}>
            <DELETE_ICON />
          </Pressable>
        </Pressable>
      );
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
        dispatch(setIsUserSignedIn(true));
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

  const onContinue = useCallback(() => {
    let formdata = new FormData();
    if (profileSetupUserData?.avatarId) {
      formdata.append('avatarId', profileSetupUserData?.avatarId);
    }
    if (profileSetupUserData?.KYCDocumentId) {
      formdata.append('KYCDocumentId', profileSetupUserData?.KYCDocumentId);
    }
    if (profileSetupUserData?.bio) {
      formdata.append('bio', profileSetupUserData?.bio);
    }
    if (profileSetupUserData?.latitude && profileSetupUserData?.longitude) {
      formdata.append('location[latitude]', profileSetupUserData?.latitude);
      formdata.append('location[longitude]', profileSetupUserData?.longitude);
    }
    profileSetupUserData?.interestIds?.map((item: string, index: number) =>
      formdata.append(`interestIds[${index}]`, item),
    );
    autocompleteAddressList?.map((item: addressType, index: number) => {
      item?.address &&
        formdata.append(`wishLists[${index}][address]`, item?.address);
      item?.city && formdata.append(`wishLists[${index}][city]`, item?.city);
      item?.state && formdata.append(`wishLists[${index}][state]`, item?.state);
      item?.country &&
        formdata.append(`wishLists[${index}][country]`, item?.country);
      item?.zipcode &&
        formdata.append(`wishLists[${index}][zipcode]`, item?.zipcode);
      item?.latitude &&
        formdata.append(`wishLists[${index}][latitude]`, item?.latitude);
      item?.longitude &&
        formdata.append(`wishLists[${index}][longitude]`, item?.longitude);
    });
    updateProfile(formdata);
  }, [autocompleteAddressList, profileSetupUserData]);

  return (
    <WrapperScreen
      onContinue={onContinue}
      onSkip={() => {
        if (
          profileSetupUserData &&
          Object.keys(profileSetupUserData).length > 0
        ) {
          onContinue();
        } else {
          dispatch(setIsUserSignedIn(true));
        }
      }}
      disabled={isUpdateProfileLoading || autocompleteAddressList.length === 0}
      loading={isUpdateProfileLoading}>
      <View style={styles.container}>
        <Text
          style={[
            styles.label,
            {
              color: COLORS.PRIMARY_TEXT_COLOR,
              fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
            },
          ]}>
          {t(LOCALES.PROFILE.DESCRIPTION_13)}
        </Text>
        <AutocompleteAddress
          setAutocompleteAddress={setAutocompleteAddress}
          placeholder={t(LOCALES.PROFILE.SELECT_PLACES)}
          isLocationModalScreen={false}
        />
        <View style={{marginBottom: 30}} />
        {autocompleteAddressList.map(renderItem)}
      </View>
    </WrapperScreen>
  );
};

export default BucketList;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  label: {
    alignSelf: 'center',
    marginBottom: 20,
    fontSize: responsiveFontSize(16),
  },
  card: {
    height: 62,
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  location: {
    height: 47,
    width: 47,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  labelContainer: {flex: 1, paddingHorizontal: 12},
});
