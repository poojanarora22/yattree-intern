import {
  Image,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {
  LegacyRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import MapView, {
  Callout,
  Camera,
  Details,
  MapStyleElement,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps';
import {MAP_BG_2, USER_PROFILE} from '../../../assets/images';
import useTheme from '../../../theme/hooks/useTheme';
import {responsiveFontSize} from '../../../theme/responsiveFontSize';
import Switch from '../../../components/Switch';
import MapIcon from '../../../assets/icons/svg/MapLocationIcon';
import Plus from '../../../assets/icons/svg/Plus';
import Minus from '../../../assets/icons/svg/Minus';
import {useApi} from '../../../hooks/useApi';
import {URL} from '../../../constants/URLS';
import {appAlert} from '../../../components/appAlert';
import LOCALES from '../../../localization/constants';
import {useTranslation} from 'react-i18next';
import Geolocation from '@react-native-community/geolocation';
import {useDebounce} from '../../../hooks/useDebounce';
import {BlurView} from '@react-native-community/blur';
import {useAppSelector} from '../../../store';
import {useIsFocused} from '@react-navigation/native';

export const mapStyle: MapStyleElement[] = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#212121',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#212121',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#181818',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#1b1b1b',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#2c2c2c',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#8a8a8a',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [
      {
        color: '#373737',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#3c3c3c',
      },
    ],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry',
    stylers: [
      {
        color: '#4e4e4e',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#000000',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#3d3d3d',
      },
    ],
  },
];

