import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import useTheme from '../../../../theme/hooks/useTheme';
import {useApi} from '../../../../hooks/useApi';
import {URL} from '../../../../constants/URLS';
import LOCALES from '../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {appAlert} from '../../../../components/appAlert';
import {useAppDispatch, useAppSelector} from '../../../../store';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import {USER_PROFILE} from '../../../../assets/images';
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

const Feeds = ({navigation}: any) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();
  const {dismissAll} = useBottomSheetModal();
  const [feedList, setFeedList] = React.useState<any>([]);
  const [page, setPage] = useState(2);
  const [totalPages, setTotalPages] = useState(1);
  const {userDetails} = useAppSelector(state => state.auth);
  const {search} = useAppSelector(state => state.home);
  const commentsModalRef = useRef<BottomSheetModal>(null);
  const moreModalRef = useRef<BottomSheetModal>(null);
  const reportModalRef = useRef<BottomSheetModal>(null);
  const greetReportModalRef = useRef<BottomSheetModal>(null);
  const [tourId, setTourId] = useState(null);
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();

  const [getFeedList, feedListResponse, feedListError, isFeedListLoading] =
    useApi({
      url: URL.SEARCH,
      method: 'POST',
    });

  useEffect(() => {
    if (search && isFocused) {
      const data = {
        q: search,
        searchInModule: 'FEED',
        page: 1,
      };
      getFeedList(data);
    } else {
      setFeedList([]);
      setPage(2);
    }
  }, [search, isFocused]);

  useEffect(() => {
    if (feedListResponse) {
      if (feedListResponse?.statusCode === 200) {
        Keyboard.dismiss();
        setTotalPages(feedListResponse?.data?.totalPages);
        if (feedListResponse?.data?.page === 1) {
          setFeedList(feedListResponse?.data?.tours);
        } else {
          setFeedList([...feedList, ...feedListResponse?.data?.tours]);
        }
      }
    }
  }, [feedListResponse]);

  useEffect(() => {
    if (feedListError) {
      if (feedListError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: feedListError?.message,
        });
      }
    }
  }, [feedListError]);

  const renderItem = ({item}: {item: any}) => {
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

  const handleReportModalPress = useCallback(() => {
    reportModalRef?.current?.present();
  }, []);

  const handleGreetReportModalPress = useCallback(() => {
    greetReportModalRef?.current?.present();
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
          searchInModule: 'FEED',
          page: 1,
        };
        getFeedList(data);
        setFeedList([]);
        setPage(2);
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
      {isFeedListLoading && page === 2 ? (
        <View style={styles.loader}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={feedList}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.container,
            {
              flex: feedList?.length === 0 ? 1 : 0,
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
                q: search,
                searchInModule: 'FEED',
                page: page,
              };
              getFeedList(data);
              setPage(page + 1);
            }
          }}
          ListFooterComponent={() => {
            return isFeedListLoading ? <ActivityIndicator /> : null;
          }}
        />
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

export default Feeds;

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
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
