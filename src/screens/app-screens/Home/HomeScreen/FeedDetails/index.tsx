import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  ActivityIndicator,
  Share,
  BackHandler,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import useTheme from '../../../../../theme/hooks/useTheme';
import {
  CALENDAR,
  COMMENT,
  HEART,
  HEART_FILL,
  SEND,
} from '../../../../../assets/icons/svg';
import Back from '../../../../../assets/icons/svg/Back';
import {USER_PROFILE} from '../../../../../assets/images';
import {FeedDetailsScreenProps} from '../../../../../types/navigation/appTypes';
import LOCALES from '../../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {responsiveFontSize} from '../../../../../theme/responsiveFontSize';
import Location from '../../../../../assets/icons/svg/Location';
import AddCircle from '../../../../../assets/icons/svg/AddCircle';
import Requested from '../../../../../assets/icons/svg/Requested';
import {useApi} from '../../../../../hooks/useApi';
import {URL} from '../../../../../constants/URLS';
import {appAlert} from '../../../../../components/appAlert';
import moment from 'moment';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import CommentsModal from '../components/CommentsModal';
import {useAppSelector} from '../../../../../store';
import Premium from '../../../../../assets/icons/svg/premium';
import Verify from '../../../../../assets/icons/svg/Verify';
import Language from '../../../../../localization/Language';

const screenWidth = Dimensions.get('screen').width - 48;

