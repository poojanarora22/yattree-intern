import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import useTheme from '../../../theme/hooks/useTheme';
import {responsiveFontSize} from '../../../theme/responsiveFontSize';
import {SafeAreaView} from 'react-native-safe-area-context';
import AddCircle from '../../../assets/icons/svg/AddCircle';
import More from '../../../assets/icons/svg/More';
import Question from '../../../assets/icons/svg/Question';
import Chip from '../../../components/Chip';
import {HOME_PROFILE_3, USER_PROFILE} from '../../../assets/images';
import {SEARCH} from '../../../assets/icons/svg';
import {ForumsScreenProps} from '../../../types/navigation/appTypes';
import MoreModal from './MoreModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useTranslation} from 'react-i18next';
import LOCALES from '../../../localization/constants';
import {useApi} from '../../../hooks/useApi';
import {URL} from '../../../constants/URLS';
import {appAlert} from '../../../components/appAlert';
import moment from 'moment';
import {useAppDispatch, useAppSelector} from '../../../store';
import {setIsForumScreenReload} from '../../../store/slice/forumSlice';
import TextField from '../../../components/TextField';
import {useDebounce} from '../../../hooks/useDebounce';
import Premium from '../../../assets/icons/svg/premium';
import Verify from '../../../assets/icons/svg/Verify';

