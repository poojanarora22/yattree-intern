import {StyleSheet} from 'react-native';
import React, {useRef, useState} from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import useTheme from '../../theme/hooks/useTheme';
import {responsiveFontSize} from '../../theme/responsiveFontSize';

type AutocompleteAddressType = {
  setAutocompleteAddress?: any;
  isLocationModalScreen?: boolean;
  placeholder?: string;
};

const AutocompleteAddress = ({
  setAutocompleteAddress,
  isLocationModalScreen = false,
  placeholder = '',
}: AutocompleteAddressType) => {
  const ref = useRef<any>();
  const {COLORS, FONTS} = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  return (
    <GooglePlacesAutocomplete
      ref={ref}
      placeholder={placeholder}
      onPress={(data, details = null) => {
        ref?.current?.clear();
        ref?.current?.setAddressText('');
        setAutocompleteAddress(details);
      }}
      fetchDetails={true}
      textInputProps={{
        placeholderTextColor: COLORS.INPUT_PLACEHOLDER_COLOR,
        onFocus: () => setIsFocused(true),
        onBlur: () => setIsFocused(false),
      }}
      styles={{
        textInputContainer: {
          backgroundColor: isLocationModalScreen
            ? COLORS.INPUT_BACKGROUND_COLOR
            : COLORS.PRIMARY_COLOR,
        },
        textInput: [
          styles.textInput,
          {
            backgroundColor: isLocationModalScreen
              ? COLORS.PRIMARY_COLOR
              : COLORS.INPUT_BACKGROUND_COLOR,
            borderColor: isFocused
              ? COLORS.INPUT_ACTIVE_BORDER_COLOR
              : COLORS.INPUT_INACTIVE_BORDER_COLOR,
            fontFamily: FONTS.MONTSERRAT.REGULAR,
            color: COLORS.INPUT_TEXT_COLOR,
          },
        ],
        row: {
          backgroundColor: isLocationModalScreen
            ? COLORS.INPUT_BACKGROUND_COLOR
            : COLORS.PRIMARY_COLOR,
        },
        description: {
          fontFamily: FONTS.MONTSERRAT.REGULAR,
          color: COLORS.INPUT_TEXT_COLOR,
        },
        separator: {
          height: 1,
          backgroundColor: COLORS.INPUT_INACTIVE_BORDER_COLOR,
        },
        poweredContainer: {display: 'none'},
      }}
      query={{
        key: 'AIzaSyBbdAc26bOvKQERg36EJEko9Zb7McBm98U',
        language: 'en',
        type: 'establishment',
      }}
    />
  );
};

export default AutocompleteAddress;

const styles = StyleSheet.create({
  textInput: {
    fontSize: responsiveFontSize(16),
    width: '100%',
    height: 56,
    borderRadius: 13,
    paddingHorizontal: 18,
    borderWidth: 1,
  },
});