const FeedDetails = ({navigation, route}: FeedDetailsScreenProps) => {
  const {tourId} = route?.params;
  const {t} = useTranslation();
  const {userDetails} = useAppSelector(state => state.auth);
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tourDetails, setTourDetails] = useState<any>(null);
  const [accommodation, setAccommodation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [languages, setLanguages] = useState('');
  const commentsModalRef = useRef<BottomSheetModal>(null);
  const [isUserLiked, setIsUserLiked] = useState(false);
  const [likedByMe, setLikedByMe] = useState<any>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [participants, setParticipants] = useState<any>([]);
  const [isRequested, setIsRequested] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const backAction = () => {
      if (isModalOpen) {
        commentsModalRef?.current?.close();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [isModalOpen]);

  const handleCommentsModalPress = useCallback(() => {
    commentsModalRef.current?.present();
  }, []);
  const userName = useMemo(
    () => [
      {
        fontSize: responsiveFontSize(14),
        color: COLORS.FEED_PRIMARY_TEXT_COLOR,
        fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
      },
    ],
    [COLORS, FONTS],
  );
  const userDescription = useMemo(
    () => [
      {
        fontSize: responsiveFontSize(11),
        color: COLORS.FEED_SECONDARY_TEXT_COLOR,
        fontFamily: FONTS.MONTSERRAT.REGULAR,
      },
    ],
    [COLORS, FONTS],
  );

  const detailsName = useMemo(
    () => [
      {
        color: COLORS.SECONDARY_TEXT_COLOR,
        fontSize: responsiveFontSize(12),
        fontFamily: FONTS.MONTSERRAT.REGULAR,
      },
    ],
    [COLORS, FONTS],
  );

  const detailsValue = useMemo(
    () => [
      {
        color: COLORS.PRIMARY_TEXT_COLOR,
        fontSize: responsiveFontSize(14),
        fontFamily: FONTS.MONTSERRAT.REGULAR,
      },
    ],
    [COLORS, FONTS],
  );
  const getCurrentIndex = useCallback(() => {
    return currentIndex + 1 + '/' + tourDetails?.destinationPhotos?.length;
  }, [currentIndex, tourDetails]);

  const renderItem = useCallback(
    (data: any) => {
      const {item: image} = data;
      return (
        <View style={styles.carouselImageContainer}>
          <Image
            source={{
              uri: image?.mediaUrl,
            }}
            resizeMode="cover"
            style={styles.carouselImage}
          />
          {tourDetails?.destinationPhotos?.length > 1 && (
            <View style={styles.imageCounters}>
              <Text
                style={{
                  fontSize: responsiveFontSize(12),
                  color: COLORS.FEED_PRIMARY_TEXT_COLOR,
                  fontFamily: FONTS.MONTSERRAT.MEDIUM,
                }}>
                {getCurrentIndex()}
              </Text>
            </View>
          )}
        </View>
      );
    },
    [currentIndex, tourDetails],
  );

  const getDotsStyle = useCallback(
    (index: number) => [
      styles.dotContainer,
      {
        backgroundColor:
          currentIndex === index
            ? COLORS.PRIMARY_COLOR
            : COLORS.SIGNUP_PROGRESS_BACKGROUND_COLOR,
        borderWidth: currentIndex === index ? 1 : 0,
        borderColor: COLORS.SECONDARY_COLOR,
      },
    ],
    [currentIndex],
  );

  const [
    getTourDetails,
    tourDetailsResponse,
    tourDetailsError,
    isTourDetailsLoading,
  ] = useApi({
    url: URL.GET_TOUR_DETAIL + tourId,
    method: 'GET',
  });

  useEffect(() => {
    getTourDetails();
  }, [tourId]);

  useEffect(() => {
    if (tourDetailsResponse) {
      if (tourDetailsResponse?.statusCode === 200) {
        setTourDetails(tourDetailsResponse?.data?.tour);
      }
    }
  }, [tourDetailsResponse]);

  useEffect(() => {
    if (tourDetailsError) {
      if (tourDetailsError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: tourDetailsError?.message,
        });
      }
    }
  }, [tourDetailsError]);

  const getTitle = (name: string) => {
    if (name === 'HOLIDAY') {
      return t(LOCALES.HOME.HOLIDAY);
    } else if (name === 'EVENT') {
      return t(LOCALES.HOME.EVENT);
    } else if (name === 'ACTIVITY') {
      return t(LOCALES.HOME.ACTIVITY);
    } else {
      return '';
    }
  };

  const getLookingFor = (name: string) => {
    if (name === 'MALE') {
      return t(LOCALES.CREATE_POST.LBL_MALE);
    } else if (name === 'FEMALE') {
      return t(LOCALES.CREATE_POST.LBL_FEMALE);
    } else if (name === 'OTHER') {
      return t(LOCALES.CREATE_POST.LBL_OTHER);
    } else {
      return t(LOCALES.CREATE_POST.LBL_ANY);
    }
  };

  const getDifficulty = (name: string) => {
    if (name === 'EASY') {
      return t(LOCALES.CREATE_POST.LBL_EASY);
    } else if (name === 'MEDIUM') {
      return t(LOCALES.CREATE_POST.LBL_MEDIUM);
    } else if (name === 'HARD') {
      return t(LOCALES.CREATE_POST.LBL_HARD);
    } else if (name === 'EXPERT') {
      return t(LOCALES.CREATE_POST.LBL_EXPERT);
    } else {
      return '';
    }
  };

  const getAccommodation = (name: string) => {
    if (name === 'HOTEL') {
      return t(LOCALES.CREATE_POST.LBL_HOTEL);
    } else if (name === 'MOTEL') {
      return t(LOCALES.CREATE_POST.LBL_MOTEL);
    } else if (name === 'CAMPING') {
      return t(LOCALES.CREATE_POST.LBL_CAMPING);
    } else if (name === 'HOSTEL') {
      return t(LOCALES.CREATE_POST.LBL_HOSTEL);
    } else {
      return '';
    }
  };

  const getWorkWithTravel = (name: boolean) => {
    if (name) {
      return t(LOCALES.CREATE_POST.LBL_YES);
    } else {
      return t(LOCALES.CREATE_POST.LBL_NO);
    }
  };

  useEffect(() => {
    if (tourDetails) {
      let accommodations = '';
      let languages = '';
      tourDetails?.accommodation?.map((item: any, index: number) => {
        if (index === 0) {
          accommodations = getAccommodation(item);
        } else {
          accommodations += ', ' + getAccommodation(item);
        }
      });
      tourDetails?.languages?.map((item: string, index: number) => {
        const result = Language.find(e => e.value === item)?.name;
        if (result) {
          if (index === 0) {
            languages =
              result.toLowerCase().charAt(0).toUpperCase() +
              result.toLowerCase().slice(1);
          } else {
            languages +=
              ', ' +
              result.toLowerCase().charAt(0).toUpperCase() +
              result.toLowerCase().slice(1);
          }
        }
      });
      setLanguages(languages);
      setAccommodation(accommodations);
      setIsUserLiked(tourDetails?.isLikedByMe);
      setLikeCount(tourDetails?.likesCount);
      setLikedByMe(tourDetails?.likedByMe);
      setParticipants(tourDetails?.participants);
      setIsRequested(tourDetails?.isRequested);
      setIsAccepted(tourDetails?.requestedByMe?.isAccepted);
    }
  }, [tourDetails]);

  useEffect(() => {
    if (tourDetails?.destinations?.length > 0) {
      const array: any = [];
      tourDetails?.destinations?.map((item: any, index: number) => {
        array.push({
          id: index,
          sortStartDate: new Date(item?.startDate + ' ' + item?.startTime),
          sortEndDate: new Date(item?.endDate + ' ' + item?.endTime),
          startDate: item?.startDate,
          startTime: item?.startTime,
          endDate: item?.endDate,
          endTime: item?.endTime,
        });
      });

      const startDate = array.sort(
        (a: any, b: any) =>
          a.sortStartDate.getTime() - b.sortStartDate.getTime(),
      );

      const endDate = array.sort(
        (a: any, b: any) => a.sortEndDate.getTime() - b.sortEndDate.getTime(),
      );
      if (tourDetails?.tourType === 'HOLIDAY') {
        setStartDate(moment(startDate[0].startDate).format('DD MMM YYYY'));
        setEndDate(moment(endDate.reverse()[0].endDate).format('DD MMM YYYY'));
      } else {
        setStartDate(
          moment(startDate[0].startDate).format('DD MMM YYYY') +
            ', ' +
            startDate[0].startTime,
        );
        setEndDate(
          moment(endDate.reverse()[0].endDate).format('DD MMM YYYY') +
            ', ' +
            endDate.reverse()[0].endTime,
        );
      }
    }
  }, [tourDetails]);

  const [likePost, likePostResponse, likePostError, isLikePostLoading] = useApi(
    {
      url: URL.LIKE_POST,
      method: 'POST',
    },
  );

  const [unLikePost, unLikePostResponse, unLikePostError, isUnLikePostLoading] =
    useApi({
      url: URL.UNLIKE_POST + likedByMe?.id,
      method: 'DELETE',
    });

  useEffect(() => {
    if (likePostResponse) {
      if (likePostResponse?.statusCode === 200) {
        setLikedByMe(likePostResponse?.data?.like);
      }
    }
  }, [likePostResponse]);

  useEffect(() => {
    if (unLikePostResponse) {
      if (unLikePostResponse?.statusCode === 200) {
        setLikedByMe(null);
      }
    }
  }, [unLikePostResponse]);

  const onShare = async () => {
    const link = `https://yaatrees-api-staging.thinkwik.dev:3000/deep?link=yaatrees://tour-detail?id=${tourId}`;
    await Share.share({
      message: 'Check this out :- ' + link,
    });
  };

  const [joinTour, joinTourResponse, joinTourError, isJoinTourLoading] = useApi(
    {
      url: URL.JOIN_TOUR,
      method: 'POST',
    },
  );

  useEffect(() => {
    if (joinTourResponse) {
      if (joinTourResponse?.statusCode === 200) {
        // setParticipants([...participants, joinTourResponse?.data?.participant]);
        setIsRequested(true);
        setIsAccepted(false);
      }
    }
  }, [joinTourResponse]);

  useEffect(() => {
    if (joinTourError) {
      if (joinTourError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: joinTourError?.message,
        });
      }
    }
  }, [joinTourError]);

  const handleAddParticipants = useCallback(() => {
    Alert.alert(
      t(LOCALES.HOME.CONFIRM),
      `${t(LOCALES.HOME.ALERT_TEXT)} ${getTitle(
        tourDetails?.tourType,
      ).toLowerCase()}?`,
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            const data = {
              tourId: tourId,
            };
            joinTour(data);
          },
        },
      ],
    );
  }, [tourDetails, tourId]);

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
      <View style={[styles.header, styles.row]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Back />
        </Pressable>
        <Pressable onPress={onShare}>
          <SEND />
        </Pressable>
      </View>
      {isTourDetailsLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator />
        </View>
      ) : (
        <>
          {tourDetails ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.container}>
                <View style={styles.titleContainer}>
                  <Text
                    style={[
                      styles.title,
                      {
                        fontFamily: FONTS.MONTSERRAT.BOLD,
                        color: COLORS.PRIMARY_TEXT_COLOR,
                      },
                    ]}>
                    {tourDetails?.title}
                  </Text>
                  {/* <View style={[styles.row]}>
                <Pressable>
                  <Location />
                </Pressable>
                <Text
                  style={[
                    styles.description,
                    {
                      color: COLORS.SECONDARY_TEXT_COLOR,
                      fontFamily: FONTS.MONTSERRAT.REGULAR,
                    },
                  ]}>
                  {tourDetails?.tourType === 'HOLIDAY'
                    ? tourDetails?.destinations?.[0]?.country
                    : tourDetails?.destinations?.[0]?.address}
                </Text>
              </View> */}
                </View>
                <View style={styles.carouselContainer}>
                  <FlatList
                    data={tourDetails?.destinationPhotos}
                    keyExtractor={item => item?.id}
                    renderItem={renderItem}
                    pagingEnabled
                    onMomentumScrollEnd={e => {
                      const index = Math.round(
                        e.nativeEvent.contentOffset.x / screenWidth,
                      );
                      setCurrentIndex(index);
                    }}
                    style={{flexGrow: 0}}
                    bounces
                    horizontal
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
                <View style={styles.dotParent}>
                  {tourDetails?.destinationPhotos?.map(
                    (item: any, index: number) => {
                      return <View key={index} style={getDotsStyle(index)} />;
                    },
                  )}
                </View>
                <View style={styles.reactionContainer}>
                  <View style={[styles.row, {justifyContent: 'flex-start'}]}>
                    <Pressable
                      onPress={() => {
                        setIsUserLiked(!isUserLiked);
                        if (isUserLiked) {
                          setLikeCount(likeCount - 1);
                          if (likedByMe) {
                            unLikePost();
                          }
                        } else {
                          setLikeCount(likeCount + 1);
                          const data = {
                            tourId: tourDetails?.id,
                          };
                          likePost(data);
                        }
                      }}>
                      {isUserLiked ? <HEART_FILL /> : <HEART />}
                    </Pressable>
                    <Text
                      style={[
                        styles.likeCount,
                        {color: COLORS.FEED_SECONDARY_TEXT_COLOR},
                      ]}>
                      {likeCount}
                    </Text>
                    <Pressable onPress={handleCommentsModalPress}>
                      <COMMENT />
                    </Pressable>
                    <Text
                      style={[
                        styles.commentCount,
                        {color: COLORS.FEED_SECONDARY_TEXT_COLOR},
                      ]}>
                      {tourDetails?.commentsCount}
                    </Text>
                  </View>
                </View>
                <View style={{marginVertical: 20}}>
                  <Text
                    style={{
                      color: COLORS.FEED_PRIMARY_TEXT_COLOR,
                      fontSize: responsiveFontSize(14),
                      marginBottom: 10,
                      fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                    }}>
                    {getTitle(tourDetails?.tourType)} {t(LOCALES.HOME.DETAILS)}
                  </Text>
                  <Text
                    style={{
                      color: COLORS.FEED_PRIMARY_TEXT_COLOR,
                      fontSize: responsiveFontSize(14),
                      marginBottom: 5,
                      fontFamily: FONTS.MONTSERRAT.REGULAR,
                    }}>
                    {tourDetails?.description}
                  </Text>
                  {/* <View style={styles.row}>
              <Pressable
                style={{
                  borderBottomWidth: 2,
                  borderColor: COLORS.PRIMARY_TEXT_COLOR,
                }}>
                <Text
                  style={{
                    color: COLORS.FEED_PRIMARY_TEXT_COLOR,
                    fontSize: responsiveFontSize(14),
                    fontFamily: FONTS.MONTSERRAT.MEDIUM,
                  }}>
                  {t(LOCALES.HOME.READ_MORE)}
                </Text>
              </Pressable>
              <View style={{flex: 1}} />
            </View> */}
                </View>
                <Pressable
                  onPress={() => {
                    navigation.navigate('HomeStack', {
                      screen: 'Participants',
                      params: {
                        tourId: tourId,
                        tourStatus: tourDetails?.tourStatus,
                        isUserJoin: isRequested,
                        isRequestAccepted: isAccepted,
                      },
                    });
                  }}
                  style={[
                    styles.row,
                    styles.participantsContainer,
                    {
                      backgroundColor: COLORS.FEED_BACKGROUND_COLOR,
                      borderColor: COLORS.INPUT_INACTIVE_BORDER_COLOR,
                    },
                  ]}>
                  <View style={styles.row}>
                    {participants
                      ?.slice(0, 3)
                      .map((item: any, index: number) => (
                        <View style={{marginRight: 4}} key={index}>
                          <Image
                            source={
                              item?.participant?.avatar
                                ? {
                                    uri: item?.participant?.avatar?.mediaUrl,
                                  }
                                : USER_PROFILE
                            }
                            style={styles.participants}
                          />
                          <View style={styles.userStatus}>
                            {item?.participant?.isActiveSubscription ? (
                              <Premium height={12} width={12} />
                            ) : item?.participant?.isKycVerified ? (
                              <Verify height={12} width={12} />
                            ) : null}
                          </View>
                        </View>
                      ))}
                    {participants?.length > 3 && (
                      <View
                        style={[
                          styles.participants,
                          styles.participantsCount,
                          {backgroundColor: COLORS.SECONDARY_COLOR},
                        ]}>
                        <Text
                          style={{
                            color: COLORS.FEED_PRIMARY_TEXT_COLOR,
                            fontSize: responsiveFontSize(14),
                            fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                          }}>
                          {participants?.length - 3}+
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={{flex: 1}}>
                    <Text
                      style={{
                        color: COLORS.FEED_SECONDARY_TEXT_COLOR,
                        fontSize: responsiveFontSize(12),
                        paddingHorizontal: 5,
                        fontFamily: FONTS.MONTSERRAT.REGULAR,
                      }}>
                      {tourDetails?.participantCounts}{' '}
                      {t(LOCALES.HOME.PARTICIPANTS)}
                    </Text>
                  </View>
                  {!isRequested && tourDetails?.tourStatus !== 'COMPLETED' && (
                    <>
                      {isJoinTourLoading ? (
                        <ActivityIndicator size={30} />
                      ) : (
                        <Pressable onPress={handleAddParticipants}>
                          <AddCircle height={30} width={30} />
                        </Pressable>
                      )}
                    </>
                  )}
                  {tourDetails?.tourStatus !== 'COMPLETED' &&
                    isRequested &&
                    !isAccepted && <Requested height={30} width={30} />}
                </Pressable>
                <View style={{marginTop: 20}}>
                  <Text
                    style={{
                      color: COLORS.SECONDARY_TEXT_COLOR,
                      fontSize: responsiveFontSize(12),
                      marginBottom: 15,
                      fontFamily: FONTS.MONTSERRAT.REGULAR,
                    }}>
                    {getTitle(tourDetails?.tourType)}{' '}
                    {t(LOCALES.HOME.CREATED_BY)}
                  </Text>
                  <View style={[styles.row, {justifyContent: 'flex-start'}]}>
                    <Pressable
                      onPress={() => {
                        if (tourDetails?.user?.id === userDetails?.id) {
                          navigation.navigate('ProfileStack', {
                            screen: 'MyProfileScreen',
                          });
                        } else {
                          navigation.navigate('ProfileStack', {
                            screen: 'UserProfileScreen',
                            params: {
                              userId: tourDetails?.user?.id,
                            },
                          });
                        }
                      }}>
                      <Image
                        source={
                          tourDetails?.user?.avatar
                            ? {
                                uri: tourDetails?.user?.avatar?.mediaUrl,
                              }
                            : USER_PROFILE
                        }
                        style={styles.homeProfile}
                      />
                      <View style={styles.userStatus}>
                        {tourDetails?.user?.isActiveSubscription ? (
                          <Premium />
                        ) : tourDetails?.user?.isKycVerified ? (
                          <Verify />
                        ) : null}
                      </View>
                    </Pressable>
                    <View style={{marginLeft: 12}}>
                      <Text
                        style={userName}
                        onPress={() => {
                          if (tourDetails?.user?.id === userDetails?.id) {
                            navigation.navigate('ProfileStack', {
                              screen: 'MyProfileScreen',
                            });
                          } else {
                            navigation.navigate('ProfileStack', {
                              screen: 'UserProfileScreen',
                              params: {
                                userId: tourDetails?.user?.id,
                              },
                            });
                          }
                        }}>
                        {tourDetails?.user?.firstName}{' '}
                        {tourDetails?.user?.lastName}
                        {tourDetails?.user?.dateOfBirth ? ', ' : ''}
                        {tourDetails?.user?.dateOfBirth
                          ? moment().diff(
                              tourDetails?.user?.dateOfBirth,
                              'years',
                              false,
                            )
                          : ''}
                      </Text>
                      <View style={styles.textContainer}>
                        <Text style={userDescription}>
                          {getTitle(tourDetails?.tourType)}
                        </Text>
                        <View
                          style={[
                            styles.dot,
                            {backgroundColor: COLORS.FEED_SECONDARY_TEXT_COLOR},
                          ]}
                        />
                        <Text style={userDescription}>
                          {moment(tourDetails?.createdAt).fromNow()}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={[
                    styles.line,
                    {borderColor: COLORS.FEED_BACKGROUND_COLOR},
                  ]}
                />
                <View style={[styles.row]}>
                  <View style={{width: '45%'}}>
                    <Text
                      style={{
                        color: COLORS.SECONDARY_TEXT_COLOR,
                        fontSize: responsiveFontSize(12),
                        marginBottom: 10,
                        fontFamily: FONTS.MONTSERRAT.REGULAR,
                      }}>
                      {tourDetails?.tourType === 'HOLIDAY'
                        ? t(LOCALES.HOME.START_DATE)
                        : t(LOCALES.CREATE_POST.LBL_START_DATE_TIME)}
                    </Text>
                    <View style={[styles.row, {justifyContent: 'flex-start'}]}>
                      <CALENDAR />
                      <Text
                        style={{
                          color: COLORS.PRIMARY_TEXT_COLOR,
                          fontSize: responsiveFontSize(14),
                          fontFamily: FONTS.MONTSERRAT.REGULAR,
                          marginLeft: 7,
                        }}>
                        {startDate}
                      </Text>
                    </View>
                  </View>
                  <View style={{width: '45%'}}>
                    <Text
                      style={{
                        color: COLORS.SECONDARY_TEXT_COLOR,
                        fontSize: responsiveFontSize(12),
                        marginBottom: 10,
                        fontFamily: FONTS.MONTSERRAT.REGULAR,
                      }}>
                      {tourDetails?.tourType === 'HOLIDAY'
                        ? t(LOCALES.HOME.END_DATE)
                        : t(LOCALES.CREATE_POST.LBL_END_DATE_TIME)}
                    </Text>
                    <View style={[styles.row, {justifyContent: 'flex-start'}]}>
                      <CALENDAR />
                      <Text
                        style={{
                          color: COLORS.PRIMARY_TEXT_COLOR,
                          fontSize: responsiveFontSize(14),
                          fontFamily: FONTS.MONTSERRAT.REGULAR,
                          marginLeft: 7,
                        }}>
                        {endDate}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={[
                    styles.line,
                    {borderColor: COLORS.FEED_BACKGROUND_COLOR},
                  ]}
                />
                <View>
                  <View style={styles.row}>
                    <Text style={detailsName}>
                      {t(LOCALES.HOME.LOOKING_FOR)}
                    </Text>
                    <Text style={detailsValue}>
                      {getLookingFor(tourDetails?.lookingFor)}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.line,
                      {borderColor: COLORS.FEED_BACKGROUND_COLOR},
                    ]}
                  />
                  <View style={styles.row}>
                    <Text style={detailsName}>
                      {t(LOCALES.HOME.DESTINATIONS)}
                    </Text>
                    <View style={{width: '60%'}}>
                      {tourDetails?.destinations?.map(
                        (item: any, index: number) => {
                          return (
                            <Text
                              style={[detailsValue, {textAlign: 'right'}]}
                              key={index}>
                              {tourDetails?.tourType === 'HOLIDAY'
                                ? `${
                                    item?.city
                                      ? item?.city + ', ' + item?.country
                                      : item?.country
                                  } (${moment(item.startDate).format(
                                    'DD MMM YYYY',
                                  )})`
                                : `${item.address} (${moment(
                                    item.startDate,
                                  ).format('DD MMM YYYY')}, ${item.startTime}-${
                                    item.endTime
                                  })`}
                            </Text>
                          );
                        },
                      )}
                    </View>
                  </View>
                  <View
                    style={[
                      styles.line,
                      {borderColor: COLORS.FEED_BACKGROUND_COLOR},
                    ]}
                  />
                  {(tourDetails?.tourType === 'EVENT' ||
                    tourDetails?.tourType === 'ACTIVITY') &&
                    tourDetails?.subCategory && (
                      <>
                        <View style={styles.row}>
                          <Text style={detailsName}>
                            {t(LOCALES.HOME.CATEGORIES)}
                          </Text>
                          <Text style={detailsValue}>
                            {tourDetails?.subCategory?.subCategoryName}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.line,
                            {borderColor: COLORS.FEED_BACKGROUND_COLOR},
                          ]}
                        />
                      </>
                    )}
                  {tourDetails?.tourType === 'ACTIVITY' && (
                    <>
                      <View style={styles.row}>
                        <Text style={detailsName}>
                          {t(LOCALES.HOME.NUMBER_OF_MATES)}
                        </Text>
                        <Text style={detailsValue}>
                          {tourDetails?.matesNumber}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.line,
                          {borderColor: COLORS.FEED_BACKGROUND_COLOR},
                        ]}
                      />
                    </>
                  )}
                  <View style={styles.row}>
                    <Text style={detailsName}>{t(LOCALES.HOME.BUDGET)}</Text>
                    <Text style={detailsValue}>
                      £{tourDetails?.minBudget?.value} - £
                      {tourDetails?.maxBudget?.value}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.line,
                      {borderColor: COLORS.FEED_BACKGROUND_COLOR},
                    ]}
                  />
                  {tourDetails?.tourType === 'HOLIDAY' && (
                    <>
                      <View style={styles.row}>
                        <Text style={detailsName}>
                          {t(LOCALES.HOME.WORK_TRAVEL)}
                        </Text>
                        <Text style={detailsValue}>
                          {getWorkWithTravel(tourDetails?.workWithTravel)}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.line,
                          {borderColor: COLORS.FEED_BACKGROUND_COLOR},
                        ]}
                      />
                    </>
                  )}
                  {tourDetails?.tourType === 'ACTIVITY' &&
                    tourDetails?.activityDifficulty && (
                      <>
                        <View style={styles.row}>
                          <Text style={detailsName}>
                            {t(LOCALES.HOME.DIFFICULTY)}
                          </Text>
                          <Text style={detailsValue}>
                            {getDifficulty(tourDetails?.activityDifficulty)}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.line,
                            {borderColor: COLORS.FEED_BACKGROUND_COLOR},
                          ]}
                        />
                      </>
                    )}
                  {tourDetails?.tourType === 'ACTIVITY' &&
                    tourDetails?.requiredGears && (
                      <>
                        <View style={[styles.row, {alignItems: 'flex-start'}]}>
                          <Text style={[detailsName]}>
                            {t(LOCALES.HOME.GEARS_LIST)}
                          </Text>
                          <Text
                            style={[
                              detailsValue,
                              {textAlign: 'right', width: '60%'},
                            ]}>
                            {tourDetails?.requiredGears}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.line,
                            {borderColor: COLORS.FEED_BACKGROUND_COLOR},
                          ]}
                        />
                      </>
                    )}
                  {languages && (
                    <>
                      <View style={styles.row}>
                        <Text style={detailsName}>
                          {t(LOCALES.HOME.LANGUAGES)}
                        </Text>
                        <Text
                          style={[
                            detailsValue,
                            {width: '60%', textAlign: 'right'},
                          ]}>
                          {languages}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.line,
                          {borderColor: COLORS.FEED_BACKGROUND_COLOR},
                        ]}
                      />
                    </>
                  )}
                  {accommodation && (
                    <>
                      <View style={styles.row}>
                        <Text style={detailsName}>
                          {t(LOCALES.HOME.ACCOMMODATION)}
                        </Text>
                        <Text
                          style={[
                            detailsValue,
                            {width: '60%', textAlign: 'right'},
                          ]}>
                          {accommodation}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.line,
                          {borderColor: COLORS.FEED_BACKGROUND_COLOR},
                        ]}
                      />
                    </>
                  )}
                </View>
                <View>
                  {tourDetails?.journeyDetails && (
                    <View>
                      <Text
                        style={{
                          color: COLORS.FEED_PRIMARY_TEXT_COLOR,
                          fontSize: responsiveFontSize(14),
                          fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                          marginBottom: 15,
                        }}>
                        {t(LOCALES.HOME.ITINERARY)}
                      </Text>
                      <Text
                        style={{
                          color: COLORS.FEED_PRIMARY_TEXT_COLOR,
                          fontSize: responsiveFontSize(14),
                          fontFamily: FONTS.MONTSERRAT.REGULAR,
                        }}>
                        {tourDetails?.journeyDetails}
                      </Text>
                    </View>
                  )}
                  {tourDetails?.notes && (
                    <View>
                      <View
                        style={[
                          styles.line,
                          {borderColor: COLORS.FEED_BACKGROUND_COLOR},
                        ]}
                      />
                      <Text
                        style={{
                          color: COLORS.FEED_PRIMARY_TEXT_COLOR,
                          fontSize: responsiveFontSize(14),
                          fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                          marginBottom: 15,
                        }}>
                        {t(LOCALES.HOME.NOTES)}
                      </Text>
                      <Text
                        style={{
                          color: COLORS.FEED_PRIMARY_TEXT_COLOR,
                          fontSize: responsiveFontSize(14),
                          fontFamily: FONTS.MONTSERRAT.REGULAR,
                          marginBottom: 30,
                        }}>
                        {tourDetails?.notes}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
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
      <CommentsModal
        bottomSheetModalRef={commentsModalRef}
        tourId={tourId}
        setIsModalOpen={setIsModalOpen}
      />
    </SafeAreaView>
  );
};

