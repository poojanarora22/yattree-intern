import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  Image,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import useTheme from '../../../../theme/hooks/useTheme';
import {useApi} from '../../../../hooks/useApi';
import {URL} from '../../../../constants/URLS';
import {useAppDispatch, useAppSelector} from '../../../../store';
import {appAlert} from '../../../../components/appAlert';
import {useTranslation} from 'react-i18next';
import LOCALES from '../../../../localization/constants';
import {USER_PROFILE} from '../../../../assets/images';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import Feed from '../../Home/HomeScreen/Feed';
import {BottomSheetModal, useBottomSheetModal} from '@gorhom/bottom-sheet';
import CommentsModal from '../../Home/HomeScreen/components/CommentsModal';
import MoreModal from '../../Home/HomeScreen/components/MoreModal';
import {
  setClearCreatePostData,
  setEditTourId,
  setSelectedCreatePostOption,
} from '../../../../store/slice/createPostSlice';
import {useIsFocused} from '@react-navigation/native';
import GreetReportModal from '../../Home/HomeScreen/components/ReportModal';
import ReportModal from '../../Forums/ReportModal';
import Premium from '../../../../assets/icons/svg/premium';
import Verify from '../../../../assets/icons/svg/Verify';

const All = ({navigation}: any) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {userDetails} = useAppSelector(state => state.auth);
  const {search} = useAppSelector(state => state.home);
  const {t} = useTranslation();
  const {dismissAll} = useBottomSheetModal();
  const [userList, setUserList] = React.useState<any>([]);
  const [feedList, setFeedList] = React.useState<any>([]);
  const commentsModalRef = useRef<BottomSheetModal>(null);
  const moreModalRef = useRef<BottomSheetModal>(null);
  const reportModalRef = useRef<BottomSheetModal>(null);
  const greetReportModalRef = useRef<BottomSheetModal>(null);
  const [tourId, setTourId] = useState(null);
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();

  const [getAllList, allListResponse, allListError, isAllListLoading] = useApi({
    url: URL.SEARCH,
    method: 'POST',
  });

  useEffect(() => {
    if (search && isFocused) {
      const data = {
        q: search,
        searchInModule: 'ALL',
      };
      getAllList(data);
    } else {
      setUserList([]);
      setFeedList([]);
    }
  }, [search, isFocused]);

  useEffect(() => {
    if (allListResponse) {
      if (allListResponse?.statusCode === 200) {
        setUserList(allListResponse?.data?.users);
        setFeedList(allListResponse?.data?.tours);
        Keyboard.dismiss();
      }
    }
  }, [allListResponse]);

  useEffect(() => {
    if (allListError) {
      if (allListError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: allListError?.message,
        });
      }
    }
  }, [allListError]);

  const RenderUserList = ({item, index}: {item: any; index: number}) => {
    const [following, setFollowing] = useState<any>(item?.following);
    const [followed, setFollowed] = useState<any>(item?.followed);
    const [
      followUser,
      followUserResponse,
      followUserError,
      isFollowUserLoading,
    ] = useApi({
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

    return (
      <View
        style={{
          width: 150,
          backgroundColor: COLORS.FEED_BACKGROUND_COLOR,
          marginRight: index === userList.length - 1 ? 20 : 10,
          marginLeft: index === 0 ? 20 : 0,
          paddingHorizontal: 11,
          paddingTop: 11,
          borderRadius: 11,
        }}>
        <Pressable
          onPress={() => {
            if (item?.id === userDetails?.id) {
              navigation.navigate('ProfileStack', {
                screen: 'MyProfileScreen',
              });
            } else {
              navigation.navigate('ProfileStack', {
                screen: 'UserProfileScreen',
                params: {
                  userId: item?.id,
                },
              });
            }
          }}>
          <View style={{alignSelf: 'center'}}>
            <Image
              source={
                item?.avatar
                  ? {
                      uri: item?.avatar?.mediaUrl,
                    }
                  : USER_PROFILE
              }
              style={styles.image}
            />
            <View style={styles.userStatus}>
              {item?.isActiveSubscription ? (
                <Premium />
              ) : item?.isKycVerified ? (
                <Verify />
              ) : null}
            </View>
          </View>
        </Pressable>
        <View style={styles.label}>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
              color: COLORS.PRIMARY_TEXT_COLOR,
              fontSize: responsiveFontSize(14),
              textAlign: 'center',
              marginTop: 8,
            }}>
            {item?.firstName} {item?.lastName}
          </Text>
          <Text
            style={{
              fontFamily: FONTS.MONTSERRAT.REGULAR,
              color: COLORS.SECONDARY_TEXT_COLOR,
              fontSize: responsiveFontSize(12),
              textAlign: 'center',
              marginTop: 4,
            }}>
            @{item?.userName}
          </Text>
        </View>
        <Pressable
          disabled={
            isFollowUserLoading ||
            isUnFollowUserLoading ||
            item?.id === userDetails?.id
          }
          onPress={() => {
            if (following) {
              const data = {
                followingId: following?.followingId,
              };
              unFollowUser(data);
            } else {
              const data = {
                followingId: item?.id,
              };
              followUser(data);
            }
          }}
          style={{
            marginTop: 11,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            borderTopWidth: 1,
            opacity: item?.id === userDetails?.id ? 0.2 : 1,
            borderColor: COLORS.PRIMARY_COLOR,
          }}>
          {isFollowUserLoading || isUnFollowUserLoading ? (
            <ActivityIndicator />
          ) : (
            <Text
              numberOfLines={1}
              style={{
                fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                color: COLORS.PRIMARY_TEXT_COLOR,
                fontSize: responsiveFontSize(14),
              }}>
              {getFollowButtonTitle()}
            </Text>
          )}
        </Pressable>
      </View>
    );
  };

  const renderFeedList = (item: any) => {
    return (
      <Feed
        item={item}
        onFeedMorePress={() => {
          setSelectedTour(item);
          handleMoreModalPress();
        }}
        onParticipantsPress={(
          tourId,
          tourStatus,
          isUserJoin,
          isRequestAccepted,
        ) =>
          navigation.navigate('HomeStack', {
            screen: 'Participants',
            params: {
              tourId: tourId,
              tourStatus: tourStatus,
              isUserJoin: isUserJoin,
              isRequestAccepted: isRequestAccepted,
            },
          })
        }
        onUserProfilePress={id => {
          if (id === userDetails?.id) {
            navigation.navigate('ProfileStack', {
              screen: 'MyProfileScreen',
            });
          } else {
            navigation.navigate('ProfileStack', {
              screen: 'UserProfileScreen',
              params: {
                userId: id,
              },
            });
          }
        }}
        onCommentsPress={() => {
          setTourId(item.id);
          handleCommentsModalPress();
        }}
        onFeedPress={tourId =>
          navigation.navigate('HomeStack', {
            screen: 'FeedDetails',
            params: {tourId: tourId},
          })
        }
      />
    );
  };

  const handleCommentsModalPress = useCallback(() => {
    commentsModalRef.current?.present();
  }, []);

  const handleMoreModalPress = useCallback(() => {
    moreModalRef?.current?.present();
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (isModalOpen) {
        commentsModalRef?.current?.close();
        moreModalRef?.current?.close();
        reportModalRef?.current?.close();
        greetReportModalRef?.current?.close();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [isModalOpen]);

  const handleReportModalPress = useCallback(() => {
    reportModalRef?.current?.present();
  }, []);

  const handleGreetReportModalPress = useCallback(() => {
    greetReportModalRef?.current?.present();
  }, []);

  const [deleteTour, deleteTourResponse, deleteTourError, isDeleteTourLoading] =
    useApi({
      url: URL.DELETE_TOUR + selectedTour?.id,
      method: 'DELETE',
    });

  useEffect(() => {
    if (deleteTourResponse) {
      if (deleteTourResponse?.statusCode === 200) {
        const data = {
          q: search,
          searchInModule: 'ALL',
        };
        getAllList(data);
        setTourId(null);
        setSelectedTour(null);
      }
    }
  }, [deleteTourResponse]);

  useEffect(() => {
    if (deleteTourError) {
      if (deleteTourError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: deleteTourError?.message,
        });
      }
    }
  }, [deleteTourError]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.APP_BACKGROUND_COLOR,
      }}>
      {isAllListLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator />
        </View>
      ) : (
        <View style={styles.container}>
          {userList.length === 0 && feedList?.length === 0 ? (
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
          ) : (
            <ScrollView>
              {feedList.map(renderFeedList)}
              {userList?.length > 0 && (
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                    color: COLORS.PRIMARY_TEXT_COLOR,
                    fontSize: responsiveFontSize(14),
                    marginVertical: 10,
                    marginHorizontal: 20,
                  }}>
                  Suggested for you
                </Text>
              )}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {userList.map((item: any, index: number) => (
                  <RenderUserList item={item} index={index} />
                ))}
              </ScrollView>
            </ScrollView>
          )}
        </View>
      )}
      <CommentsModal
        bottomSheetModalRef={commentsModalRef}
        tourId={tourId}
        setIsModalOpen={setIsModalOpen}
      />
      <MoreModal
        bottomSheetModalRef={moreModalRef}
        tourType={selectedTour?.tourType || ''}
        userId={selectedTour?.user?.id || ''}
        tourStatus={selectedTour?.tourStatus || ''}
        onReport={() => {
          handleReportModalPress();
        }}
        onEdit={() => {
          dispatch(setClearCreatePostData(null));
          moreModalRef?.current?.close();
          if (selectedTour?.tourType === 'HOLIDAY') {
            dispatch(
              setSelectedCreatePostOption({
                id: 0,
                title: t(LOCALES.CREATE_POST.LBL_HOLIDAYS),
              }),
            );
            dispatch(setEditTourId(selectedTour?.id));
            navigation.navigate('CreatePostStack', {
              screen: 'CreatePostStepOne',
            });
          } else if (selectedTour?.tourType === 'EVENT') {
            dispatch(
              setSelectedCreatePostOption({
                id: 1,
                title: t(LOCALES.CREATE_POST.LBL_EVENTS),
              }),
            );
            dispatch(setEditTourId(selectedTour?.id));
            navigation.navigate('CreatePostStack', {
              screen: 'CreatePostStepOne',
            });
          } else if (selectedTour?.tourType === 'ACTIVITY') {
            dispatch(
              setSelectedCreatePostOption({
                id: 2,
                title: t(LOCALES.CREATE_POST.LBL_ACTIVITIES),
              }),
            );
            dispatch(setEditTourId(selectedTour?.id));
            navigation.navigate('CreatePostStack', {
              screen: 'CreatePostStepOne',
            });
          } else {
          }
        }}
        onDelete={() => {
          if (selectedTour?.id) {
            moreModalRef?.current?.close();
            deleteTour();
          }
        }}
        setIsModalOpen={setIsModalOpen}
      />
      <GreetReportModal
        userData={selectedTour?.user}
        bottomSheetModalRef={greetReportModalRef}
        setIsModalOpen={setIsModalOpen}
        onClose={dismissAll}
      />

      <ReportModal
        bottomSheetModalRef={reportModalRef}
        reportType={'TOUR'}
        reportId={selectedTour?.id}
        onSuccessfulReport={() => {
          handleGreetReportModalPress();
        }}
      />
    </View>
  );
};

export default All;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    marginBottom: Platform.OS === 'android' ? 30 : 0,
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
  },
  userStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
