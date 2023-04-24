import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import useTheme from '../../../../theme/hooks/useTheme';
import LOCALES from '../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {ChatDetailsScreenProps} from '../../../../types/navigation/appTypes';
import {
  HOME_PROFILE_2,
  HOME_PROFILE_4,
  USER_PROFILE,
} from '../../../../assets/images';
import Back from '../../../../assets/icons/svg/Back';
import {useKeyboard} from '../../../../hooks/useKeaboard';
import SEND from '../../../../assets/icons/svg/Send';
import {io, Socket} from 'socket.io-client';
import moment from 'moment';
import {useAppSelector} from '../../../../store';
import {getTokens, getVerifiedToken} from '../../../../utilities/token';
import Premium from '../../../../assets/icons/svg/premium';
import Verify from '../../../../assets/icons/svg/Verify';

const ChatDetails = ({navigation, route}: ChatDetailsScreenProps) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {
    conversationsId,
    name,
    imageUri,
    userId,
    isActiveSubscription,
    isKycVerified,
  } = route?.params;
  const {t} = useTranslation();
  const {userDetails} = useAppSelector(state => state.auth);
  const {isOpen} = useKeyboard();
  const {bottom} = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [messagesList, setMessagesList] = useState<any>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSendCommentLoading, setIsSendCommentLoading] = useState(false);

  const headerTitleStyles = useMemo(
    () => [
      {
        fontSize: responsiveFontSize(18),
        fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
        color: COLORS.PRIMARY_TEXT_COLOR,
      },
    ],
    [COLORS, FONTS],
  );

  const sectionHeaderTitleStyles: any = useMemo(
    () => [
      {
        color: COLORS.COMMENTS_TEXT_COLOR,
        fontFamily: FONTS.MONTSERRAT.MEDIUM,
        fontSize: responsiveFontSize(12),
        alignSelf: 'center',
        marginTop: 10,
      },
    ],
    [COLORS, FONTS],
  );

  const messageStyles = useMemo(
    () => [
      {
        color: COLORS.PRIMARY_TEXT_COLOR,
        fontFamily: FONTS.MONTSERRAT.REGULAR,
        fontSize: responsiveFontSize(12),
        maxWidth: '80%',
      },
    ],
    [COLORS, FONTS],
  );

  const timeStyles: any = useCallback(
    (isMyMessage: boolean) => [
      {
        color: COLORS.COMMENTS_TEXT_COLOR,
        fontFamily: FONTS.MONTSERRAT.MEDIUM,
        fontSize: responsiveFontSize(12),
        alignSelf: isMyMessage ? 'flex-end' : 'flex-start',
        marginTop: 5,
      },
    ],
    [COLORS, FONTS],
  );

  const getMessageContainerStyle: any = useCallback(
    (isMyMessage: boolean) => [
      styles.message,
      {
        backgroundColor: isMyMessage
          ? COLORS.SECONDARY_COLOR
          : COLORS.PRIMARY_CHIP_COLOR,
        borderBottomLeftRadius: isMyMessage ? 17 : 2,
        borderBottomRightRadius: isMyMessage ? 2 : 17,
        alignSelf: isMyMessage ? 'flex-end' : 'flex-start',
      },
    ],
    [],
  );

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
    socket.emit('getMessages', {
      conversationId: conversationsId,
      page: 1,
      limit: 200,
    });
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.emit('joinConversation', {
      conversationId: conversationsId,
    });
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.emit('markAllAsRead', {conversationId: conversationsId});
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on('newMessage', res => {
      socket.emit('getMessages', {
        conversationId: conversationsId,
        page: 1,
        limit: 200,
      });
    });
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on('messages', res => {
      console.log('messages list ...', res);
      type sectionType = {
        title: string;
        data: {}[];
      };
      const array: sectionType[] = [];
      const todayArr: any = [];
      const weekArr: any = [];
      const monthArr: any = [];

      let month = moment().add(-1, 'month').format('YYYY-MM-DD');
      let week = moment().add(-1, 'week').format('YYYY-MM-DD');
      let today = moment().format('YYYY-MM-DD');

      res?.data?.messages?.map((item: any) => {
        const isMyMessage = item?.sender?.id === userDetails?.id;

        let deliveredTo: any = '';
        if (isMyMessage) {
          deliveredTo = item?.deliveredTo?.find(
            (item: any) => item?.userId === userDetails?.id,
          );
        } else {
          deliveredTo = item?.deliveredTo?.find(
            (item: any) => item?.userId !== userDetails?.id,
          );
        }
        if (moment().isSame(deliveredTo?.deliveredAt, 'day')) {
          todayArr.push(item);
        }
        if (moment(deliveredTo?.deliveredAt).isBetween(week, today)) {
          weekArr.push(item);
        }
        if (moment(deliveredTo?.deliveredAt).isBetween(month, week)) {
          monthArr.push(item);
        }
      });

      if (monthArr.length > 0) {
        array.push({
          title: 'This month',
          data: monthArr,
        });
      }

      if (weekArr.length > 0) {
        array.push({
          title: 'This week',
          data: weekArr,
        });
      }

      if (todayArr.length > 0) {
        array.push({
          title: 'Today',
          data: todayArr,
        });
      }

      setMessagesList(array);
      setLoading(false);
      setIsSendCommentLoading(false);
      setMessage('');
    });
  }, [socket]);

  const Item = ({item}: {item: any}) => {
    const isMyMessage = item?.sender?.id === userDetails?.id;

    let deliveredTo: any = '';
    if (isMyMessage) {
      deliveredTo = item?.deliveredTo?.find(
        (item: any) => item?.userId === userDetails?.id,
      );
    } else {
      deliveredTo = item?.deliveredTo?.find(
        (item: any) => item?.userId !== userDetails?.id,
      );
    }

    return (
      <View style={styles.messageSection}>
        {!isMyMessage && (
          <View
            style={{
              marginRight: 10,
              alignSelf: 'flex-end',
              marginBottom: 20,
            }}>
            <Image
              source={
                item?.sender?.avatar
                  ? {
                      uri: item?.sender?.avatar?.mediaUrl,
                    }
                  : USER_PROFILE
              }
              style={styles.senderImage}
            />
            <View style={styles.userStatus}>
              {item?.sender?.isActiveSubscription ? (
                <Premium height={10} width={10} />
              ) : item?.sender?.isKycVerified ? (
                <Verify height={10} width={10} />
              ) : null}
            </View>
          </View>
        )}
        <View style={styles.messageContainer}>
          <View style={getMessageContainerStyle(isMyMessage)}>
            <Text style={messageStyles}>{item?.message}</Text>
          </View>
          <Text style={timeStyles(isMyMessage)}>
            {moment(deliveredTo?.deliveredAt).fromNow()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={'height'}
      enabled
      keyboardVerticalOffset={Platform.OS === 'android' ? 50 : 0}>
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
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.back}>
            <Back />
          </Pressable>
          <Pressable
            style={styles.titleContainer}
            onPress={() => {
              navigation.navigate('ProfileStack', {
                screen: 'UserProfileScreen',
                params: {
                  userId: userId,
                },
              });
            }}>
            <View style={{marginRight: 13}}>
              <Image source={imageUri} style={styles.headerImage} />
              <View style={styles.userStatus}>
                {isActiveSubscription ? (
                  <Premium />
                ) : isKycVerified ? (
                  <Verify />
                ) : null}
              </View>
            </View>
            <Text style={headerTitleStyles}>{name}</Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator />
          </View>
        ) : (
          <>
            <View style={styles.container}>
              <SectionList
                showsVerticalScrollIndicator={false}
                sections={messagesList}
                keyExtractor={(item, index) => (item.id + index).toString()}
                renderItem={({item}) => <Item item={item} />}
                style={{marginBottom: Platform.OS === 'android' ? 60 : 90}}
                renderSectionHeader={({section: {title}}) => (
                  <Text style={sectionHeaderTitleStyles}>{title}</Text>
                )}
                contentContainerStyle={[
                  styles.container,
                  {
                    flex: messagesList?.length === 0 ? 1 : 0,
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
              />
            </View>
            <View
              style={[
                styles.footer,
                {
                  borderColor: '#262626',
                  backgroundColor: COLORS.MODAL_BACKGROUND_COLOR,
                  marginBottom: isOpen ? 10 : bottom,
                },
              ]}>
              <View style={styles.input}>
                <TextInput
                  placeholder={t(LOCALES.CHAT.LBL_MESSAGE)}
                  placeholderTextColor={COLORS.SECONDARY_TEXT_COLOR}
                  value={message}
                  onChangeText={setMessage}
                  style={{
                    fontSize: responsiveFontSize(14),
                    color: COLORS.PRIMARY_TEXT_COLOR,
                    fontFamily: FONTS.MONTSERRAT.REGULAR,
                  }}
                />
              </View>
              {isSendCommentLoading ? (
                <View
                  style={{
                    margin: 5,
                    height: 38,
                    width: 38,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator />
                </View>
              ) : (
                <Pressable
                  onPress={() => {
                    if (!socket) return;
                    if (!message) return;
                    setIsSendCommentLoading(true);
                    socket.emit('sendNewMessage', {
                      conversationId: conversationsId,
                      message: message,
                      messageType: 'TEXT',
                    });
                  }}
                  style={[
                    styles.send,
                    {backgroundColor: COLORS.PRIMARY_COLOR},
                  ]}>
                  <SEND />
                </Pressable>
              )}
            </View>
          </>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ChatDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    height: 66,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  chat: {
    paddingVertical: 20,
    marginHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerImage: {
    height: 38,
    width: 38,
    borderRadius: 19,
  },
  senderImage: {
    height: 25,
    width: 25,
    borderRadius: 12,
  },
  messageContainer: {
    flex: 1,
  },
  message: {
    padding: 12,
    borderRadius: 17,
  },
  messageSection: {
    marginTop: 10,
    flexDirection: 'row',
  },
  back: {
    height: 24,
    width: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  footer: {
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    height: 48,
    borderWidth: 1,
    borderRadius: 100,
  },
  input: {flex: 1, paddingHorizontal: 20},
  send: {
    height: 38,
    width: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
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
  userStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
