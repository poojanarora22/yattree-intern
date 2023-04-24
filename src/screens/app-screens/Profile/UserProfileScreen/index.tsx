import {
  Dimensions,
  LayoutChangeEvent,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Animated,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import useTheme from '../../../../theme/hooks/useTheme';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import MapView from '../components/MapView';
import UserInfo from '../components/UserInfo';
import TopTabsNavigator from '../TopTabsNavigator';
import {HOME_PROFILE_3, USER_PROFILE} from '../../../../assets/images';
import {UserProfileScreenProps} from '../../../../types/navigation/appTypes';
import More from '../../../../assets/icons/svg/More';
import Report from '../../../../assets/icons/svg/Report';
import Block from '../../../../assets/icons/svg/Block';
import Back from '../../../../assets/icons/svg/Back';
import Button from '../../../../components/Button';
import LOCALES from '../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useApi} from '../../../../hooks/useApi';
import {URL} from '../../../../constants/URLS';
import {appAlert} from '../../../../components/appAlert';
import {useAppDispatch, useAppSelector} from '../../../../store';
import {setProfileInformation} from '../../../../store/slice/profileSlice';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import ReportModal from '../../Forums/ReportModal';
import {io, Socket} from 'socket.io-client';
import {getTokens, getVerifiedToken} from '../../../../utilities/token';

const UserProfileScreen = ({navigation, route}: UserProfileScreenProps) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {userId} = route?.params;
  const reportModalRef = useRef<BottomSheetModal>(null);
  const {top} = useSafeAreaInsets();
  const [showTooltip, setShowTooltip] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [following, setFollowing] = useState<any>(null);
  const [followed, setFollowed] = useState<any>(null);
  const {userDetails: myDetails} = useAppSelector(state => state.auth);
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
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messageConversationIdLoading, setMessageConversationIdLoading] =
    useState(false);

  useEffect(() => {
    const initSocket = async () => {
      const tokens = await getTokens();
      const newTokens = await getVerifiedToken(tokens);
      const socket = io('https://yaatrees-api-staging.thinkwik.dev:3000', {
        path: '/api/socket.io',
        transportOptions: {
          polling: {
            extraHeaders: {
              'x-client-id': '2a4ryDvb8ZZ3C3D2',
              'x-client-device': 'react-native',
              'x-auth-token': newTokens?.accessToken,
            },
          },
        },
      });
      setSocket(socket);
    };
    initSocket();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.emit('joinUserRoom');
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on('conversationId', res => {
      console.log('conversationId....', res);
      const user = res?.data?.conversation?.members?.find(
        (item: any) => item?.userId === userId,
      )?.user;
      setMessageConversationIdLoading(false);
      if (!user) return;
      navigation.navigate('ChatStack', {
        screen: 'ChatDetails',
        params: {
          conversationsId: res?.data?.conversation?.id,
          userId: user?.id,
          name: user?.firstName + ' ' + user?.lastName,
          isActiveSubscription: user?.isActiveSubscription,
          isKycVerified: user?.isKycVerified,
          imageUri: user?.avatar
            ? {
                uri: user?.avatar?.mediaUrl,
              }
            : USER_PROFILE,
        },
      });
    });
  }, [socket, userId]);

  const [
    getOtherUserProfile,
    otherUserProfileResponse,
    otherUserProfileError,
    isOtherUserLoading,
  ] = useApi({
    url: URL.GET_OTHER_USER_PROFILE + userId,
    method: 'GET',
  });

  useEffect(() => {
    getOtherUserProfile();
  }, [userId]);

  useEffect(() => {
    if (otherUserProfileResponse) {
      if (otherUserProfileResponse?.statusCode === 200) {
        const result = otherUserProfileResponse?.data?.user;
        setFollowing(result?.following);
        setFollowed(result?.followed);
        setUserDetails(result);
        dispatch(
          setProfileInformation({
            name: result?.firstName + ' ' + result?.lastName,
            bio: result?.bio,
            interests: result?.interests,
            wishLists: result?.wishLists,
            socialHandleLinks: result?.socialHandleLinks,
          }),
        );
      }
    }
  }, [otherUserProfileResponse]);

  useEffect(() => {
    if (otherUserProfileError) {
      if (otherUserProfileError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: otherUserProfileError?.message,
        });
      }
    }
  }, [otherUserProfileError]);

  const [followUser, followUserResponse, followUserError, isFollowUserLoading] =
    useApi({
      url: URL.FOLLOW_USER,
      method: 'POST',
    });

  const [
    unFollowUser,
    unFollowUserResponse,
    unFollowUserError,
    isUnFollowUserLoading,
  ] = useApi({
    url: URL.UNFOLLOW_USER,
    method: 'POST',
  });

  useEffect(() => {
    if (followUserResponse) {
      if (followUserResponse?.statusCode === 200) {
        setFollowing(followUserResponse?.data?.user);
      }
    }
  }, [followUserResponse]);

  useEffect(() => {
    if (followUserError) {
      if (followUserError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: followUserError?.message,
        });
      }
    }
  }, [followUserError]);

  useEffect(() => {
    if (unFollowUserResponse) {
      if (unFollowUserResponse?.statusCode === 200) {
        setFollowing(null);
      }
    }
  }, [unFollowUserResponse]);

  useEffect(() => {
    if (unFollowUserError) {
      if (unFollowUserError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: unFollowUserError?.message,
        });
      }
    }
  }, [unFollowUserError]);

  const getFollowButtonTitle = () => {
    if (following) {
      if (following?.isAccepted) {
        return t(LOCALES.APP_PROFILE.LBL_UNFOLLOW);
      } else {
        return t(LOCALES.APP_PROFILE.LBL_REQUESTED);
      }
    } else {
      if (followed && followed?.isAccepted) {
        return 'Follow back';
      } else {
        return t(LOCALES.APP_PROFILE.LBL_FOLLOW);
      }
    }
  };

  const handleReportModalPress = useCallback(() => {
    reportModalRef?.current?.present();
  }, []);

  const [blockUser, blockUserResponse, blockUserError, isBlockUserLoading] =
    useApi({
      url: URL.BLOCK,
      method: 'POST',
    });

  useEffect(() => {
    if (blockUserResponse) {
      if (blockUserResponse?.statusCode === 200) {
        appAlert({
          title: t(LOCALES.SUCCESS.LBL_SUCCESS),
          message: t(LOCALES.SUCCESS.LBL_BLOCK_USER_SUCCESS),
        });
        setShowTooltip(false);
        navigation.goBack();
      }
    }
  }, [blockUserResponse]);

  useEffect(() => {
    if (blockUserError) {
      if (blockUserError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: blockUserError?.message,
        });
        setShowTooltip(false);
      }
    }
  }, [blockUserError]);

  const renderTooltip = useCallback(() => {
    return (
      <View
        style={[
          styles.tooltip,
          {
            backgroundColor: COLORS.PRIMARY_CHIP_COLOR,
            borderColor: COLORS.CHIP_INACTIVE_BORDER_COLOR,
            top:
              Platform.OS === 'android'
                ? //@ts-ignore
                  StatusBar.currentHeight + IconContainerHeight
                : top + IconContainerHeight,
          },
        ]}>
        <Pressable
          onPress={() => {
            const data = {
              blockedUserId: userId,
            };
            blockUser(data);
          }}
          style={styles.tooltipLabelContainer}>
          <Block />
          <Text
            style={{
              color: COLORS.PRIMARY_TEXT_COLOR,
              fontSize: responsiveFontSize(14),
              fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
              marginLeft: 18,
              marginRight: 18,
            }}>
            {t(LOCALES.APP_PROFILE.LBL_BLOCK_USER)}
          </Text>
          {isBlockUserLoading && <ActivityIndicator />}
        </Pressable>
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: COLORS.CHIP_INACTIVE_BORDER_COLOR,
          }}
        />
        <Pressable
          onPress={() => {
            setShowTooltip(false);
            handleReportModalPress();
          }}
          style={styles.tooltipLabelContainer}>
          <Report />
          <Text
            style={{
              color: COLORS.PRIMARY_TEXT_COLOR,
              fontSize: responsiveFontSize(14),
              fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
              marginLeft: 18,
            }}>
            {t(LOCALES.APP_PROFILE.LBL_REPORT_USER)}
          </Text>
        </Pressable>
      </View>
    );
  }, [showTooltip, isBlockUserLoading]);

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
        <Pressable
          onPress={() => {
            setShowTooltip(false);
          }}
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
          <Pressable onPress={() => setShowTooltip(true)} style={styles.more}>
            <More />
          </Pressable>
        </Pressable>
      </View>
      {isOtherUserLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator />
        </View>
      ) : (
        <>
          {userDetails ? (
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
              <Pressable
                onLayout={onLayout}
                onPress={() => {
                  setShowTooltip(false);
                }}>
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
                    navigation.push('ReviewsScreen', {
                      isMyProfileScreen: false,
                      userId: userDetails?.id,
                    })
                  }
                />
                <View style={styles.userInstruction}>
                  <Button
                    title={getFollowButtonTitle()}
                    containerStyle={{
                      width: '45%',
                      backgroundColor:
                        following && !following?.isAccepted
                          ? COLORS.PRIMARY_CHIP_COLOR
                          : COLORS.SECONDARY_COLOR,
                    }}
                    disabled={isFollowUserLoading || isUnFollowUserLoading}
                    loading={isFollowUserLoading || isUnFollowUserLoading}
                    onPress={() => {
                      if (following) {
                        const data = {
                          followingId: following?.followingId,
                        };
                        unFollowUser(data);
                      } else {
                        const data = {
                          followingId: userDetails?.id,
                        };
                        followUser(data);
                      }
                    }}
                  />
                  <Button
                    title={t(LOCALES.APP_PROFILE.LBL_MESSAGE)}
                    containerStyle={{
                      width: '45%',
                      backgroundColor: COLORS.PRIMARY_CHIP_COLOR,
                      opacity: myDetails?.isActiveSubscription
                        ? 1
                        : following?.isAccepted
                        ? 1
                        : 0.5,
                    }}
                    disabled={
                      messageConversationIdLoading ||
                      myDetails?.isActiveSubscription
                        ? false
                        : following?.isAccepted
                        ? false
                        : true
                    }
                    loading={messageConversationIdLoading}
                    onPress={() => {
                      if (!socket) return;
                      setMessageConversationIdLoading(true);
                      socket.emit('getConversationsId', {userId: userId});
                    }}
                  />
                </View>
                <View style={styles.status}>
                  <Text
                    style={{
                      fontFamily: FONTS.MONTSERRAT.MEDIUM,
                      color: COLORS.PRIMARY_TEXT_COLOR,
                      fontSize: responsiveFontSize(14),
                      textAlign: 'center',
                    }}>
                    {userDetails?.firstName}
                    {t(LOCALES.APP_PROFILE.LBL_STATUS)}
                  </Text>
                  <Text
                    style={{
                      fontFamily: FONTS.MONTSERRAT.REGULAR,
                      color: COLORS.SECONDARY_TEXT_COLOR,
                      fontSize: responsiveFontSize(14),
                      textAlign: 'center',
                      marginBottom: 5,
                    }}>
                    {userDetails?.statusText}
                  </Text>
                </View>
              </Pressable>
              <TopTabsNavigator
                isMyProfileScreen={false}
                id={userDetails?.id}
              />
            </ScrollView>
          ) : (
            <View style={styles.nodata}>
              <Text
                style={{
                  color: COLORS.PRIMARY_TEXT_COLOR,
                  fontFamily: FONTS.MONTSERRAT.BOLD,
                  textAlign: 'center',
                }}>
                {t(LOCALES.SUCCESS.LBL_NO_DATA)}
              </Text>
            </View>
          )}
        </>
      )}
      {showTooltip && renderTooltip()}
      <ReportModal
        bottomSheetModalRef={reportModalRef}
        reportType={'USER'}
        reportId={userId}
      />
    </View>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  userInstruction: {
    marginVertical: 30,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    marginTop: 10,
    marginBottom: 40,
  },
  tooltip: {
    position: 'absolute',
    right: 27,
    top: 0,
    width: 216,
    borderRadius: 17,
    borderWidth: 1,
  },
  tooltipLabelContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
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
  nodata: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