export default FeedDetails;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    height: 66,
    marginHorizontal: 20,
  },
  container: {
    flex: 1,
    marginHorizontal: 20,
  },
  titleContainer: {
    marginVertical: 15,
  },
  title: {
    fontSize: responsiveFontSize(26),
    marginBottom: 15,
  },
  description: {
    flex: 1,
    fontSize: responsiveFontSize(12),
    marginLeft: 5,
  },
  carouselContainer: {
    marginTop: 15,
    height: 246,
    width: '100%',
  },
  carouselImageContainer: {
    height: 246,
    width: screenWidth,
    marginHorizontal: 4,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  imageCounters: {
    position: 'absolute',
    end: 10,
    top: 15,
    paddingVertical: 5,
    paddingHorizontal: 9,
    backgroundColor: 'rgba(0, 0, 0,0.4)',
    borderRadius: 8,
  },
  dotParent: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 16,
  },
  dotContainer: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  reactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 4,
    marginTop: 18,
  },
  likeCount: {
    marginHorizontal: 5,
    width: '25%',
  },
  commentCount: {
    marginHorizontal: 5,
  },
  participantsContainer: {
    padding: 20,
    borderRadius: 13,
    borderWidth: 1,
  },
  participants: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  participantsCount: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeProfile: {
    height: 48,
    width: 48,
    borderRadius: 24,
  },
  dot: {
    height: 4,
    width: 4,
    marginHorizontal: 10,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  line: {
    borderWidth: 1,
    marginVertical: 18,
  },
  back: {
    height: 24,
    width: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
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
  userStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
