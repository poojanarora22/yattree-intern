import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {responsiveFontSize} from '../../../theme/responsiveFontSize';
import useTheme from '../../../theme/hooks/useTheme';
import LOCALES from '../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import {NotificationScreenProps} from '../../../types/navigation/appTypes';
import {HOME_2, USER_PROFILE} from '../../../assets/images';
import Chip from '../../../components/Chip';
import {useApi} from '../../../hooks/useApi';
import {appAlert} from '../../../components/appAlert';
import {URL} from '../../../constants/URLS';
import {useAppSelector} from '../../../store';
import moment from 'moment';
import Button from '../../../components/Button';
import {useIsFocused} from '@react-navigation/native';
import Premium from '../../../assets/icons/svg/premium';
import Verify from '../../../assets/icons/svg/Verify';

type sectionType = {
  title: string;
  data: {}[];
};

const Notifications = ({navigation}: NotificationScreenProps) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();
  const {userDetails} = useAppSelector(state => state.auth);
  const [page, setPage] = useState(2);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();
  const [notificationsList, setNotificationsList] = useState<sectionType[]>([]);

  const titleStyles = useMemo(
    () => [
      {
        color: COLORS.PRIMARY_TEXT_COLOR,
        fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
        fontSize: responsiveFontSize(14),
        marginBottom: 6,
      },
    ],
    [COLORS, FONTS],
  );

  const descriptionStyles = useMemo(
    () => [
      {
        color: COLORS.COMMENTS_TEXT_COLOR,
        fontFamily: FONTS.MONTSERRAT.MEDIUM,
        fontSize: responsiveFontSize(12),
      },
    ],
    [COLORS, FONTS],
  );

  const [
    getNotificationList,
    notificationListResponse,
    notificationListError,
    isNotificationLoading,
  ] = useApi({
    url: URL.GET_NOTIFICATION_LIST + '?page=1&limit=200',
    method: 'GET',
  });

  useEffect(() => {
    if (isFocused) {
      getNotificationList();
    }
  }, [isFocused]);

  useEffect(() => {
    if (notificationListResponse) {
      if (notificationListResponse?.statusCode === 200) {
        setRefreshing(false);
        setTotalPages(notificationListResponse?.data?.totalPages);
        const array: sectionType[] = [];
        const todayArr: any = [];
        const weekArr: any = [];
        const monthArr: any = [];

        let month = moment().add(-1, 'month').format('YYYY-MM-DD');
        let week = moment().add(-1, 'week').format('YYYY-MM-DD');
        let today = moment().format('YYYY-MM-DD');

        notificationListResponse?.data?.notifications?.map((item: any) => {
          if (moment().isSame(item?.updatedAt, 'day')) {
            todayArr.push(item);
          }
          if (moment(item?.updatedAt).isBetween(week, today)) {
            weekArr.push(item);
          }
          if (moment(item?.updatedAt).isBetween(month, week)) {
            monthArr.push(item);
          }
        });
        if (todayArr.length > 0) {
          array.push({
            title: 'Today',
            data: todayArr,
          });
        }
        if (weekArr.length > 0) {
          array.push({
            title: 'This week',
            data: weekArr,
          });
        }
        if (monthArr.length > 0) {
          array.push({
            title: 'This month',
            data: monthArr,
          });
        }
        setNotificationsList(array);
      }
    }
  }, [notificationListResponse]);

  useEffect(() => {
    if (notificationListError) {
      if (notificationListError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: notificationListError?.message,
        });
        setRefreshing(false);
      }
    }
  }, [notificationListError]);

  const Item = ({
    item,
    index,
    section,
  }: {
    item: any;
    index: number;
    section: sectionType;
  }) => {
    const [
      acceptFollowRequest,
      acceptFollowRequestResponse,
      acceptFollowRequestError,
      isAcceptFollowRequestLoading,
    ] = useApi({
      url: URL.ACCEPT_FOLLOW_REQUEST,
      method: 'PUT',
    });

    useEffect(() => {
      if (acceptFollowRequestResponse) {
        if (acceptFollowRequestResponse?.statusCode === 200) {
          getNotificationList();
        }
      }
    }, [acceptFollowRequestResponse]);

    useEffect(() => {
      if (acceptFollowRequestError) {
        if (acceptFollowRequestError?.statusCode === 400) {
          appAlert({
            title: t(LOCALES.ERROR.LBL_ERROR),
            message: acceptFollowRequestError?.message,
          });
        }
      }
    }, [acceptFollowRequestError]);

    const [
      rejectFollowRequest,
      rejectFollowRequestResponse,
      rejectFollowRequestError,
      isRejectFollowRequestLoading,
    ] = useApi({
      url: URL.REJECT_FOLLOW_REQUEST,
      method: 'PUT',
    });

    useEffect(() => {
      if (rejectFollowRequestResponse) {
        if (rejectFollowRequestResponse?.statusCode === 200) {
          getNotificationList();
        }
      }
    }, [rejectFollowRequestResponse]);

    useEffect(() => {
      if (rejectFollowRequestError) {
        if (rejectFollowRequestError?.statusCode === 400) {
          appAlert({
            title: t(LOCALES.ERROR.LBL_ERROR),
            message: rejectFollowRequestError?.message,
          });
        }
      }
    }, [rejectFollowRequestError]);

    const [
      acceptParticipateRequest,
      acceptParticipateRequestResponse,
      acceptParticipateRequestError,
      isAcceptParticipateRequestLoading,
    ] = useApi({
      url: URL.ACCEPT_PARTICIPANTS_REQUEST,
      method: 'PUT',
    });

    useEffect(() => {
      if (acceptParticipateRequestResponse) {
        if (acceptParticipateRequestResponse?.statusCode === 200) {
          getNotificationList();
        }
      }
    }, [acceptParticipateRequestResponse]);

    useEffect(() => {
      if (acceptParticipateRequestError) {
        if (acceptParticipateRequestError?.statusCode === 400) {
          appAlert({
            title: t(LOCALES.ERROR.LBL_ERROR),
            message: acceptParticipateRequestError?.message,
          });
        }
      }
    }, [acceptParticipateRequestError]);

    const [
      rejectParticipateRequest,
      rejectParticipateRequestResponse,
      rejectParticipateRequestError,
      isRejectParticipateRequestLoading,
    ] = useApi({
      url: URL.REJECT_PARTICIPANTS_REQUEST,
      method: 'DELETE',
    });

    useEffect(() => {
      if (rejectParticipateRequestResponse) {
        if (rejectParticipateRequestResponse?.statusCode === 200) {
          getNotificationList();
        }
      }
    }, [rejectParticipateRequestResponse]);

    useEffect(() => {
      if (rejectParticipateRequestError) {
        if (rejectParticipateRequestError?.statusCode === 400) {
          appAlert({
            title: t(LOCALES.ERROR.LBL_ERROR),
            message: rejectParticipateRequestError?.message,
          });
        }
      }
    }, [rejectParticipateRequestError]);

    const userData =
      item?.type === 'KYC_VERIFICATION' ? item?.user : item?.fromUser;

    return (
      <Pressable
        onPress={() => {
          if (item?.type === 'KYC_VERIFICATION') {
            navigation.navigate('ProfileStack', {
              screen: 'MyProfileScreen',
            });
          }
          if (item?.type === 'COMMENTED_ON_YOUR_COMMENT') {
            if (item?.forumId) {
              navigation.navigate('ForumsStack', {
                screen: 'ForumsDetails',
                params: {
                  id: item?.forumId,
                },
              });
            }
            if (item?.tourId) {
              navigation.navigate('FeedDetails', {
                tourId: item?.tourId,
              });
            }
          }
          if (item?.type === 'TOUR_RATING') {
            navigation.navigate('ProfileStack', {
              screen: 'ReviewsScreen',
              params: {
                isMyProfileScreen: true,
                userId: item?.userId,
              },
            });
          }
          if (item?.type === 'TOUR_COMMENT') {
            navigation.navigate('FeedDetails', {
              tourId: item?.tourId,
            });
          }
          if (item?.type === 'TOUR_LIKE') {
            navigation.navigate('FeedDetails', {
              tourId: item?.tourId,
            });
          }
          if (item?.type === 'BECAME_PARTICIPANT') {
            navigation.navigate('FeedDetails', {
              tourId: item?.tourId,
            });
          }
          if (item?.type === 'FORUM_COMMENT') {
            navigation.navigate('ForumsStack', {
              screen: 'ForumsDetails',
              params: {
                id: item?.forumId,
              },
            });
          }
          if (item?.type === 'STARTED_FOLLOWING') {
            navigation.navigate('ProfileStack', {
              screen: 'UserProfileScreen',
              params: {
                userId: item?.fromUser?.id,
              },
            });
          }
          if (item?.type === 'PARTICIPANT_REQUEST_ACCEPTED') {
            navigation.navigate('ProfileStack', {
              screen: 'UserProfileScreen',
              params: {
                userId: item?.fromUser?.id,
              },
            });
          }
          if (item?.type === 'FOLLOW_REQUEST_ACCEPTED') {
            navigation.navigate('ProfileStack', {
              screen: 'UserProfileScreen',
              params: {
                userId: item?.fromUser?.id,
              },
            });
          }
        }}
        style={[
          styles.section,
          styles.row,
          {
            borderColor:
              index === section.data.length - 1
                ? COLORS.PRIMARY_COLOR
                : COLORS.CHIP_INACTIVE_BORDER_COLOR,
          },
        ]}>
        <Pressable
          onPress={() => {
            if (item?.type === 'KYC_VERIFICATION') {
              navigation.navigate('ProfileStack', {
                screen: 'MyProfileScreen',
              });
              return;
            }
            if (item?.fromUser?.id === userDetails?.id) {
              navigation.navigate('ProfileStack', {
                screen: 'MyProfileScreen',
              });
            } else {
              navigation.navigate('ProfileStack', {
                screen: 'UserProfileScreen',
                params: {
                  userId: item?.fromUser?.id,
                },
              });
            }
          }}>
          <View>
            <Image
              source={
                userData?.avatar
                  ? {
                      uri: userData?.avatar?.mediaUrl,
                    }
                  : USER_PROFILE
              }
              style={styles.image}
            />
            <View style={styles.userStatus}>
              {userData?.isActiveSubscription ? (
                <Premium />
              ) : userData?.isKycVerified ? (
                <Verify />
              ) : null}
            </View>
          </View>
        </Pressable>
        <View style={styles.labelContainer}>
          <Text style={[titleStyles, {fontFamily: FONTS.MONTSERRAT.REGULAR}]}>
            {item?.body}
          </Text>
          <Text style={descriptionStyles}>
            {moment(item?.updatedAt).format('DD MMM YYYY')}
          </Text>
          {(item?.type === 'PARTICIPANT_REQUEST' ||
            item?.type === 'FOLLOW_REQUEST') && (
            <View style={styles.buttonSection}>
              <Chip
                onPress={() => {
                  if (
                    isAcceptFollowRequestLoading ||
                    isAcceptParticipateRequestLoading
                  )
                    return;
                  if (item?.type === 'FOLLOW_REQUEST') {
                    const data = {
                      requestId: item?.followRequestId,
                    };
                    acceptFollowRequest(data);
                  }
                  if (item?.type === 'PARTICIPANT_REQUEST') {
                    const data = {
                      requestId: item?.participantRequestId,
                    };
                    acceptParticipateRequest(data);
                  }
                }}
                title={t(LOCALES.HOME.ACCEPT)}
                customLabelStyle={{
                  color: COLORS.PRIMARY_COLOR,
                  textAlign: 'center',
                }}
                containerStyle={[
                  styles.buttonContainer,
                  {backgroundColor: COLORS.TERTIARY_COLOR},
                ]}
                parentStyle={styles.buttonParent}
                customRightIconStyle={{marginLeft: 5}}
                rightIcon={
                  isAcceptFollowRequestLoading ||
                  isAcceptParticipateRequestLoading ? (
                    <ActivityIndicator color={COLORS.PRIMARY_COLOR} />
                  ) : null
                }
              />
              <Chip
                onPress={() => {
                  if (
                    isRejectFollowRequestLoading ||
                    isRejectParticipateRequestLoading
                  )
                    return;
                  if (item?.type === 'FOLLOW_REQUEST') {
                    const data = {
                      requestId: item?.followRequestId,
                    };
                    rejectFollowRequest(data);
                  }
                  if (item?.type === 'PARTICIPANT_REQUEST') {
                    const data = {
                      requestId: item?.participantRequestId,
                    };
                    rejectParticipateRequest(data);
                  }
                }}
                title={t(LOCALES.HOME.DECLINE)}
                customLabelStyle={{textAlign: 'center'}}
                containerStyle={styles.buttonContainer}
                parentStyle={styles.buttonParent}
                customRightIconStyle={{marginLeft: 5}}
                rightIcon={
                  isRejectFollowRequestLoading ||
                  isRejectParticipateRequestLoading ? (
                    <ActivityIndicator color={COLORS.TERTIARY_COLOR} />
                  ) : null
                }
              />
            </View>
          )}
        </View>
        {item.postImage && <Image source={HOME_2} style={styles.postImage} />}
      </Pressable>
    );
  };

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
        title={t(LOCALES.HOME.NOTIFICATION)}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        {isNotificationLoading && page === 2 ? (
          <View style={styles.loader}>
            <ActivityIndicator />
          </View>
        ) : (
          <SectionList
            sections={notificationsList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index, section}) => (
              <Item item={item} section={section} index={index} />
            )}
            contentContainerStyle={{
              flex: notificationsList?.length === 0 ? 1 : 0,
            }}
            ListEmptyComponent={() => (
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
            renderSectionHeader={({section: {title}}) => (
              <Text
                style={[
                  descriptionStyles,
                  styles.title,
                  {color: COLORS.PRIMARY_TEXT_COLOR},
                ]}>
                {title}
              </Text>
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  getNotificationList();
                }}
                tintColor={COLORS.TERTIARY_COLOR}
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  section: {
    paddingVertical: 20,
    marginHorizontal: 20,
    borderBottomWidth: 1,
  },
  image: {
    height: 48,
    width: 48,
    borderRadius: 24,
  },
  postImage: {
    height: 48,
    width: 48,
  },
  labelContainer: {
    flex: 1,
    marginHorizontal: 11,
  },
  buttonSection: {
    flexDirection: 'row',
    marginTop: 15,
  },
  buttonParent: {
    width: 120,
    marginRight: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    height: 35,
    borderRadius: 10,
  },
  title: {
    marginHorizontal: 20,
    marginTop: 10,
    fontSize: responsiveFontSize(14),
  },
  nodata: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
