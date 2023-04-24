import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import useTheme from '../../../../theme/hooks/useTheme';
import {useApi} from '../../../../hooks/useApi';
import {URL} from '../../../../constants/URLS';
import LOCALES from '../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {appAlert} from '../../../../components/appAlert';
import {useAppSelector} from '../../../../store';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import {USER_PROFILE} from '../../../../assets/images';
import {useIsFocused} from '@react-navigation/native';

import Premium from '../../../../assets/icons/svg/premium';
import Verify from '../../../../assets/icons/svg/Verify';

const Users = ({navigation}: any) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();
  const [userList, setUserList] = React.useState<any>([]);
  const [page, setPage] = useState(2);
  const [totalPages, setTotalPages] = useState(1);
  const {userDetails} = useAppSelector(state => state.auth);
  const {search} = useAppSelector(state => state.home);
  const isFocused = useIsFocused();

  const [getUsersList, usersListResponse, usersListError, isUsersListLoading] =
    useApi({
      url: URL.SEARCH,
      method: 'POST',
    });

  useEffect(() => {
    if (search && isFocused) {
      const data = {
        q: search,
        searchInModule: 'USER',
        page: 1,
      };
      getUsersList(data);
    } else {
      setUserList([]);
      setPage(2);
    }
  }, [search, isFocused]);

  useEffect(() => {
    if (usersListResponse) {
      if (usersListResponse?.statusCode === 200) {
        Keyboard.dismiss();
        setTotalPages(usersListResponse?.data?.totalPages);
        if (usersListResponse?.data?.page === 1) {
          setUserList(usersListResponse?.data?.users);
        } else {
          setUserList([...userList, ...usersListResponse?.data?.users]);
        }
      }
    }
  }, [usersListResponse]);

  useEffect(() => {
    if (usersListError) {
      if (usersListError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: usersListError?.message,
        });
      }
    }
  }, [usersListError]);

  const renderItem = ({item}: {item: any}) => {
    return (
      <View style={styles.row}>
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
        </Pressable>
        <View style={styles.label}>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
              color: COLORS.PRIMARY_TEXT_COLOR,
              fontSize: responsiveFontSize(14),
            }}>
            {item?.firstName} {item?.lastName}
          </Text>
          <Text
            style={{
              fontFamily: FONTS.MONTSERRAT.REGULAR,
              color: COLORS.SECONDARY_TEXT_COLOR,
              fontSize: responsiveFontSize(12),
            }}>
            @{item?.userName}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.APP_BACKGROUND_COLOR,
      }}>
      {isUsersListLoading && page === 2 ? (
        <View style={styles.loader}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={userList}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.container,
            {
              flex: userList?.length === 0 ? 1 : 0,
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
                searchInModule: 'USER',
                page: page,
              };
              getUsersList(data);
              setPage(page + 1);
            }
          }}
          ListFooterComponent={() => {
            return isUsersListLoading ? <ActivityIndicator /> : null;
          }}
        />
      )}
    </View>
  );
};

export default Users;

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginHorizontal: 20,
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
    marginLeft: 14,
  },
  userStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
