import {StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import useTheme from '../../../../../theme/hooks/useTheme';
import {responsiveFontSize} from '../../../../../theme/responsiveFontSize';
import Location from '../../../../../assets/icons/svg/MapLocation';
import LinearGradient from 'react-native-linear-gradient';
import LOCALES from '../../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {mapStyle} from '../../../Map';

type MapViewScreenTypes = {
  name: string;
  latitude: number;
  longitude: number;
};

const MapViewScreen = ({
  name = '',
  latitude,
  longitude,
}: MapViewScreenTypes) => {
  const {COLORS, FONTS} = useTheme();
  const {t} = useTranslation();

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
        scrollEnabled={false}>
        <Marker
          coordinate={{
            latitude: latitude,
            longitude: longitude,
          }}>
          <View style={styles.markerContainer}>
            <View
              style={[
                styles.marker,
                {
                  backgroundColor: COLORS.INPUT_BACKGROUND_COLOR,
                  borderColor: COLORS.INPUT_INACTIVE_BORDER_COLOR,
                },
              ]}>
              <Text
                style={{
                  fontSize: responsiveFontSize(12),
                  fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                  color: COLORS.PRIMARY_TEXT_COLOR,
                }}>
                {name}
                {t(LOCALES.APP_PROFILE.LBL_CURRENT_LOCATION)}
              </Text>
            </View>
            <Location />
          </View>
        </Marker>
      </MapView>
      <LinearGradient
        colors={['#00000000', '#000000']}
        locations={[0.5, 1]}
        useAngle
        angle={180}
        style={styles.linearGradient}
      />
    </View>
  );
};

export default MapViewScreen;

const styles = StyleSheet.create({
  mapContainer: {},
  map: {
    height: 244,
    width: '100%',
  },
  linearGradient: {
    position: 'absolute',
    height: 244,
    width: '100%',
    zIndex: 9,
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    padding: 10,
    borderRadius: 9,
    borderWidth: 1,
    marginBottom: 8,
  },
});
