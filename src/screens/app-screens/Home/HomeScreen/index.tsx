import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Linking,
  BackHandler,
  Platform,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {HomeScreenProps} from '../../../../types/navigation/appTypes';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useBottomSheetModal} from '@gorhom/bottom-sheet';
import useTheme from '../../../../theme/hooks/useTheme';
import Header from './components/Header';
import LOCALES from '../../../../localization/constants';
import {ALERT_ICON, FILTER, SEARCH, SORT} from '../../../../assets/icons/svg';
import {useTranslation} from 'react-i18next';
import Chip from '../../../../components/Chip';
import Feed from './Feed';
import AlertModal from './components/AlertModal';
import FilterModal from './components/FilterModal';
import LocationModal from './components/LocationModal';
import CommentsModal from './components/CommentsModal';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import SortModal from './components/SortModal';
import {useApi} from '../../../../hooks/useApi';
import {URL} from '../../../../constants/URLS';
import {appAlert} from '../../../../components/appAlert';
import {getParamsFromURL} from '../../../../utilities/functions';
import {useAppDispatch, useAppSelector} from '../../../../store';
import MoreModal from './components/MoreModal';
import {
  setClearCreatePostData,
  setEditTourId,
  setSelectedCreatePostOption,
} from '../../../../store/slice/createPostSlice';
import {setSearch} from '../../../../store/slice/homeSlice';
import GreetReportModal from './components/ReportModal';
import ReportModal from '../../Forums/ReportModal';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setUserDetails} from '../../../../store/slice/authSlice';
import OneSignal from 'react-native-onesignal';
import DeviceInfo from 'react-native-device-info';
import {io, Socket} from 'socket.io-client';
import {getTokens, getVerifiedToken} from '../../../../utilities/token';
import {BannerAdSize, TestIds, BannerAd} from 'react-native-google-mobile-ads';

type addressType = {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  latitude?: string;
  longitude?: string;
};