const Map = () => {
  const {COLORS, FONTS} = useTheme();
  const mapRef: LegacyRef<MapView> = useRef(null);
  const {t} = useTranslation();
  const {userDetails} = useAppSelector(state => state.auth);
  const [isOnline, setIsOnline] = useState(
    userDetails?.permissions?.shareLocation || false,
  );
  const [Permissions, setPermissions] = useState<any>(null);
  const isFocused = useIsFocused();
  const [nearByUser, setNearByUser] = useState([]);
  const [isSwitchToggle, setIsSwitchToggle] = useState(false);
  const [showBlurView, setShowBlurView] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [region, setRegion] = useState<Region | null>(null);
  const [location, setLocation] = useState({
    latitude: 51.50853,
    longitude: -0.076132,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const name = useMemo(
    () => [
      {
        color: COLORS.PRIMARY_TEXT_COLOR,
        fontSize: responsiveFontSize(12),
        fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
      },
    ],
    [],
  );
  const status = useMemo(
    () => [
      {
        color: COLORS.PRIMARY_TEXT_COLOR,
        fontSize: responsiveFontSize(12),
        fontFamily: FONTS.MONTSERRAT.REGULAR,
      },
    ],
    [],
  );

  const onMarkerPress = useCallback((latitude: number, longitude: number) => {
    mapRef?.current?.animateToRegion(
      {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      200,
    );
  }, []);

  const goToCurrentLocation = useCallback(() => {
    mapRef?.current?.animateToRegion(location, 1000);
  }, [location]);

  const onZoomOutPress = useCallback(() => {
    mapRef?.current?.getCamera().then((cam: Camera) => {
      if (cam.zoom) cam.zoom += 1;
      mapRef?.current?.animateCamera(cam);
    });
  }, []);

  const onZoomInPress = useCallback(() => {
    mapRef?.current?.getCamera().then((cam: Camera) => {
      if (cam.zoom) cam.zoom -= 1;
      mapRef?.current?.animateCamera(cam);
    });
  }, []);

  const [
    getPermissionsData,
    permissionsResponse,
    permissionsError,
    isPermissionsLoading,
  ] = useApi({
    url: URL.PERMISSION,
    method: 'GET',
  });

  const [
    updatePermissionsData,
    updatePermissionsResponse,
    updatePermissionsError,
    isUpdatePermissionsLoading,
  ] = useApi({
    url: URL.PERMISSION,
    method: 'PUT',
  });

  useEffect(() => {
    if (updatePermissionsResponse) {
      if (updatePermissionsResponse?.statusCode === 200) {
        if (region) {
          const radius = region.latitudeDelta * 111.045;
          const data = {
            locateMeOnMap: isOnline,
            radius: radius,
            latitude: region.latitude,
            longitude: region.longitude,
          };
          getNearByUsersList(data);
        }
      }
    }
  }, [updatePermissionsResponse]);

  useEffect(() => {
    if (isSwitchToggle && Permissions) {
      const data = {
        locationService: Permissions?.locationService,
        shareLocation: isOnline,
        allowComments: Permissions?.allowComments,
      };
      updatePermissionsData(data);
    }
  }, [isOnline, isSwitchToggle]);

  useEffect(() => {
    if (isFocused && userDetails?.isActiveSubscription) {
      getPermissionsData();
    }
  }, [isFocused]);

  useEffect(() => {
    if (isFocused && !userDetails?.isActiveSubscription) {
      setShowBlurView(true);
      setErrorMsg('Please buy a subscription to access the map features');
    }
  }, [isFocused, userDetails]);

  useEffect(() => {
    if (permissionsResponse) {
      if (permissionsResponse?.statusCode === 200) {
        const result: any = permissionsResponse?.data?.permissionSettings;
        setPermissions(result);
        if (result?.locationService) {
          Geolocation.getCurrentPosition(
            info => {
              setLocation({
                ...location,
                latitude: info.coords.latitude,
                longitude: info.coords.longitude,
              });
              setIsOnline(result?.shareLocation || false);
              setShowBlurView(false);
              setErrorMsg('');
            },
            error => {
              setErrorMsg(error.message);
              setShowBlurView(true);
            },
          );
        } else {
          setErrorMsg(
            'Please enable location services from app settings to view the map',
          );
          setShowBlurView(true);
        }
      }
    }
  }, [permissionsResponse]);

  useEffect(() => {
    if (permissionsError) {
      if (permissionsError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: permissionsError?.message,
        });
      }
    }
  }, [permissionsError]);

  const [
    getNearByUsersList,
    nearByUserListResponse,
    nearByUserListError,
    isNearByUserListLoading,
  ] = useApi({
    url: URL.GET_USER_LOCATION,
    method: 'PUT',
  });

  useEffect(() => {
    if (nearByUserListResponse) {
      if (nearByUserListResponse?.statusCode === 200) {
        if (nearByUserListResponse?.data?.users?.length > 0) {
          setNearByUser(nearByUserListResponse?.data?.users);
        } else {
          setNearByUser([]);
        }
      }
    }
  }, [nearByUserListResponse]);

  useEffect(() => {
    if (nearByUserListError) {
      if (nearByUserListError?.statusCode === 400) {
        // appAlert({
        //   title: t(LOCALES.ERROR.LBL_ERROR),
        //   message: nearByUserListError?.message,
        // });
      }
    }
  }, [nearByUserListError]);

  useEffect(() => {
    if (region && userDetails?.isActiveSubscription) {
      const radius = region.latitudeDelta * 111.045;
      const data = {
        locateMeOnMap: isOnline,
        radius: radius,
        latitude: region.latitude,
        longitude: region.longitude,
      };
      getNearByUsersList(data);
    }
  }, [region]);

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: COLORS.APP_BACKGROUND_COLOR},
      ]}>
      <View style={styles.map}>
        <MapView
          scrollEnabled={userDetails?.isActiveSubscription}
          ref={mapRef}
          onRegionChangeComplete={(region: Region) => setRegion(region)}
          style={styles.map}
          region={location}
          provider={PROVIDER_GOOGLE}
          customMapStyle={mapStyle}>
          {nearByUser.map((marker: any, index: number) => (
            <Marker
              key={index}
              zIndex={index}
              tracksViewChanges={!isNearByUserListLoading}
              coordinate={{
                latitude: marker?.location?.latitude,
                longitude: marker?.location?.longitude,
              }}
              onPress={() =>
                onMarkerPress(
                  marker?.location?.latitude,
                  marker?.location?.longitude,
                )
              }>
              <ImageBackground
                source={MAP_BG_2}
                style={styles.userProfileImageBackground}>
                <Image
                  source={
                    marker?.avatar
                      ? {uri: marker?.avatar?.mediaUrl}
                      : USER_PROFILE
                  }
                  style={styles.image}
                />
              </ImageBackground>
              <Callout tooltip>
                <View
                  style={[
                    styles.userStatusContainer,
                    {backgroundColor: COLORS.SECONDARY_COLOR},
                  ]}>
                  <Text style={name}>
                    {marker?.firstName} {marker?.lastName}
                  </Text>
                  <Text style={status} numberOfLines={1}>
                    {marker?.statusText}
                  </Text>
                </View>
                <View
                  style={[
                    styles.dotContainer,
                    {backgroundColor: COLORS.SECONDARY_COLOR},
                  ]}>
                  <View
                    style={[
                      styles.dot,
                      {backgroundColor: COLORS.TERTIARY_COLOR},
                    ]}
                  />
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
        <View style={styles.iconContainer}>
          <Pressable
            onPress={goToCurrentLocation}
            style={[styles.mapIcon, {backgroundColor: COLORS.TERTIARY_COLOR}]}>
            <MapIcon />
          </Pressable>
          <View style={{marginBottom: 20}} />
          <View
            style={{
              backgroundColor: COLORS.TERTIARY_COLOR,
              borderRadius: 8,
            }}>
            <Pressable style={styles.plusIcon} onPress={onZoomOutPress}>
              <Plus />
            </Pressable>
            <View style={styles.line} />
            <Pressable style={styles.plusIcon} onPress={onZoomInPress}>
              <Minus />
            </Pressable>
          </View>
        </View>
      </View>
      <View style={styles.row}>
        <View>
          <Text
            style={{
              fontSize: responsiveFontSize(12),
              fontFamily: FONTS.MONTSERRAT.MEDIUM,
              color: COLORS.PRIMARY_TEXT_COLOR,
              marginBottom: 5,
            }}>
            Online
          </Text>
          <Text
            style={{
              fontSize: responsiveFontSize(10),
              fontFamily: FONTS.MONTSERRAT.REGULAR,
              color: COLORS.SECONDARY_TEXT_COLOR,
            }}>
            Would you like to show your location and status on map
          </Text>
        </View>
        <Switch
          value={isOnline}
          onChange={() => {
            setIsOnline(!isOnline);
            setIsSwitchToggle(true);
          }}
        />
      </View>

      {showBlurView && (
        <BlurView
          style={styles.absolute}
          blurType="dark"
          blurAmount={5}
          reducedTransparencyFallbackColor="white">
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: COLORS.PRIMARY_TEXT_COLOR,
                fontFamily: FONTS.MONTSERRAT.MEDIUM,
                textAlign: 'center',
                textAlignVertical:
                  Platform.OS === 'android' ? 'center' : 'auto',
                paddingHorizontal: 20,
              }}>
              {errorMsg}
            </Text>
          </View>
        </BlurView>
      )}
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  userProfileImageBackground: {
    height: 47,
    width: 42,
    padding: 2,
    marginTop: 15,
  },
  userStatusContainer: {
    height: 50,
    width: 300,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 38,
    width: 38,
    borderRadius: 19,
  },
  markerContainer: {
    alignItems: 'center',
  },
  row: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 20,
    paddingVertical: 10,
  },
  plusIcon: {
    height: 41,
    width: 41,
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    height: 1,
    width: 29,
    alignSelf: 'center',
    backgroundColor: '#D9D9D9',
  },
  mapIcon: {
    height: 41,
    width: 41,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: 20,
    right: 20,
  },
  dotContainer: {
    alignSelf: 'center',
    marginTop: -9,
    height: 18,
    width: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 4,
  },
});
