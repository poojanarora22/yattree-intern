import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';

import useTheme from '../../../../../theme/hooks/useTheme';
import Feed from '../../../Home/HomeScreen/Feed';
import LOCALES from '../../../../../localization/constants';
import {useIsFocused, useRoute} from '@react-navigation/native';
import Filter from '../../../../../assets/icons/svg/Filter';
import {responsiveFontSize} from '../../../../../theme/responsiveFontSize';
import {useApi} from '../../../../../hooks/useApi';
import {URL} from '../../../../../constants/URLS';
import {appAlert} from '../../../../../components/appAlert';
import {
  setClearCreatePostData,
  setEditTourId,
  setSelectedCreatePostOption,
} from '../../../../../store/slice/createPostSlice';
import {useAppDispatch, useAppSelector} from '../../../../../store';
import {BottomSheetModal, useBottomSheetModal} from '@gorhom/bottom-sheet';
import CommentsModal from '../../../Home/HomeScreen/components/CommentsModal';
import MoreModal from '../../../Home/HomeScreen/components/MoreModal';
import GreetReportModal from '../../../Home/HomeScreen/components/ReportModal';
import ReportModal from '../../../Forums/ReportModal';

const FeedScreen = ({navigation}: any) => {
  const {COLORS, FONTS} = useTheme();
  const {params} = useRoute<any>();
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const {dismissAll} = useBottomSheetModal();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMyHoliday, setIsMyHoliday] = useState(true);
  const [tourList, setTourList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const {userDetails} = useAppSelector(state => state.auth);

  const commentsModalRef = useRef<BottomSheetModal>(null);
  const moreModalRef = useRef<BottomSheetModal>(null);
  const reportModalRef = useRef<BottomSheetModal>(null);
  const greetReportModalRef = useRef<BottomSheetModal>(null);
  const [tourId, setTourId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleCommentsModalPress = useCallback(() => {
    commentsModalRef.current?.present();
  }, []);

  const handleReportModalPress = useCallback(() => {
    reportModalRef?.current?.present();
  }, []);

  const handleGreetReportModalPress = useCallback(() => {
    greetReportModalRef?.current?.present();
  }, []);

  const renderTooltip = useCallback(() => {
    return (
      <View
        style={[
          styles.tooltip,
          {
            backgroundColor: COLORS.PRIMARY_CHIP_COLOR,
            borderColor: COLORS.CHIP_INACTIVE_BORDER_COLOR,
          },
        ]}>
        <Pressable
          onPress={() => {
            setShowTooltip(false);
            setIsMyHoliday(true);
            setPage(1);
            setTourList([]);
            const data = {
              tourType: 'HOLIDAY',
              createdBy: 'SELF',
              userId: params?.id,
              page: 1,
            };
            getTourList(data);
          }}
          style={styles.tooltipLabelContainer}>
          <Text
            style={{
              color: COLORS.PRIMARY_TEXT_COLOR,
              fontSize: responsiveFontSize(14),
              fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
            }}>
            {t(LOCALES.APP_PROFILE.LBL_MY_HOLIDAYS)}
          </Text>
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
            setIsMyHoliday(false);
            setPage(1);
            setTourList([]);
            const data = {
              tourType: 'HOLIDAY',
              createdBy: 'OTHER',
              userId: params?.id,
              page: 1,
            };
            getTourList(data);
          }}
          style={styles.tooltipLabelContainer}>
          <Text
            style={{
              color: COLORS.PRIMARY_TEXT_COLOR,
              fontSize: responsiveFontSize(14),
              fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
            }}>
            {t(LOCALES.APP_PROFILE.LBL_JOINED_HOLIDAYS)}
          </Text>
        </Pressable>
      </View>
    );
  }, [showTooltip]);

  const ListHeaderComponent = useCallback(() => {
    return (
      <>
        {params?.isMyProfileScreen && (
          <View style={styles.row}>
            <Text
              style={{
                fontSize: responsiveFontSize(14),
                fontFamily: FONTS.MONTSERRAT.REGULAR,
                color: COLORS.SECONDARY_TEXT_COLOR,
              }}>
              {isMyHoliday
                ? t(LOCALES.APP_PROFILE.LBL_MY_HOLIDAYS)
                : t(LOCALES.APP_PROFILE.LBL_JOINED_HOLIDAYS)}
            </Text>
            <Pressable
              onPress={() => setShowTooltip(true)}
              style={[
                styles.icon,
                {backgroundColor: COLORS.PRIMARY_CHIP_COLOR},
              ]}>
              <Filter />
              {showTooltip && renderTooltip()}
            </Pressable>
          </View>
        )}
      </>
    );
  }, [COLORS, FONTS, showTooltip]);

  const [getTourList, tourListResponse, tourListError, isTourListLoading] =
    useApi({
      url: URL.GET_USER_TOUR_LIST,
      method: 'POST',
    });

  useEffect(() => {
    if (isFocused) {
      setTourList([]);
      const data = {
        tourType: 'HOLIDAY',
        createdBy: 'SELF',
        userId: params?.id,
        page: 1,
      };
      getTourList(data);
    }
  }, [userDetails, isFocused]);

  useEffect(() => {
    if (tourListResponse) {
      if (tourListResponse?.statusCode === 200) {
        setTotalPages(tourListResponse?.data?.totalPages);
        setTourList([...tourList, ...tourListResponse?.data?.tours]);
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
      }
    }
  }, [tourListError]);

  const handleMoreModalPress = useCallback(() => {
    moreModalRef?.current?.present();
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
          tourType: 'HOLIDAY',
          createdBy: 'SELF',
          userId: params?.id,
          page: 1,
        };
        setTourList([]);
        setPage(1);
        getTourList(data);
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
    <View style={[styles.container, {backgroundColor: COLORS.PRIMARY_COLOR}]}>
      <ScrollView
        horizontal
        scrollEnabled={false}
        contentContainerStyle={{width: Dimensions.get('screen').width}}>
        {isTourListLoading && page === 1 ? (
          <View style={styles.loader}>
            <ActivityIndicator />
          </View>
        ) : (
          <FlatList
            data={tourList}
            nestedScrollEnabled
            ListHeaderComponent={ListHeaderComponent}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponentStyle={{zIndex: showTooltip ? 1 : 5}}
            contentContainerStyle={{
              flex: tourList?.length === 0 ? 1 : 0,
              paddingBottom: 50,
            }}
            renderItem={({item}) => (
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
            )}
            ListEmptyComponent={() => (
              <View style={styles.nodata}>
                <Text
                  style={{
                    color: COLORS.SECONDARY_TEXT_COLOR,
                    fontFamily: FONTS.MONTSERRAT.REGULAR,
                    textAlign: 'center',
                  }}>
                  {t(LOCALES.CREATE_POST.LBL_NO_HOLIDAY)}{' '}
                  {params?.isMyProfileScreen && (
                    <Text
                      onPress={() => {
                        dispatch(setClearCreatePostData(null));
                        dispatch(
                          setSelectedCreatePostOption({
                            id: 0,
                            title: t(LOCALES.CREATE_POST.LBL_HOLIDAYS),
                          }),
                        );
                        navigation.navigate('CreatePostStack', {
                          screen: 'CreatePostStepOne',
                        });
                      }}
                      style={{
                        color: COLORS.SECONDARY_COLOR,
                        fontFamily: FONTS.MONTSERRAT.REGULAR,
                        textAlign: 'center',
                      }}>
                      {t(LOCALES.CREATE_POST.LBL_CREATE_NOW)}
                    </Text>
                  )}
                </Text>
              </View>
            )}
            onEndReachedThreshold={0}
            onEndReached={() => {
              if (page < totalPages) {
                const data = {
                  tourType: 'HOLIDAY',
                  page: page,
                };
                getTourList(data);
                setPage(page + 1);
              }
            }}
            ListFooterComponent={() => {
              return isTourListLoading ? <ActivityIndicator /> : null;
            }}
          />
        )}
      </ScrollView>
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

export default FeedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 30,
  },
  icon: {
    borderRadius: 12,
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
  tooltip: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 216,
    borderRadius: 17,
    borderWidth: 1,
  },
  tooltipLabelContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
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
