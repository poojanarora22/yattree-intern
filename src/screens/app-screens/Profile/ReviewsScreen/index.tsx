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
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import useTheme from '../../../../theme/hooks/useTheme';
import Header from '../../../../components/Header';
import {ReviewsScreenProps} from '../../../../types/navigation/appTypes';
import Chip from '../../../../components/Chip';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import {USER_PROFILE} from '../../../../assets/images';
import LOCALES from '../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {useApi} from '../../../../hooks/useApi';
import {URL} from '../../../../constants/URLS';
import {appAlert} from '../../../../components/appAlert';
import {useAppSelector} from '../../../../store';

const ReviewsScreen = ({navigation, route}: ReviewsScreenProps) => {
  const {isMyProfileScreen, userId} = route.params;
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();
  const {userDetails} = useAppSelector(state => state.auth);
  const [rateUserList, setRateUserList] = useState<any>([]);
  const [page, setPage] = useState(2);
  const [selectedTab, setSelectedTab] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const DATA = [
    {
      id: 0,
      title: t(LOCALES.APP_PROFILE.LBL_FOR_ME),
      isSelected: true,
    },
    {
      id: 1,
      title: t(LOCALES.APP_PROFILE.LBL_BY_ME),
      isSelected: false,
    },
  ];
  const [chipData, setChipData] = useState(DATA);

  const handleChipPress = useCallback(
    (id: number) => {
      const arr = chipData.map(item => {
        if (item.id === id) {
          item.isSelected = true;
          setRateUserList([]);
          setPage(2);
          if (item?.id === 0 && item.isSelected) {
            const data = {
              ratedBy: 'OTHER',
              page: 1,
            };
            getRateUserList(data);
            setSelectedTab(0);
          } else if (item?.id === 1 && item.isSelected) {
            const data = {
              ratedBy: 'SELF',
              page: 1,
            };
            getRateUserList(data);
            setSelectedTab(1);
          }
        } else {
          item.isSelected = false;
        }
        return item;
      });
      setChipData(arr);
    },
    [chipData],
  );

  const renderItem = useCallback(({item}: any) => {
    return (
      <View>
        <View style={[styles.row, {alignItems: 'flex-start'}]}>
          <Pressable
            onPress={() => {
              if (item?.user?.id === userDetails?.id) {
                navigation.navigate('ProfileStack', {
                  screen: 'MyProfileScreen',
                });
              } else {
                navigation.push('ProfileStack', {
                  screen: 'UserProfileScreen',
                  params: {
                    userId: item?.user?.id,
                  },
                });
              }
            }}>
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
          </Pressable>
          <View>
            <Text
              onPress={() => {
                if (item?.user?.id === userDetails?.id) {
                  navigation.navigate('ProfileStack', {
                    screen: 'MyProfileScreen',
                  });
                } else {
                  navigation.push('ProfileStack', {
                    screen: 'UserProfileScreen',
                    params: {
                      userId: item?.user?.id,
                    },
                  });
                }
              }}
              numberOfLines={1}
              style={{
                fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                color: COLORS.PRIMARY_TEXT_COLOR,
                fontSize: responsiveFontSize(14),
                marginHorizontal: 15,
                marginTop: 6,
              }}>
              {item?.user?.firstName} {item?.user?.lastName}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.MONTSERRAT.MEDIUM,
                color: COLORS.SECONDARY_TEXT_COLOR,
                fontSize: responsiveFontSize(12),
                marginHorizontal: 15,
                marginTop: 6,
              }}>
              Liked {item?.ratingCount} times from {item?.totalTourCount} trips
            </Text>
          </View>
        </View>
        <View
          style={[styles.line, {borderColor: COLORS.FEED_BACKGROUND_COLOR}]}
        />
      </View>
    );
  }, []);

  const ListHeaderComponent = useCallback(() => {
    return (
      <>
        {isMyProfileScreen ? (
          <View
            style={[
              styles.row,
              {marginBottom: 40, justifyContent: 'space-between'},
            ]}>
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
        ) : (
          <View style={{marginBottom: 26}} />
        )}
      </>
    );
  }, []);

  const [
    getRateUserList,
    rateUserListResponse,
    rateUserListError,
    isRateLoading,
  ] = useApi({
    url: isMyProfileScreen ? URL.GET_MY_RATINGS : URL.GET_USER_RATINGS,
    method: 'PUT',
  });

  useEffect(() => {
    if (isMyProfileScreen) {
      const data = {
        ratedBy: 'OTHER',
        page: 1,
      };
      getRateUserList(data);
    } else {
      const data = {
        userId: userId,
        page: 1,
      };
      getRateUserList(data);
    }
  }, []);

  useEffect(() => {
    if (rateUserListResponse) {
      if (rateUserListResponse?.statusCode === 200) {
        setTotalPages(rateUserListResponse?.data?.totalPages);
        if (rateUserListResponse?.data?.page === 1) {
          setRateUserList(rateUserListResponse?.data?.ratings);
        } else {
          setRateUserList([
            ...rateUserList,
            ...rateUserListResponse?.data?.ratings,
          ]);
        }
      }
    }
  }, [rateUserListResponse]);

  useEffect(() => {
    if (rateUserListError) {
      if (rateUserListError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: rateUserListError?.message,
        });
      }
    }
  }, [rateUserListError]);

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
        title={t(LOCALES.APP_PROFILE.LBL_RATE_REVIEW)}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        {isRateLoading && page === 2 ? (
          <View style={{flex: 1}}>
            {ListHeaderComponent()}
            <View style={styles.loader}>
              <ActivityIndicator />
            </View>
          </View>
        ) : (
          <FlatList
            data={rateUserList}
            renderItem={renderItem}
            ListHeaderComponent={ListHeaderComponent}
            contentContainerStyle={{
              flex: rateUserList?.length === 0 ? 1 : 0,
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
            onEndReachedThreshold={0}
            onEndReached={() => {
              if (page - 1 < totalPages) {
                if (isMyProfileScreen) {
                  const data = {
                    ratedBy: selectedTab === 0 ? 'OTHER' : 'SELF',
                    page: page,
                  };
                  getRateUserList(data);
                  setPage(page + 1);
                } else {
                  const data = {
                    userId: userId,
                    page: page,
                  };
                  getRateUserList(data);
                  setPage(page + 1);
                }
              }
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ReviewsScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginHorizontal: 20,
    flex: 1,
  },
  chipContainer: {
    width: '100%',
    height: 50,
  },
  chipParent: {
    width: '48%',
    borderRadius: 17,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    height: 48,
    width: 48,
    borderRadius: 48 / 2,
  },
  label: {},
  line: {
    borderWidth: 1,
    marginVertical: 20,
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
