import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {USER_PROFILE} from '../../../../../assets/images';
import useTheme from '../../../../../theme/hooks/useTheme';
import {
  COMMENT,
  HEART,
  SEND,
  HEART_FILL,
} from '../../../../../assets/icons/svg';
import LOCALES from '../../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {responsiveFontSize} from '../../../../../theme/responsiveFontSize';
import AddCircle from '../../../../../assets/icons/svg/AddCircle';
import Requested from '../../../../../assets/icons/svg/Requested';
import moment from 'moment';
import {useApi} from '../../../../../hooks/useApi';
import {URL} from '../../../../../constants/URLS';
import {appAlert} from '../../../../../components/appAlert';
import More from '../../../../../assets/icons/svg/More';
import Premium from '../../../../../assets/icons/svg/premium';
import Verify from '../../../../../assets/icons/svg/Verify';

const screenWidth = Dimensions.get('screen').width - 78;

type FeedScreenType = {
  onFeedPress: (tourId: string) => void;
  onFeedMorePress: () => void;
  onCommentsPress: () => void;
  onUserProfilePress: (id: string) => void;
  onParticipantsPress: (
    tourId: string,
    tourStatus: 'UPCOMING' | 'ONGOING' | 'COMPLETED',
    isUserJoin: boolean,
    isRequestAccepted: boolean,
  ) => void;
  item: any;
};