const ForumsScreen = ({navigation}: ForumsScreenProps) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const moreModalRef = useRef<BottomSheetModal>(null);
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {userDetails} = useAppSelector(state => state.auth);
  const {isForumScreenReload} = useAppSelector(state => state.forum);
  const [forumList, setForumList] = useState<any>([]);
  const [page, setPage] = useState(2);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTab, setSelectedTab] = useState<number | null>(0);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const DATA = [
    {
      id: 0,
      title: t(LOCALES.FORUMS.LBL_COMMUNITY),
      isSelected: true,
    },
    {
      id: 1,
      title: t(LOCALES.FORUMS.LBL_BY_ME),
      isSelected: false,
    },
  ];

  const [chipData, setChipData] = useState(DATA);
  const [search, setSearch] = useState('');

  const handleChipPress = (id: number) => {
    const arr = chipData.map(item => {
      if (item.id === id) {
        item.isSelected = !item.isSelected;
        setForumList([]);
        setPage(2);
        if (item?.id === 0 && item.isSelected) {
          const data = {
            q: search.trim(),
            forumType: 'COMMUNITY',
            page: 1,
          };
          getForumList(data);
          setSelectedTab(0);
        } else if (item?.id === 1 && item.isSelected) {
          const data = {
            q: search.trim(),
            forumType: 'SELF',
            page: 1,
          };
          getForumList(data);
          setSelectedTab(1);
        } else {
          const data = {
            q: search.trim(),
            page: 1,
          };
          getForumList(data);
          setSelectedTab(null);
        }
      } else {
        item.isSelected = false;
      }
      return item;
    });
    setChipData(arr);
  };

  const renderItem = useCallback(({item}: any) => {
    return (
      <Pressable
        onPress={() =>
          navigation.navigate('ForumsStack', {
            screen: 'ForumsDetails',
            params: {
              id: item?.id,
            },
          })
        }
        style={[
          styles.section,
          {
            backgroundColor: COLORS.PRIMARY_CHIP_COLOR,
            borderColor: COLORS.CHIP_INACTIVE_BORDER_COLOR,
          },
        ]}>
        <View style={styles.row}>
          <View>
            <Image
              source={
                item?.user?.avatar
                  ? {
                      uri: item?.user?.avatar?.mediaUrl,
                    }
                  : USER_PROFILE
              }
              style={styles.image}
            />
            <View style={styles.userStatus}>
              {item?.user?.isActiveSubscription ? (
                <Premium height={12} width={12} />
              ) : item?.user?.isKycVerified ? (
                <Verify height={12} width={12} />
              ) : null}
            </View>
          </View>

          <View style={styles.labelContainer}>
            <Text
              style={{
                color: COLORS.PRIMARY_TEXT_COLOR,
                fontSize: responsiveFontSize(12),
                fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                marginBottom: 4,
              }}>
              {item?.user?.firstName} {item?.user?.lastName}
            </Text>
            <Text
              style={{
                color: COLORS.COMMENTS_TEXT_COLOR,
                fontSize: responsiveFontSize(10),
                fontFamily: FONTS.MONTSERRAT.MEDIUM,
              }}>
              {moment(item?.createdAt).format('DD MMMM YYYY HH:mm')}
            </Text>
          </View>
          {item?.userId === userDetails?.id && (
            <Pressable
              style={styles.more}
              onPress={() => {
                setSelectedItem({
                  forumId: item?.id,
                  question: item?.question,
                  details: item?.details,
                });
                handleMoreModalPress();
              }}>
              <More />
            </Pressable>
          )}
        </View>
        <Text
          style={{
            color: COLORS.PRIMARY_TEXT_COLOR,
            fontFamily: FONTS.MONTSERRAT.MEDIUM,
            fontSize: responsiveFontSize(14),
            marginTop: 10,
            marginBottom: 18,
          }}>
          {item?.question}
        </Text>
        <View style={[styles.row, {justifyContent: 'flex-start'}]}>
          <Question />
          <Text
            style={{
              fontFamily: FONTS.MONTSERRAT.MEDIUM,
              fontSize: responsiveFontSize(12),
              color: COLORS.COMMENTS_TEXT_COLOR,
              marginLeft: 6,
            }}>
            {item?.commentsCount}{' '}
            {item?.commentsCount > 1
              ? t(LOCALES.FORUMS.LBL_ANSWERS)
              : t(LOCALES.FORUMS.LBL_ANSWER)}
          </Text>
        </View>
      </Pressable>
    );
  }, []);

  const ListHeaderComponent = () => {
    return (
      <>
        <TextField
          value={search}
          onChangeText={setSearch}
          leftIcon={SEARCH}
          placeholder={'Search question'}
          textInputStyle={{fontSize: responsiveFontSize(14)}}
          customLeftIconStyle={{marginRight: 10}}
          parentStyle={{marginBottom: 20}}
        />
        <View style={[styles.row, {marginBottom: 20}]}>
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

  const handleMoreModalPress = useCallback(() => {
    moreModalRef?.current?.present();
  }, []);

  const [getForumList, forumListResponse, forumListError, isForumListLoading] =
    useApi({
      url: URL.GET_FORUM_LIST,
      method: 'POST',
    });

  useEffect(() => {
    if (search.length === 0) {
      setPage(2);
      setForumList([]);
      if (selectedTab === 0) {
        const data = {
          q: search.trim(),
          forumType: 'COMMUNITY',
          page: 1,
        };
        getForumList(data);
      } else if (selectedTab === 1) {
        const data = {
          q: search.trim(),
          forumType: 'SELF',
          page: 1,
        };
        getForumList(data);
      } else {
        const data = {
          q: search.trim(),
          page: 1,
        };
        getForumList(data);
      }
    }
  }, [search]);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedSearch && debouncedSearch.length > 0) {
      setPage(2);
      setForumList([]);
      if (selectedTab === 0) {
        const data = {
          q: debouncedSearch,
          forumType: 'COMMUNITY',
          page: 1,
        };
        getForumList(data);
      } else if (selectedTab === 1) {
        const data = {
          q: debouncedSearch,
          forumType: 'SELF',
          page: 1,
        };
        getForumList(data);
      } else {
        const data = {
          q: debouncedSearch,
          page: 1,
        };
        getForumList(data);
      }
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (isForumScreenReload) {
      setChipData([
        {
          id: 0,
          title: t(LOCALES.FORUMS.LBL_COMMUNITY),
          isSelected: false,
        },
        {
          id: 1,
          title: t(LOCALES.FORUMS.LBL_BY_ME),
          isSelected: true,
        },
      ]);
      setForumList([]);
      setPage(2);
      setSelectedTab(1);
      const data = {
        q: search.trim(),
        forumType: 'SELF',
        page: 1,
      };
      getForumList(data);
    }
  }, [isForumScreenReload]);

  useEffect(() => {
    if (forumListResponse) {
      if (forumListResponse?.statusCode === 200) {
        setTotalPages(forumListResponse?.data?.totalPages);
        if (forumListResponse?.data?.page === 1) {
          setForumList(forumListResponse?.data?.forums);
        } else {
          setForumList([...forumList, ...forumListResponse?.data?.forums]);
        }
        dispatch(setIsForumScreenReload(false));
        setRefreshing(false);
      }
    }
  }, [forumListResponse]);

  useEffect(() => {
    if (forumListError) {
      if (forumListError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: forumListError?.message,
        });
      }
    }
  }, [forumListError]);

  const [
    deleteForumById,
    deleteForumResponse,
    deleteForumError,
    isDeleteForumLoading,
  ] = useApi({
    url: URL.DELETE_FORUM + selectedItem?.forumId,
    method: 'DELETE',
  });

  useEffect(() => {
    if (deleteForumResponse) {
      if (deleteForumResponse?.statusCode === 200) {
        setForumList([]);
        setPage(2);
        setChipData([
          {
            id: 0,
            title: t(LOCALES.FORUMS.LBL_COMMUNITY),
            isSelected: false,
          },
          {
            id: 1,
            title: t(LOCALES.FORUMS.LBL_BY_ME),
            isSelected: true,
          },
        ]);
        setSelectedTab(1);
        const data = {
          q: search.trim(),
          forumType: 'SELF',
          page: 1,
        };
        getForumList(data);
      }
    }
  }, [deleteForumResponse]);

  useEffect(() => {
    if (deleteForumError) {
      if (deleteForumError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: deleteForumError?.message,
        });
      }
    }
  }, [deleteForumError]);

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.parent, {backgroundColor: COLORS.PRIMARY_COLOR}]}>
      <StatusBar
        backgroundColor={COLORS.STATUS_BAR_COLOR}
        barStyle={BAR_STYLE}
      />
      <View style={[styles.header, styles.row]}>
        <Text
          style={[
            styles.headerTitle,
            {
              color: COLORS.PRIMARY_TEXT_COLOR,
              fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
            },
          ]}>
          {t(LOCALES.FORUMS.LBL_FORUMS)}
        </Text>
        <Pressable
          onPress={() => {
            if (userDetails?.isActiveSubscription) {
              navigation.navigate('ForumsStack', {
                screen: 'AddEditQuestion',
                params: {
                  title: t(LOCALES.FORUMS.LBL_ADD_QUESTION),
                  forumId: '',
                  question: '',
                  details: '',
                },
              });
            } else {
              appAlert({
                title: t(LOCALES.ERROR.LBL_ERROR),
                message: 'Please buy a subscription to add question in forum',
              });
            }
          }}>
          <AddCircle />
        </Pressable>
      </View>
      {(isForumListLoading && page === 2) || isDeleteForumLoading ? (
        <View style={styles.container}>
          {ListHeaderComponent()}
          <View style={styles.loader}>
            <ActivityIndicator />
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={forumList}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={
              <>
                <TextField
                  value={search}
                  onChangeText={setSearch}
                  leftIcon={SEARCH}
                  placeholder={'Search question'}
                  textInputStyle={{fontSize: responsiveFontSize(14)}}
                  customLeftIconStyle={{marginRight: 10}}
                  parentStyle={{marginBottom: 20}}
                />
                <View style={[styles.row, {marginBottom: 20}]}>
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
            }
            contentContainerStyle={{
              flex: forumList?.length === 0 ? 1 : 0,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  setForumList([]);
                  setPage(2);
                  setSelectedTab(null);
                  setChipData(DATA);
                  setSearch('');
                  setSelectedTab(0);
                  const data = {
                    q: search.trim(),
                    forumType: 'COMMUNITY',
                    page: 1,
                  };
                  getForumList(data);
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
            onEndReachedThreshold={0}
            onEndReached={() => {
              if (page - 1 < totalPages) {
                if (selectedTab === 0) {
                  const data = {
                    q: search.trim(),
                    forumType: 'COMMUNITY',
                    page: page,
                  };
                  getForumList(data);
                  setPage(page + 1);
                } else if (selectedTab === 1) {
                  const data = {
                    q: search.trim(),
                    forumType: 'SELF',
                    page: page,
                  };
                  getForumList(data);
                  setPage(page + 1);
                } else {
                  const data = {
                    q: search.trim(),
                    page: page,
                  };
                  getForumList(data);
                  setPage(page + 1);
                }
              }
            }}
            ListFooterComponent={() => {
              return isForumListLoading ? (
                <View style={{marginVertical: 20}}>
                  <ActivityIndicator />
                </View>
              ) : null;
            }}
          />
        </View>
      )}
      <MoreModal
        bottomSheetModalRef={moreModalRef}
        onEdit={() => {
          moreModalRef?.current?.close();
          navigation.navigate('ForumsStack', {
            screen: 'AddEditQuestion',
            params: {
              title: t(LOCALES.FORUMS.LBL_EDIT_QUESTION),
              forumId: selectedItem?.forumId,
              question: selectedItem?.question,
              details: selectedItem?.details,
            },
          });
        }}
        onDelete={() => {
          moreModalRef?.current?.close();
          if (selectedItem?.forumId) {
            deleteForumById();
          }
        }}
      />
    </SafeAreaView>
  );
};

export default ForumsScreen;

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  container: {
    marginTop: 15,
    marginHorizontal: 20,
    flex: 1,
  },
  header: {
    height: 66,
    paddingHorizontal: 20,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: responsiveFontSize(18),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chipContainer: {
    width: '100%',
    height: 50,
  },
  chipParent: {
    width: '48%',
    borderRadius: 17,
  },
  image: {
    height: 32,
    width: 32,
    borderRadius: 16,
  },
  section: {
    padding: 15,
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 13,
  },
  labelContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  more: {
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