const HomeScreen = ({navigation}: HomeScreenProps) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {dismissAll} = useBottomSheetModal();
  const {userDetails} = useAppSelector(state => state.auth);
  const alertModalRef = useRef<BottomSheetModal>(null);
  const filterModalRef = useRef<BottomSheetModal>(null);
  const sortModalRef = useRef<BottomSheetModal>(null);
  const locationModalRef = useRef<BottomSheetModal>(null);
  const commentsModalRef = useRef<BottomSheetModal>(null);
  const moreModalRef = useRef<BottomSheetModal>(null);
  const reportModalRef = useRef<BottomSheetModal>(null);
  const greetReportModalRef = useRef<BottomSheetModal>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const listRef: React.LegacyRef<FlatList<any>> = useRef(null);
  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const CONTENT_OFFSET_THRESHOLD = 300;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

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
    socket.emit('getUnreadMessagesCount', {userId: userDetails?.id});
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on('unreadMessagesCount', res => {
      // console.log('unreadMessageCount .....', res);
      setUnreadMessageCount(res?.data?.count || 0);
    });
  }, [socket]);

  const DATA = useMemo(
    () => [
      {
        id: 0,
        title: t(LOCALES.HOME.TAB_TEXT_1),
        displayTitle: t(LOCALES.HOME.HOLIDAY),
        isSelected: false,
      },
      {
        id: 1,
        title: t(LOCALES.HOME.TAB_TEXT_2),
        displayTitle: t(LOCALES.HOME.EVENT),
        isSelected: false,
      },
      {
        id: 2,
        title: t(LOCALES.HOME.TAB_TEXT_3),
        displayTitle: t(LOCALES.HOME.ACTIVITY),
        isSelected: false,
      },
    ],
    [],
  );
  const [refreshing, setRefreshing] = useState(false);
  const [chipData, setChipData] = useState(DATA);
  const [tourList, setTourList] = useState<any>([]);
  const [page, setPage] = useState(2);
  const [totalPages, setTotalPages] = useState(1);
  const [tourId, setTourId] = useState(null);
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [selectedTabDetails, setSelectedTabDetails] = useState<{
    id: number;
    title: string;
    displayTitle: string;
    isSelected: boolean;
  } | null>(null);
  const [filterData, setFilterData] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<addressType | null>(
    null,
  );
  const [SOSList, setSOSList] = useState([]);

  const handleChipPress = (id: number) => {
    const arr = chipData.map(item => {
      if (item.id === id) {
        item.isSelected = !item.isSelected;
        setTourList([]);
        setPage(2);
        if (item?.id === 0 && item.isSelected) {
          const data = {
            tourType: 'HOLIDAY',
            page: 1,
          };
          getTourList(data);
          setSelectedTabDetails(item);
        } else if (item?.id === 1 && item.isSelected) {
          const data = {
            tourType: 'EVENT',
            page: 1,
          };
          getTourList(data);
          setSelectedTabDetails(item);
        } else if (item?.id === 2 && item.isSelected) {
          const data = {
            tourType: 'ACTIVITY',
            page: 1,
          };
          getTourList(data);
          setSelectedTabDetails(item);
        } else {
          const data = {
            page: 1,
          };
          getTourList(data);
          setSelectedTabDetails(null);
        }
      } else {
        item.isSelected = false;
      }
      return item;
    });
    setChipData(arr);
  };

  const searchRightIcon = useCallback(() => {
    return (
      <View style={styles.searchRightIcon}>
        <Pressable style={{marginRight: 10}} onPress={handleSortModalPress}>
          <SORT />
        </Pressable>
        <Pressable onPress={handleFilterModalPress}>
          <FILTER />
        </Pressable>
      </View>
    );
  }, []);

  const ListHeaderComponent = () => {
    return (
      <>
        <View style={styles.searchContainer}>
          <Pressable
            style={[
              styles.fillInput,
              {
                backgroundColor: COLORS.INPUT_BACKGROUND_COLOR,
                borderColor: COLORS.INPUT_INACTIVE_BORDER_COLOR,
              },
            ]}
            onPress={() => {
              dispatch(setSearch(''));
              navigation.navigate('HomeStack', {
                screen: 'Search',
              });
            }}>
            <SEARCH />
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                fontSize: responsiveFontSize(12),
                justifyContent: 'center',
                fontFamily: FONTS.MONTSERRAT.REGULAR,
                color: COLORS.INPUT_PLACEHOLDER_COLOR,
                marginHorizontal: 8,
              }}>
              {t(LOCALES.HOME.SEARCH_PLACEHOLDER)}
            </Text>
            {searchRightIcon()}
          </Pressable>
        </View>
        <View style={styles.row}>
          {chipData.map(data => (
            <Chip
              onPress={() => handleChipPress(data.id)}
              key={data.id}
              isSelected={data.isSelected}
              title={data.title}
              customLabelStyle={[
                {
                  fontFamily: FONTS.MONTSERRAT.MEDIUM,
                  textAlign: 'center',
                  fontSize: responsiveFontSize(12),
                },
                data.isSelected && {
                  color: COLORS.SECONDARY_COLOR,
                },
              ]}
              parentStyle={styles.chipParent}
              containerStyle={styles.chipContainer}
            />
          ))}
        </View>
      </>
    );
  };

  const handleAlertModalPress = useCallback(() => {
    alertModalRef.current?.present();
  }, []);

  const handleFilterModalPress = useCallback(() => {
    filterModalRef.current?.present();
  }, []);

  const handleSortModalPress = useCallback(() => {
    sortModalRef.current?.present();
  }, []);

  const handleLocationModalPress = useCallback(() => {
    locationModalRef.current?.present();
  }, []);

  const handleCommentsModalPress = useCallback(() => {
    commentsModalRef.current?.present();
  }, []);

  const handleMoreModalPress = useCallback(() => {
    moreModalRef?.current?.present();
  }, []);

  const handleReportModalPress = useCallback(() => {
    reportModalRef?.current?.present();
  }, []);

  const handleGreetReportModalPress = useCallback(() => {
    greetReportModalRef?.current?.present();
  }, []);

  const [getTourList, tourListResponse, tourListError, isTourListLoading] =
    useApi({
      url: URL.GET_TOUR_LIST,
      method: 'POST',
    });

  useEffect(() => {
    getTourList();
  }, []);

  useEffect(() => {
    if (tourListResponse) {
      if (tourListResponse?.statusCode === 200) {
        setTotalPages(tourListResponse?.data?.totalPages);
        setTourList([...tourList, ...tourListResponse?.data?.tours]);
        setRefreshing(false);
      }
    }
  }, [tourListResponse]);

  useEffect(() => {
    if (tourListError) {
      if (tourListError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: tourListError?.message,
        });
        setRefreshing(false);
      }
    }
  }, [tourListError]);

  useEffect(() => {
    if (filterData && Object.keys(filterData).length > 0) {
      const data = {
        page: 1,
        ...filterData,
      };
      setSelectedTabDetails(null);
      setTourList([]);
      setPage(2);
      setChipData([
        {
          id: 0,
          title: t(LOCALES.HOME.TAB_TEXT_1),
          displayTitle: t(LOCALES.HOME.HOLIDAY),
          isSelected: false,
        },
        {
          id: 1,
          title: t(LOCALES.HOME.TAB_TEXT_2),
          displayTitle: t(LOCALES.HOME.EVENT),
          isSelected: false,
        },
        {
          id: 2,
          title: t(LOCALES.HOME.TAB_TEXT_3),
          displayTitle: t(LOCALES.HOME.ACTIVITY),
          isSelected: false,
        },
      ]);
      getTourList(data);
    } else {
      setSelectedLocation(null);
    }
  }, [filterData]);

  useEffect(() => {
    if (selectedLocation) {
      setFilterData({
        ...filterData,
        location: selectedLocation?.city,
        fromLocationLatitude: selectedLocation?.latitude,
        fromLocationLongitude: selectedLocation?.longitude,
      });
    }
  }, [selectedLocation]);

  const handleDynamicLink = (link: any) => {
    if (link?.url && link?.url.includes('tour-detail')) {
      const params = getParamsFromURL(link?.url);
      if (params?.id) {
        navigation.navigate('HomeStack', {
          screen: 'FeedDetails',
          params: {tourId: params?.id},
        });
      }
    }
  };

  useEffect(() => {
    Linking.addEventListener('url', handleDynamicLink);
    return () => Linking.removeAllListeners('url');
  }, []);

  useEffect(() => {
    Linking.getInitialURL().then(url => {
      if (url && url.includes('tour-detail')) {
        const params = getParamsFromURL(url);
        if (params?.id) {
          navigation.navigate('HomeStack', {
            screen: 'FeedDetails',
            params: {tourId: params?.id},
          });
        }
      }
    });
  }, []);

  const [getSOSList, SOSListResponse, SOSListError, isSOSListLoading] = useApi({
    url: URL.GET_SOS_LIST,
    method: 'GET',
  });

  useEffect(() => {
    getSOSList();
  }, []);

  useEffect(() => {
    if (SOSListResponse) {
      if (SOSListResponse?.statusCode === 200) {
        if (SOSListResponse?.data?.sos) {
          setSOSList(SOSListResponse?.data?.sos?.availableSOS);
        }
      }
    }
  }, [SOSListResponse]);

  const backAction = useCallback(() => {
    if (navigation.isFocused() && isModalOpen) {
      alertModalRef?.current?.close();
      filterModalRef?.current?.close();
      sortModalRef?.current?.close();
      locationModalRef?.current?.close();
      commentsModalRef?.current?.close();
      moreModalRef?.current?.close();
      reportModalRef?.current?.close();
      greetReportModalRef?.current?.close();
      setIsModalOpen(false);
      return true;
    }
    if (
      navigation.isFocused() &&
      contentVerticalOffset > CONTENT_OFFSET_THRESHOLD
    ) {
      listRef?.current?.scrollToOffset({offset: 0, animated: true});
      return true;
    }
  }, [navigation, isModalOpen, contentVerticalOffset]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [isModalOpen, contentVerticalOffset]);

  const [deleteTour, deleteTourResponse, deleteTourError, isDeleteTourLoading] =
    useApi({
      url: URL.DELETE_TOUR + selectedTour?.id,
      method: 'DELETE',
    });

  useEffect(() => {
    if (deleteTourResponse) {
      if (deleteTourResponse?.statusCode === 200) {
        const data = {
          page: 1,
        };
        setSelectedTabDetails(null);
        setTourList([]);
        setPage(2);
        setChipData([
          {
            id: 0,
            title: t(LOCALES.HOME.TAB_TEXT_1),
            displayTitle: t(LOCALES.HOME.HOLIDAY),
            isSelected: false,
          },
          {
            id: 1,
            title: t(LOCALES.HOME.TAB_TEXT_2),
            displayTitle: t(LOCALES.HOME.EVENT),
            isSelected: false,
          },
          {
            id: 2,
            title: t(LOCALES.HOME.TAB_TEXT_3),
            displayTitle: t(LOCALES.HOME.ACTIVITY),
            isSelected: false,
          },
        ]);
        getTourList(data);
        setTourId(null);
        setFilterData(null);
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

  const [updateProfile, updateProfileResponse] = useApi({
    url: URL.UPDATE_PROFILE,
    method: 'PUT',
  });

  const [getMyProfile, myProfileResponse] = useApi({
    url: URL.GET_MY_PROFILE,
    method: 'GET',
  });

  useEffect(() => {
    if (myProfileResponse) {
      if (myProfileResponse?.statusCode === 200) {
        dispatch(setUserDetails(myProfileResponse?.data));
        AsyncStorage.setItem(
          'userDetails',
          JSON.stringify(myProfileResponse?.data),
        );
      }
    }
  }, [myProfileResponse]);

  useEffect(() => {
    if (updateProfileResponse) {
      if (updateProfileResponse?.statusCode === 200) {
        const result = updateProfileResponse?.data?.user;
        dispatch(setUserDetails(result));
        AsyncStorage.setItem('userDetails', JSON.stringify(result));
      }
    }
  }, [updateProfileResponse]);

  useEffect(() => {
    if (userDetails?.permissions?.locationService) {
      Geolocation.getCurrentPosition(
        info => {
          let formdata = new FormData();
          formdata.append('location[latitude]', info.coords.latitude);
          formdata.append('location[longitude]', info.coords.longitude);
          updateProfile(formdata);
        },
        error => {
          getMyProfile();
        },
      );
    }
  }, []);

  useEffect(() => {
    OneSignal.setNotificationOpenedHandler(notification => {
      navigation.navigate('HomeStack', {
        screen: 'Notification',
      });
    });
  }, []);

  const [notificationToken] = useApi({
    url: URL.NOTIFICATION_TOKEN,
    method: 'PUT',
  });

  useEffect(() => {
    const init = async () => {
      let deviceId = DeviceInfo.getDeviceId();
      let oneSignalData = await OneSignal.getDeviceState();
      const data = {
        playerId: oneSignalData?.userId,
        deviceId: deviceId,
        deviceType: Platform.OS === 'android' ? 'ANDROID' : 'IOS',
        pushToken: oneSignalData?.pushToken,
      };
      notificationToken(data);
    };
    init();
  }, []);

  return (
    <>
      <SafeAreaView
        edges={['top']}
        style={{
          flex: 1,
          backgroundColor: COLORS.APP_BACKGROUND_COLOR,
        }}>
        <StatusBar
          backgroundColor={COLORS.STATUS_BAR_COLOR}
          barStyle={BAR_STYLE}
        />
        <Header
          unreadMessageCount={unreadMessageCount}
          onNotificationIconClick={() => {
            navigation.navigate('HomeStack', {
              screen: 'Notification',
            });
          }}
          onChatIconClick={() =>
            navigation.navigate('ChatStack', {
              screen: 'ChatList',
            })
          }
          onProfileIconClick={() =>
            navigation.navigate('ProfileStack', {screen: 'MyProfileScreen'})
          }
        />
        {(isTourListLoading || isDeleteTourLoading) && page === 2 ? (
          <View style={{flex: 1}}>
            {ListHeaderComponent()}
            <View style={styles.loader}>
              <ActivityIndicator />
            </View>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            onScroll={event => {
              setContentVerticalOffset(event.nativeEvent.contentOffset.y);
            }}
            ListHeaderComponent={ListHeaderComponent}
            keyExtractor={(item, index) => index.toString()}
            data={tourList}
            contentContainerStyle={{
              flex: tourList?.length === 0 ? 1 : 0,
              paddingBottom: 50,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  const data = {
                    page: 1,
                  };
                  setSelectedTabDetails(null);
                  setTourList([]);
                  setPage(2);
                  setChipData([
                    {
                      id: 0,
                      title: t(LOCALES.HOME.TAB_TEXT_1),
                      displayTitle: t(LOCALES.HOME.HOLIDAY),
                      isSelected: false,
                    },
                    {
                      id: 1,
                      title: t(LOCALES.HOME.TAB_TEXT_2),
                      displayTitle: t(LOCALES.HOME.EVENT),
                      isSelected: false,
                    },
                    {
                      id: 2,
                      title: t(LOCALES.HOME.TAB_TEXT_3),
                      displayTitle: t(LOCALES.HOME.ACTIVITY),
                      isSelected: false,
                    },
                  ]);
                  getTourList(data);
                  setTourId(null);
                  setFilterData(null);
                  setSelectedTour(null);
                  if (!socket) return;
                  socket.emit('getUnreadMessagesCount', {
                    userId: userDetails?.id,
                  });
                }}
                tintColor={COLORS.TERTIARY_COLOR}
              />
            }
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
            renderItem={({item, index}) => (
              <>
                <Feed
                  item={item}
                  onFeedMorePress={() => {
                    setIsModalOpen(true);
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
                {!userDetails?.isActiveSubscription && (index + 1) % 5 === 0 && (
                  <View style={styles.ad}>
                    <BannerAd
                      unitId={TestIds.BANNER}
                      size={BannerAdSize.BANNER}
                      requestOptions={{
                        requestNonPersonalizedAdsOnly: true,
                      }}
                    />
                  </View>
                )}
              </>
            )}
            onEndReachedThreshold={0}
            onEndReached={() => {
              if (page - 1 < totalPages) {
                if (selectedTabDetails?.id === 0) {
                  const data = {
                    tourType: 'HOLIDAY',
                    page: page,
                  };
                  getTourList(data);
                  setPage(page + 1);
                } else if (selectedTabDetails?.id === 1) {
                  const data = {
                    tourType: 'EVENT',
                    page: page,
                  };
                  getTourList(data);
                  setPage(page + 1);
                } else if (selectedTabDetails?.id === 2) {
                  const data = {
                    tourType: 'ACTIVITY',
                    page: page,
                  };
                  getTourList(data);
                  setPage(page + 1);
                } else if (filterData && Object.keys(filterData).length > 0) {
                  const data = {
                    page: page,
                    ...filterData,
                  };
                  getTourList(data);
                  setPage(page + 1);
                } else {
                  const data = {
                    page: page,
                  };
                  getTourList(data);
                  setPage(page + 1);
                }
              }
            }}
            ListFooterComponent={() => {
              return isTourListLoading ? <ActivityIndicator /> : null;
            }}
          />
        )}
        <Pressable
          style={[
            styles.alert,
            {backgroundColor: COLORS.ALERT_BACKGROUND_COLOR},
          ]}
          onPress={handleAlertModalPress}>
          <ALERT_ICON />
        </Pressable>
      </SafeAreaView>
      <AlertModal
        bottomSheetModalRef={alertModalRef}
        SOSList={SOSList}
        setIsModalOpen={setIsModalOpen}
      />
      <FilterModal
        setIsModalOpen={setIsModalOpen}
        bottomSheetModalRef={filterModalRef}
        handleLocationModalPress={handleLocationModalPress}
        setFilterData={setFilterData}
        filterData={filterData}
        selectedLocation={
          selectedLocation?.city ||
          selectedLocation?.address?.split(',')[0] ||
          ''
        }
      />
      <SortModal
        bottomSheetModalRef={sortModalRef}
        filterData={filterData}
        setFilterData={setFilterData}
        setIsModalOpen={setIsModalOpen}
      />
      <LocationModal
        bottomSheetModalRef={locationModalRef}
        setSelectedLocation={setSelectedLocation}
        setIsModalOpen={setIsModalOpen}
      />
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
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  searchContainer: {
    marginTop: 10,
    marginHorizontal: 20,
  },
  chipContainer: {
    width: '100%',
    height: 50,
  },
  chipParent: {
    width: '30%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  alert: {
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    position: 'absolute',
    bottom: 10,
    end: 10,
  },
  searchRightIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  fillInput: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
    paddingHorizontal: 18,
    borderWidth: 1,
    marginBottom: 20,
  },
  ad: {
    alignSelf: 'center',
    marginBottom: 20,
  },
});
