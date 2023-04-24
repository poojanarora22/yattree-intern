import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useMemo} from 'react';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import useTheme from '../../../../../../theme/hooks/useTheme';
import LOCALES from '../../../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {responsiveFontSize} from '../../../../../../theme/responsiveFontSize';
import {BlurView} from '@react-native-community/blur';
import AutocompleteAddress from '../../../../../../components/AutocompleteAddressModal';
import {GooglePlaceDetail} from 'react-native-google-places-autocomplete';

type LocationModalType = {
  bottomSheetModalRef: any;
  setIsModalOpen: any;
  setSelectedLocation?: any;
};

type addressType = {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  latitude?: string;
  longitude?: string;
};

const LocationModal = ({
  bottomSheetModalRef,
  setSelectedLocation,
  setIsModalOpen,
}: LocationModalType) => {
  const {FONTS, COLORS} = useTheme();
  const {t} = useTranslation();
  const snapPoints = useMemo(() => ['60%', '85%'], []);
  const [autocompleteAddress, setAutocompleteAddress] =
    React.useState<GooglePlaceDetail | null>(null);

  useEffect(() => {
    if (autocompleteAddress) {
      bottomSheetModalRef?.current?.close();
      let object: addressType = {};
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
      }
      setSelectedLocation(object);
    }
  }, [autocompleteAddress]);

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
      snapPoints={snapPoints}
      backgroundStyle={{backgroundColor: COLORS.MODAL_BACKGROUND_COLOR}}
      handleComponent={handleComponent}
      backdropComponent={renderBackdrop}
      onChange={(index: number) => setIsModalOpen(!(index < 1))}>
      <BottomSheetView style={[styles.contentContainerStyle]}>
        <View style={styles.container}>
          <Text
            style={[
              styles.location,
              {
                fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                color: COLORS.PRIMARY_TEXT_COLOR,
              },
            ]}>
            {t(LOCALES.HOME.SELECT_LOCATION)}
          </Text>
          <AutocompleteAddress
            setAutocompleteAddress={setAutocompleteAddress}
            isLocationModalScreen={true}
            placeholder={t(LOCALES.HOME.SEARCH_LOCATION)}
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default LocationModal;

const styles = StyleSheet.create({
  handle: {
    height: 3,
    width: 60,
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 15,
  },
  contentContainerStyle: {flex: 1},
  container: {
    flex: 1,
    marginHorizontal: 20,
  },
  location: {
    fontSize: responsiveFontSize(14),
    marginTop: 12,
    alignSelf: 'center',
    marginBottom: 30,
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