const Feed = ({
  onFeedPress = () => {},
  onFeedMorePress = () => {},
  onCommentsPress = () => {},
  onUserProfilePress = () => {},
  onParticipantsPress = () => {},
  item,
}: FeedScreenType) => {
  const {FONTS, COLORS} = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const {t} = useTranslation();
  const [showReadMore, setShowReadMore] = useState(true);
  const [readMoreLines, setReadMoreLines] = useState(3);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isUserLiked, setIsUserLiked] = useState(item?.isLikedByMe || false);
  const [likedByMe, setLikedByMe] = useState(item?.likedByMe || null);
  const [likeCount, setLikeCount] = useState(item?.likesCount || 0);
  const [participants, setParticipants] = useState(item?.participants || []);
  const [isRequested, setIsRequested] = useState(item?.isRequested || false);
  const [isAccepted, setIsAccepted] = useState(
    item?.requestedByMe?.isAccepted || false,
  );

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

  const getCurrentIndex = useCallback(() => {
    return currentIndex + 1 + '/' + item?.destinationPhotos?.length;
  }, [currentIndex]);

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
          {item?.destinationPhotos?.length > 1 && (
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
    [currentIndex],
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

  const getFlexibility = (name: string) => {
    if (name === 'FLEXIBLE_WITH_DATE') {
      return t(LOCALES.CREATE_POST.LBL_FLEXIBLE_WITH_DATE);
    } else if (name === 'FLEXIBLE_WITH_TIME') {
      return t(LOCALES.CREATE_POST.LBL_FLEXIBLE_WITH_TIME);
    } else if (name === 'FLEXIBLE_WITH_BOTH_DATE_AND_TIME') {
      return t(LOCALES.CREATE_POST.LBL_FLEXIBLE_WITH_BOTH_DATE_AND_TIME);
    } else if (name === 'NOT_AT_ALL_FLEXIBLE') {
      return t(LOCALES.CREATE_POST.LBL_NOT_AT_ALL_FLEXIBLE);
    } else if (name === 'FLEXIBLE_WITH_BUDGET') {
      return t(LOCALES.CREATE_POST.LBL_FLEXIBLE_WITH_BUDGET);
    } else if (name === 'FLEXIBLE_WITH_BUDGET_AND_DATE') {
      return t(LOCALES.CREATE_POST.LBL_FLEXIBLE_WITH_BOTH_BUDGET_AND_DATE);
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

  const handleOnFeedPress = () => {
    onFeedPress(item?.id);
  };

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
    const link = `https://yaatrees-api-staging.thinkwik.dev:3000/deep?link=yaatrees://tour-detail?id=${item?.id}`;
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
        item?.tourType,
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
              tourId: item?.id,
            };
            joinTour(data);
          },
        },
      ],
    );
  }, []);

  useEffect(() => {
    if (item?.destinations?.length > 0) {
      const array: any = [];
      item?.destinations?.map((item: any, index: number) => {
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
      if (item?.tourType === 'HOLIDAY') {
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
  }, []);

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: COLORS.FEED_BACKGROUND_COLOR},
      ]}>
      <Pressable style={styles.row} onPress={handleOnFeedPress}>
        <Pressable onPress={() => onUserProfilePress(item?.user?.id)}>
          <Image
            source={
              item?.user?.avatar
                ? {
                    uri: item?.user?.avatar?.mediaUrl,
                  }
                : USER_PROFILE
            }
            style={styles.homeProfile}
          />
          <View style={styles.userStatus}>
            {item?.user?.isActiveSubscription ? (
              <Premium />
            ) : item?.user?.isKycVerified ? (
              <Verify />
            ) : null}
          </View>
        </Pressable>
        <View style={{flex: 1, marginLeft: 12}}>
          <Text
            style={userName}
            onPress={() => onUserProfilePress(item?.user?.id)}>
            {item?.user?.firstName} {item?.user?.lastName}
            {item?.user?.dateOfBirth ? ', ' : ''}
            {item?.user?.dateOfBirth
              ? moment().diff(item?.user?.dateOfBirth, 'years', false)
              : ''}
          </Text>
          <View style={styles.textContainer}>
            <Text style={userDescription}>{getTitle(item?.tourType)}</Text>
            <View
              style={[
                styles.dot,
                {backgroundColor: COLORS.FEED_SECONDARY_TEXT_COLOR},
              ]}
            />
            <Text style={userDescription}>
              {moment(item?.createdAt).fromNow()}
            </Text>
          </View>
        </View>
        <Pressable style={styles.more} onPress={onFeedMorePress}>
          <More />
        </Pressable>
      </Pressable>

      <View style={styles.carouselContainer}>
        <FlatList
          data={item?.destinationPhotos}
          keyExtractor={(item, index) => index.toString()}
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
        {item?.destinationPhotos?.map((item: any, index: number) => {
          return <View key={index} style={getDotsStyle(index)} />;
        })}
      </View>
      <View style={styles.reactionContainer}>
        <View style={styles.row}>
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
                  tourId: item?.id,
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
          <Pressable style={styles.row} onPress={onCommentsPress}>
            <COMMENT />
            <Text
              style={[
                styles.commentCount,
                {color: COLORS.FEED_SECONDARY_TEXT_COLOR},
              ]}>
              {item?.commentsCount}
            </Text>
          </Pressable>
        </View>
        <Pressable onPress={onShare}>
          <SEND />
        </Pressable>
      </View>
      <Pressable onPress={handleOnFeedPress}>
        <View style={{marginVertical: 12}}>
          <Text
            style={{
              color: COLORS.FEED_TERTIARY_TEXT_COLOR,
              fontSize: responsiveFontSize(14),
              marginBottom: 10,
              fontFamily: FONTS.MONTSERRAT.REGULAR,
            }}>
            {item?.title}
          </Text>
          <Text
            numberOfLines={readMoreLines}
            style={{
              color: COLORS.FEED_PRIMARY_TEXT_COLOR,
              fontSize: responsiveFontSize(14),
              fontFamily: FONTS.MONTSERRAT.REGULAR,
              marginBottom: 5,
            }}>
            {item?.description}
          </Text>
          {item?.description?.length > 120 && showReadMore && (
            <View style={styles.row}>
              <Pressable
                onPress={() => {
                  setReadMoreLines(100);
                  setShowReadMore(false);
                }}
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
            </View>
          )}
        </View>
        <View style={styles.row}>
          <Text
            style={{
              color: COLORS.FEED_SECONDARY_TEXT_COLOR,
              fontSize: responsiveFontSize(14),
              fontFamily: FONTS.MONTSERRAT.REGULAR,
            }}>
            {t(LOCALES.HOME.BUDGET)}
            {' : '}
          </Text>
          <Text
            style={{
              color: COLORS.FEED_TERTIARY_TEXT_COLOR,
              fontSize: responsiveFontSize(14),
              fontFamily: FONTS.MONTSERRAT.REGULAR,
              marginRight: 10,
            }}>
            £{item?.maxBudget?.value}
          </Text>
          <Text
            style={{
              color: COLORS.FEED_SECONDARY_TEXT_COLOR,
              fontSize: responsiveFontSize(14),
              fontFamily: FONTS.MONTSERRAT.REGULAR,
            }}>
            {t(LOCALES.HOME.LOOKING)}
            {' : '}
          </Text>
          <Text
            style={{
              color: COLORS.FEED_TERTIARY_TEXT_COLOR,
              fontSize: responsiveFontSize(14),
              fontFamily: FONTS.MONTSERRAT.REGULAR,
            }}>
            {getLookingFor(item?.lookingFor)}
          </Text>
        </View>
        <View style={[styles.row, {marginTop: 12}]}>
          <Text
            style={{
              color: COLORS.FEED_SECONDARY_TEXT_COLOR,
              fontSize: responsiveFontSize(14),
              fontFamily: FONTS.MONTSERRAT.REGULAR,
            }}>
            {t(LOCALES.HOME.FLEXIBILITY)}
            {' : '}
          </Text>
          <Text
            style={{
              color: COLORS.FEED_TERTIARY_TEXT_COLOR,
              fontSize: responsiveFontSize(14),
              fontFamily: FONTS.MONTSERRAT.REGULAR,
              marginRight: 10,
              width: '80%',
            }}>
            {getFlexibility(item?.flexibility)}
          </Text>
        </View>
        <View style={[styles.row, {marginTop: 12}]}>
          <Text
            style={{
              color: COLORS.FEED_SECONDARY_TEXT_COLOR,
              fontSize: responsiveFontSize(14),
              fontFamily: FONTS.MONTSERRAT.REGULAR,
            }}>
            {item?.tourType === 'HOLIDAY'
              ? t(LOCALES.HOME.START_DATE)
              : t(LOCALES.CREATE_POST.LBL_START_DATE_TIME)}
            {' : '}
          </Text>
          <Text
            style={{
              color: COLORS.FEED_TERTIARY_TEXT_COLOR,
              fontSize: responsiveFontSize(14),
              fontFamily: FONTS.MONTSERRAT.REGULAR,
              marginRight: 10,
              width: '80%',
            }}>
            {startDate}
          </Text>
        </View>
        <View style={[styles.row, {marginTop: 12}]}>
          <Text
            style={{
              color: COLORS.FEED_SECONDARY_TEXT_COLOR,
              fontSize: responsiveFontSize(14),
              fontFamily: FONTS.MONTSERRAT.REGULAR,
            }}>
            {item?.tourType === 'HOLIDAY'
              ? t(LOCALES.HOME.END_DATE)
              : t(LOCALES.CREATE_POST.LBL_END_DATE_TIME)}
            {' : '}
          </Text>
          <Text
            style={{
              color: COLORS.FEED_TERTIARY_TEXT_COLOR,
              fontSize: responsiveFontSize(14),
              fontFamily: FONTS.MONTSERRAT.REGULAR,
              marginRight: 10,
              width: '80%',
            }}>
            {endDate}
          </Text>
        </View>
      </Pressable>
      <Pressable
        style={{marginTop: 12}}
        onPress={() =>
          onParticipantsPress(
            item?.id,
            item?.tourStatus,
            isRequested,
            isAccepted,
          )
        }>
        <Text
          style={{
            color: COLORS.FEED_SECONDARY_TEXT_COLOR,
            fontSize: responsiveFontSize(14),
            fontFamily: FONTS.MONTSERRAT.REGULAR,
            marginBottom: 8,
          }}>
          {t(LOCALES.HOME.PARTICIPANTS)}
        </Text>
        <View style={styles.row}>
          {participants?.slice(0, 3).map((participant: any, index: number) => (
            <View style={{marginRight: 5}} key={index}>
              <Image
                source={
                  participant?.participant?.avatar
                    ? {
                        uri: participant?.participant?.avatar?.mediaUrl,
                      }
                    : USER_PROFILE
                }
                style={styles.participants}
              />
              <View style={styles.userStatus}>
                {participant?.participant?.isActiveSubscription ? (
                  <Premium />
                ) : participant?.participant?.isKycVerified ? (
                  <Verify />
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
          {!isRequested && item?.tourStatus !== 'COMPLETED' && (
            <>
              {isJoinTourLoading ? (
                <ActivityIndicator size={48} />
              ) : (
                <Pressable onPress={handleAddParticipants}>
                  <AddCircle height={48} width={48} />
                </Pressable>
              )}
            </>
          )}
          {item?.tourStatus !== 'COMPLETED' && isRequested && !isAccepted && (
            <Requested height={48} width={48} />
          )}
        </View>
      </Pressable>
    </View>
  );
};

export default Feed;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 13,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  homeProfile: {
    height: 48,
    width: 48,
    borderRadius: 24,
  },
  row: {flexDirection: 'row', alignItems: 'center'},
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
  carouselContainer: {
    marginTop: 15,
    height: 170,
    width: '100%',
  },
  carouselImageContainer: {
    height: 170,
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
    top: 10,
    paddingVertical: 5,
    paddingHorizontal: 9,
    backgroundColor: 'rgba(0, 0, 0,0.4)',
    borderRadius: 8,
  },
  dotParent: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 10,
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
    marginTop: 15,
  },
  likeCount: {
    marginHorizontal: 8,
    width: '25%',
  },
  commentCount: {
    marginHorizontal: 8,
  },
  participants: {
    height: 48,
    width: 48,
    borderRadius: 24,
  },
  participantsCount: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  more: {
    height: 24,
    width: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  userStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
