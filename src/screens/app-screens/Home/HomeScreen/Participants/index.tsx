import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import useTheme from '../../../../../theme/hooks/useTheme';
import {useTranslation} from 'react-i18next';
import Header from '../../../../../components/Header';
import {ParticipantsScreenProps} from '../../../../../types/navigation/appTypes';
import {USER_PROFILE} from '../../../../../assets/images/index';
import Button from '../../../../../components/Button';
import {responsiveFontSize} from '../../../../../theme/responsiveFontSize';
import LOCALES from '../../../../../localization/constants';
import RateReviewModal from '../components/RateReviewModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useApi} from '../../../../../hooks/useApi';
import {appAlert} from '../../../../../components/appAlert';
import {URL} from '../../../../../constants/URLS';
import {useAppSelector} from '../../../../../store';
import LIKE from '../../../../../assets/icons/svg/Like';
import UNLIKE from '../../../../../assets/icons/svg/UnLike';
import Premium from '../../../../../assets/icons/svg/premium';
import Verify from '../../../../../assets/icons/svg/Verify';

type renderItemType = {
  id: number;
  name: string;
  description: string;
  image: any;
  isRated: boolean;
};

const Participants = ({navigation, route}: ParticipantsScreenProps) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();
  const {tourId, tourStatus, isUserJoin, isRequestAccepted} = route?.params;
  const [page, setPage] = useState(2);
  const {userDetails} = useAppSelector(state => state.auth);
  const [totalPages, setTotalPages] = useState(1);
  const rateReviewModalRef = useRef<BottomSheetModal>(null);
  const [participantsList, setParticipantsList] = useState<any>([]);

  const RenderItem = ({item}: {item: any}) => {
    const [isUserLiked, setIsUserLiked] = useState(false);
    const [isUserUnLiked, setIsUserUnLiked] = useState(false);
    const [ratedByMe, setRatedByMe] = useState(item?.ratedByMe);
    const [isRatedByMe, setIsRatedByMe] = useState(item?.isRatedByMe || false);

    useEffect(() => {
      if (ratedByMe) {
        if (ratedByMe?.rating === 'GOOD') {
          setIsUserLiked(true);
        } else if (ratedByMe?.rating === 'BAD') {
          setIsUserUnLiked(true);
        }
      }
    }, [ratedByMe]);

    const [rateUser, rateUserResponse, rateUserError, isRateLoading] = useApi({
      url: URL.RATING,
      method: 'POST',
    });

    useEffect(() => {
      if (rateUserResponse) {
        if (rateUserResponse?.statusCode === 200) {
          setIsRatedByMe(true);
        }
      }
    }, [rateUserResponse]);

    useEffect(() => {
      if (rateUserError) {
        if (rateUserError?.statusCode === 400) {
          appAlert({
            title: t(LOCALES.ERROR.LBL_ERROR),
            message: rateUserError?.message,
          });
        }
      }
    }, [rateUserError]);

    return (
      <Pressable
        style={styles.row}
        onPress={() => {
          if (item?.participant?.id === userDetails?.id) {
            navigation.navigate('ProfileStack', {
              screen: 'MyProfileScreen',
            });
          } else {
            navigation.navigate('ProfileStack', {
              screen: 'UserProfileScreen',
              params: {
                userId: item?.participant?.id,
              },
            });
          }
        }}>
        <View>
          <Image
            source={
              item?.participant?.avatar
                ? {
                    uri: item?.participant?.avatar?.mediaUrl,
                  }
                : USER_PROFILE
            }
            style={styles.image}
          />
          <View style={styles.userStatus}>
            {item?.participant?.isActiveSubscription ? (
              <Premium />
            ) : item?.participant?.isKycVerified ? (
              <Verify />
            ) : null}
          </View>
        </View>
        <View style={styles.label}>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
              color: COLORS.PRIMARY_TEXT_COLOR,
              fontSize: responsiveFontSize(14),
            }}>
            {item?.participant?.firstName} {item?.participant?.lastName}
          </Text>
          <Text
            style={{
              fontFamily: FONTS.MONTSERRAT.REGULAR,
              color: COLORS.SECONDARY_TEXT_COLOR,
              fontSize: responsiveFontSize(12),
            }}>
            @{item?.participant?.userName}
          </Text>
        </View>
        {tourStatus === 'COMPLETED' &&
          isUserJoin &&
          isRequestAccepted &&
          item?.isAccepted &&
          !(item?.participant?.id === userDetails?.id) && (
            <Pressable style={styles.row}>
              <Pressable
                disabled={isRateLoading}
                onPress={() => {
                  if (isRatedByMe) return;
                  if (isUserLiked) {
                  } else {
                    setIsUserLiked(true);
                    setIsUserUnLiked(false);
                    const data = {
                      toUserId: item?.participant?.id,
                      tourId: tourId,
                      rating: 'GOOD',
                    };
                    rateUser(data);
                  }
                }}
                style={[
                  styles.like,
                  {
                    borderColor: isUserLiked
                      ? COLORS.INPUT_ACTIVE_BORDER_COLOR
                      : COLORS.INPUT_INACTIVE_BORDER_COLOR,
                    marginRight: 10,
                  },
                ]}>
                {isUserLiked ? (
                  <LIKE color={COLORS.SECONDARY_COLOR} />
                ) : (
                  <LIKE />
                )}
              </Pressable>
              <Pressable
                disabled={isRateLoading}
                onPress={() => {
                  if (isRatedByMe) return;
                  if (isUserUnLiked) {
                  } else {
                    setIsUserUnLiked(true);
                    setIsUserLiked(false);
                    const data = {
                      toUserId: item?.participant?.id,
                      tourId: tourId,
                      rating: 'BAD',
                    };
                    rateUser(data);
                  }
                }}
                style={[
                  styles.like,
                  {
                    borderColor: isUserUnLiked
                      ? COLORS.INPUT_ACTIVE_BORDER_COLOR
                      : COLORS.INPUT_INACTIVE_BORDER_COLOR,
                  },
                ]}>
                {isUserUnLiked ? (
                  <UNLIKE color={COLORS.SECONDARY_COLOR} />
                ) : (
                  <UNLIKE />
                )}
              </Pressable>
            </Pressable>
          )}
      </Pressable>
    );
  };

  const handleRateReviewModalPress = useCallback(() => {
    rateReviewModalRef.current?.present();
  }, []);

  const [
    getParticipantsList,
    participantsListResponse,
    participantsListError,
    isParticipantsLoading,
  ] = useApi({
    url: URL.GET_PARTICIPANT_LIST,
    method: 'POST',
  });

  useEffect(() => {
    const data = {
      tourId: tourId,
    };
    getParticipantsList(data);
  }, []);

  useEffect(() => {
    if (participantsListResponse) {
      if (participantsListResponse?.statusCode === 200) {
        setTotalPages(participantsListResponse?.data?.totalPages);
        setParticipantsList([
          ...participantsList,
          ...participantsListResponse?.data?.participants,
        ]);
      }
    }
  }, [participantsListResponse]);

  useEffect(() => {
    if (participantsListError) {
      if (participantsListError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: participantsListError?.message,
        });
      }
    }
  }, [participantsListError]);

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
        title={t(LOCALES.HOME.PARTICIPANTS)}
        onBackPress={() => navigation.goBack()}
      />
      {isParticipantsLoading && page === 2 ? (
        <View style={styles.loader}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={participantsList}
          renderItem={({item}) => <RenderItem item={item} />}
          contentContainerStyle={[
            styles.container,
            {
              flex: participantsList?.length === 0 ? 1 : 0,
            },
          ]}
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
          onEndReachedThreshold={0}
          onEndReached={() => {
            if (page - 1 < totalPages) {
              const data = {
                page: page,
                tourId: tourId,
              };
              getParticipantsList(data);
              setPage(page + 1);
            }
          }}
          ListFooterComponent={() => {
            return isParticipantsLoading ? (
              <ActivityIndicator />
            ) : isUserJoin && !isRequestAccepted ? (
              <Text
                style={{
                  color: COLORS.SECONDARY_TEXT_COLOR,
                  fontFamily: FONTS.MONTSERRAT.MEDIUM,
                  fontSize: responsiveFontSize(12),
                  margin: 10,
                  textAlign: 'center',
                }}>
                {
                  'You have requested to join but your request is\nnot accepted yet'
                }
              </Text>
            ) : null;
          }}
        />
      )}
      <RateReviewModal bottomSheetModalRef={rateReviewModalRef} />
    </SafeAreaView>
  );
};

export default Participants;

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    height: 48,
    width: 48,
    borderRadius: 24,
  },
  label: {
    flex: 1,
    marginLeft: 14,
  },
  button: {
    height: 35,
    borderRadius: 4,
    minWidth: 130,
    paddingHorizontal: 10,
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
  like: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
