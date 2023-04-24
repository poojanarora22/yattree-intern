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
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {responsiveFontSize} from '../../../theme/responsiveFontSize';
import useTheme from '../../../theme/hooks/useTheme';
import LOCALES from '../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import {ChatListScreenProps} from '../../../types/navigation/appTypes';
import {HOME_PROFILE_2, USER_PROFILE} from '../../../assets/images';
import {io, Socket} from 'socket.io-client';
import moment from 'moment';
import {useAppSelector} from '../../../store';
import {getTokens, getVerifiedToken} from '../../../utilities/token';
import Premium from '../../../assets/icons/svg/premium';
import Verify from '../../../assets/icons/svg/Verify';

const ChatList = ({navigation}: ChatListScreenProps) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();
  const [conversations, setConversations] = useState([]);
  const {userDetails} = useAppSelector(state => state.auth);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);

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
    socket.emit('getConversations', {q: ''});
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on('conversations', res => {
      setConversations(res?.data?.conversations);
      setLoading(false);
    });
  }, [socket]);

  const titleStyles = useMemo(
    () => [
      {
        color: COLORS.PRIMARY_TEXT_COLOR,
        fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
        fontSize: responsiveFontSize(14),
      },
    ],
    [COLORS, FONTS],
  );

  const descriptionStyles = useMemo(
    () => [
      {
        color: COLORS.COMMENTS_TEXT_COLOR,
        fontFamily: FONTS.MONTSERRAT.MEDIUM,
        fontSize: responsiveFontSize(12),
      },
    ],
    [COLORS, FONTS],
  );

  const RenderItem = useCallback(({item}: any) => {
    const [unReadCount, setUnReadCount] = useState(0);

    const user = item?.members?.find(
      (item: any) => item?.userId !== userDetails?.id,
    )?.user;

    useEffect(() => {
      const unReadCount = item?.unReadCount?.find(
        (item: any) => item?.userId === userDetails?.id,
      )?.count;
      setUnReadCount(unReadCount);
    }, []);

    return (
      <Pressable
        onPress={() => {
          setUnReadCount(0);
          navigation.navigate('ChatDetails', {
            conversationsId: item?.id,
            userId: user?.id,
            name: user?.firstName + ' ' + user?.lastName,
            isActiveSubscription: user?.isActiveSubscription,
            isKycVerified: user?.isKycVerified,
            imageUri: user?.avatar
              ? {
                  uri: user?.avatar?.mediaUrl,
                }
              : USER_PROFILE,
          });
        }}
        style={[
          styles.chat,
          styles.row,
          {borderColor: COLORS.CHIP_INACTIVE_BORDER_COLOR},
        ]}>
        <View>
          <Image
            source={
              user?.avatar
                ? {
                    uri: user?.avatar?.mediaUrl,
                  }
                : USER_PROFILE
            }
            style={styles.image}
          />
          <View style={styles.userStatus}>
            {user?.isActiveSubscription ? (
              <Premium />
            ) : user?.isKycVerified ? (
              <Verify />
            ) : null}
          </View>
        </View>
        <View style={styles.labelContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}>
            <Text style={titleStyles}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text
              style={[descriptionStyles, {width: '40%', textAlign: 'right'}]}
              numberOfLines={1}>
              {item?.lastMessageAt ? moment(item?.lastMessageAt).fromNow() : ''}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text numberOfLines={1} style={[descriptionStyles, {width: '90%'}]}>
              {item?.lastMessage[0]?.message}
            </Text>
            {unReadCount > 0 && (
              <View
                style={[styles.dot, {backgroundColor: COLORS.CHAT_DOT_COLOR}]}>
                <Text
                  style={{
                    color: COLORS.PRIMARY_TEXT_COLOR,
                    fontSize: responsiveFontSize(12),
                    fontFamily: FONTS.MONTSERRAT.MEDIUM,
                  }}>
                  {unReadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  }, []);

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
        title={t(LOCALES.CHAT.LBL_CHAT)}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator />
          </View>
        ) : (
          <FlatList
            data={conversations}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => <RenderItem item={item} />}
            contentContainerStyle={{
              flex: conversations?.length === 0 ? 1 : 0,
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
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chat: {
    paddingVertical: 20,
    marginHorizontal: 20,
    borderBottomWidth: 1,
  },
  image: {
    height: 48,
    width: 48,
    borderRadius: 24,
  },
  labelContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  nodata: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 20,
    width: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
