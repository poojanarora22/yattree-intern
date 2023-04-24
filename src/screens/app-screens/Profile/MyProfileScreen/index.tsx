import {
  ActivityIndicator,
  Animated,
  Dimensions,
  LayoutChangeEvent,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import useTheme from '../../../../theme/hooks/useTheme';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import Setting from '../../../../assets/icons/svg/Setting';
import Edit from '../../../../assets/icons/svg/Edit';
import Interests from '../../../../assets/icons/svg/Interests';
import Map from '../../../../assets/icons/svg/Profile/Map';
import Back from '../../../../assets/icons/svg/Back';
import VerifyAccount from '../../../../assets/icons/svg/VerifyAccount';
import {MyProfileScreenProps} from '../../../../types/navigation/appTypes';
import {USER_PROFILE} from '../../../../assets/images';
import MapView from '../components/MapView';
import UserInfo from '../components/UserInfo';
import Button from '../../../../components/Button';
import TopTabsNavigator from '../TopTabsNavigator';
import LOCALES from '../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useApi} from '../../../../hooks/useApi';
import {URL} from '../../../../constants/URLS';
import {appAlert} from '../../../../components/appAlert';
import {setUserDetails} from '../../../../store/slice/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch, useAppSelector} from '../../../../store';
import {setProfileInformation} from '../../../../store/slice/profileSlice';

const MyProfileScreen = ({navigation}: MyProfileScreenProps) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {userDetails} = useAppSelector(state => state.auth);
  const completeProfileOptions = useMemo(
    () => [
      {
        id: 0,
        title: t(LOCALES.APP_PROFILE.LBL_ADD_INTERESTS),
        icon: <Interests />,
      },
      {
        id: 1,
        title: t(LOCALES.APP_PROFILE.LBL_ADD_BUCKET_LIST),
        icon: <Map color={COLORS.SECONDARY_COLOR} />,
      },
      {
        id: 2,
        title: t(LOCALES.APP_PROFILE.LBL_VERIFY_ACCOUNT),
        icon: <VerifyAccount />,
      },
    ],
    [],
  );
  const {top} = useSafeAreaInsets();
  const IconContainerHeight = 50;
  const StatusBarHeight =
    Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : top;
  const [height, setHeight] = useState(0);
  const onLayout = (event: LayoutChangeEvent) => {
    const {height} = event.nativeEvent.layout;
    setHeight(Math.round(height));
  };

  const scrollY = new Animated.Value(0);
  const getHeaderOpacity = () => {
    return scrollY.interpolate({
      inputRange: [0, 150],
      outputRange: [0, 1],
    });
  };
  const headerOpacity = getHeaderOpacity();

  const [getMyProfile, myProfileResponse, myProfileError, isMyProfileLoading] =
    useApi({
      url: URL.GET_MY_PROFILE,
      method: 'GET',
    });

  useEffect(() => {
    getMyProfile();
  }, []);

  useEffect(() => {
    const init = async () => {
      if (myProfileResponse) {
        if (myProfileResponse?.statusCode === 200) {
          dispatch(setUserDetails(myProfileResponse?.data));
          dispatch(
            setProfileInformation({
              name:
                myProfileResponse?.data?.firstName +
                ' ' +
                myProfileResponse?.data?.lastName,
              bio: myProfileResponse?.data?.bio,
              relationShipStatus: myProfileResponse?.data?.relationShipStatus,
              interests: myProfileResponse?.data?.interests,
              wishLists: myProfileResponse?.data?.wishLists,
              socialHandleLinks: myProfileResponse?.data?.socialHandleLinks,
            }),
          );
          await AsyncStorage.setItem(
            'userDetails',
            JSON.stringify(myProfileResponse?.data),
          );
        }
      }
    };
    init();
  }, [myProfileResponse]);

  useEffect(() => {
    if (myProfileError) {
      if (myProfileError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: myProfileError?.message,
        });
      }
    }
  }, [myProfileError]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.APP_BACKGROUND_COLOR,
      }}>
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle={BAR_STYLE}
      />
      <View
        style={[
          styles.icon,
          {
            paddingTop:
              Platform.OS === 'android' ? StatusBar.currentHeight : top,
          },
        ]}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: COLORS.PRIMARY_COLOR,
              opacity: headerOpacity,
            },
          ]}
        />
        <View
          style={[
            styles.row,
            {
              height: IconContainerHeight,
              alignItems: 'flex-start',
            },
          ]}>
          <Pressable onPress={() => navigation.goBack()} style={styles.more}>
            <Back />
          </Pressable>
          <Pressable
            onPress={() =>
              navigation.navigate('SettingStack', {
                screen: 'SettingsScreen',
              })
            }
            style={styles.more}>
            <Setting />
          </Pressable>
        </View>
      </View>
      {isMyProfileLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            height:
              Dimensions.get('screen').height +
              height -
              StatusBarHeight -
              IconContainerHeight -
              10,
          }}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {useNativeDriver: false},
          )}>
          <View onLayout={onLayout}>
            <MapView
              name={userDetails?.firstName}
              latitude={userDetails?.location?.latitude || 0}
              longitude={userDetails?.location?.longitude || 0}
            />
            <UserInfo
              isKycVerified={userDetails?.isKycVerified}
              isActiveSubscription={userDetails?.isActiveSubscription}
              name={userDetails?.firstName + ' ' + userDetails?.lastName}
              location={
                userDetails?.location?.city +
                `${userDetails?.location?.city ? ', ' : ''}` +
                userDetails?.location?.country
              }
              followerCount={userDetails?.followerCount}
              followingCount={userDetails?.followingCount}
              userProfile={
                userDetails?.avatar
                  ? {uri: userDetails?.avatar?.mediaUrl}
                  : USER_PROFILE
              }
              rate={`${userDetails?.ratedByPeople} / ${userDetails?.participatedTours}`}
              onRateReviews={() =>
                navigation.navigate('ReviewsScreen', {
                  isMyProfileScreen: true,
                  userId: userDetails?.id,
                })
              }
            />
            <View style={styles.editProfile}>
              <Button
                title={t(LOCALES.APP_PROFILE.LBL_EDIT_PROFILE)}
                onPress={() => {
                  navigation.navigate('SettingStack', {
                    screen: 'PersonalInformation',
                  });
                }}
              />
              <Pressable
                style={[
                  styles.row,
                  {
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderBottomWidth:
                      userDetails?.interests?.length > 0 &&
                      userDetails?.wishLists?.length > 0 &&
                      userDetails?.isKycVerified
                        ? 0
                        : 1,
                    borderColor: COLORS.CHIP_INACTIVE_BORDER_COLOR,
                    marginTop: 35,
                  },
                ]}
                onPress={() => navigation.navigate('ProfileStatus')}>
                <View
                  style={{
                    width: '90%',
                  }}>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(14),
                      fontFamily: FONTS.MONTSERRAT.MEDIUM,
                      color: COLORS.PRIMARY_TEXT_COLOR,
                    }}>
                    {t(LOCALES.APP_PROFILE.LBL_WHATS_YOUR_MIND)}
                  </Text>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(14),
                      marginTop: 5,
                      fontFamily: FONTS.MONTSERRAT.REGULAR,
                      color: COLORS.SECONDARY_TEXT_COLOR,
                    }}>
                    {userDetails?.statusText}
                  </Text>
                </View>
                <Edit />
              </Pressable>
            </View>
            {userDetails?.interests?.length > 0 &&
            userDetails?.wishLists?.length > 0 &&
            userDetails?.isKycVerified ? null : (
              <View style={styles.completeProfile}>
                <Text
                  style={{
                    fontSize: responsiveFontSize(14),
                    marginHorizontal: 20,
                    marginBottom: 20,
                    fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                    color: COLORS.PRIMARY_TEXT_COLOR,
                  }}>
                  {t(LOCALES.APP_PROFILE.LBL_COMPLETE_PROFILE)}
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {completeProfileOptions.map(item => {
                    if (item.id === 0 && userDetails?.interests?.length > 0) {
                      return null;
                    }
                    if (item.id === 1 && userDetails?.wishLists?.length > 0) {
                      return null;
                    }
                    if (item.id === 2 && userDetails?.isKycVerified) {
                      return null;
                    }
                    return (
                      <Pressable
                        key={item?.id}
                        onPress={() => {
                          if (item?.id === 0) {
                            navigation.navigate('SettingStack', {
                              screen: 'MyInterests',
                            });
                          } else if (item?.id === 1) {
                            navigation.navigate('SettingStack', {
                              screen: 'BucketList',
                            });
                          } else if (item?.id === 2) {
                            navigation.navigate('SettingStack', {
                              screen: 'ProfileVerification',
                            });
                          } else {
                          }
                        }}>
                        <View
                          style={[
                            styles.iconContainer,
                            {backgroundColor: COLORS.PRIMARY_CHIP_COLOR},
                          ]}>
                          {item?.icon}
                        </View>
                        <View
                          style={[
                            styles.labelContainer,
                            {
                              backgroundColor:
                                COLORS.COMPLETE_PROFILE_TEXT_COLOR,
                            },
                          ]}>
                          <Text
                            style={{
                              fontFamily: FONTS.MONTSERRAT.MEDIUM,
                              fontSize: responsiveFontSize(12),
                              color: COLORS.PRIMARY_TEXT_COLOR,
                            }}>
                            {item?.title}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
            )}
          </View>
          <TopTabsNavigator isMyProfileScreen={true} id={userDetails?.id} />
        </ScrollView>
      )}
    </View>
  );
};

export default MyProfileScreen;

const styles = StyleSheet.create({
  container: {},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editProfile: {
    marginVertical: 20,
    marginHorizontal: 20,
  },
  completeProfile: {
    marginBottom: 35,
  },
  iconContainer: {
    width: 130,
    height: 100,
    borderTopLeftRadius: 11,
    borderTopRightRadius: 11,
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  labelContainer: {
    width: 130,
    height: 40,
    borderBottomLeftRadius: 11,
    borderBottomRightRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  more: {
    height: 24,
    width: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginTop: 10,
  },
  icon: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
