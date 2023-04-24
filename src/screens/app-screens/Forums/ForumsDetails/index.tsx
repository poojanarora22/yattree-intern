import {
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import useTheme from '../../../../theme/hooks/useTheme';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import More from '../../../../assets/icons/svg/More';
import Back from '../../../../assets/icons/svg/Back';
import {ForumsDetailsScreenProps} from '../../../../types/navigation/appTypes';
import {HOME_PROFILE_3, USER_PROFILE} from '../../../../assets/images';
import {FlatList} from 'react-native-gesture-handler';
import FeedComment from '../../Home/HomeScreen/FeedComment';
import LOCALES from '../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {useKeyboard} from '../../../../hooks/useKeaboard';
import Report from '../../../../assets/icons/svg/Report';
import Question from '../../../../assets/icons/svg/Question';
import {useApi} from '../../../../hooks/useApi';
import {URL} from '../../../../constants/URLS';
import {appAlert} from '../../../../components/appAlert';
import moment from 'moment';
import {useAppSelector} from '../../../../store';
import CloseReply from '../../../../assets/icons/svg/closeReply';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import ReportModal from '../ReportModal';
import {BlurView} from '@react-native-community/blur';
import Premium from '../../../../assets/icons/svg/premium';
import Verify from '../../../../assets/icons/svg/Verify';

const ForumsDetails = ({navigation, route}: ForumsDetailsScreenProps) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {id} = route.params;
  const reportModalRef = useRef<BottomSheetModal>(null);
  const {t} = useTranslation();
  const {isOpen} = useKeyboard();
  const {bottom} = useSafeAreaInsets();
  const [showTooltip, setShowTooltip] = useState(false);
  const [forumDetails, setForumDetails] = useState<any>(null);
  const [comments, setComments] = useState('');
  const [commentList, setCommentsList] = useState<any>([]);
  const {userDetails} = useAppSelector(state => state.auth);
  const [loading, setLoading] = useState(true);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [isReportUser, setIsReportUser] = useState(true);
  const [replyData, setReplyData] = useState<any>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [reportId, setReportId] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleReportModalPress = useCallback(() => {
    reportModalRef?.current?.present();
  }, []);

  const ListHeaderComponent = useCallback(() => {
    return (
      <>
        <Pressable
          onPress={() => {
            setShowTooltip(false);
          }}
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
                  forumDetails?.user?.avatar
                    ? {
                        uri: forumDetails?.user?.avatar?.mediaUrl,
                      }
                    : USER_PROFILE
                }
                style={styles.image}
              />
              <View style={styles.userStatus}>
                {forumDetails?.user?.isActiveSubscription ? (
                  <Premium />
                ) : forumDetails?.user?.isKycVerified ? (
                  <Verify />
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
                {forumDetails?.user?.firstName} {forumDetails?.user?.lastName}
              </Text>
              <Text
                style={{
                  color: COLORS.COMMENTS_TEXT_COLOR,
                  fontSize: responsiveFontSize(10),
                  fontFamily: FONTS.MONTSERRAT.MEDIUM,
                }}>
                {moment(forumDetails?.createdAt).format('DD MMMM YYYY HH:mm')}
              </Text>
            </View>
          </View>
          <Text
            style={{
              color: COLORS.PRIMARY_TEXT_COLOR,
              fontFamily: FONTS.MONTSERRAT.MEDIUM,
              fontSize: responsiveFontSize(14),
              marginTop: 10,
            }}>
            {forumDetails?.question}
          </Text>
        </Pressable>
        <Text
          style={[
            styles.comment,
            {
              fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
              color: COLORS.PRIMARY_TEXT_COLOR,
            },
          ]}>
          {totalCount}{' '}
          <Text
            style={{
              color: COLORS.COMMENTS_TEXT_COLOR,
            }}>
            {totalCount > 1
              ? t(LOCALES.FORUMS.LBL_ANSWERS)
              : t(LOCALES.FORUMS.LBL_ANSWER)}
          </Text>
        </Text>
      </>
    );
  }, [forumDetails, commentList, totalCount]);

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
            setIsReportUser(false);
            setReportId(id);
            handleReportModalPress();
          }}
          style={styles.tooltipLabelContainer}>
          <Question color={COLORS.TERTIARY_COLOR} height={24} width={24} />
          <Text
            style={{
              color: COLORS.PRIMARY_TEXT_COLOR,
              fontSize: responsiveFontSize(14),
              fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
              marginLeft: 18,
            }}>
            {t(LOCALES.FORUMS.LBL_REPORT_QUESTION)}
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
            setIsReportUser(true);
            setReportId(forumDetails?.user?.id);
            handleReportModalPress();
          }}
          style={styles.tooltipLabelContainer}>
          <Report />
          <Text
            style={{
              color: COLORS.PRIMARY_TEXT_COLOR,
              fontSize: responsiveFontSize(14),
              fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
              marginLeft: 18,
            }}>
            {t(LOCALES.FORUMS.LBL_REPORT_USER)}
          </Text>
        </Pressable>
      </View>
    );
  }, [showTooltip]);

  const [
    getForumDetails,
    forumDetailsResponse,
    forumDetailsError,
    isForumDetailsLoading,
  ] = useApi({
    url: URL.GET_FORUM_DETAILS + id,
    method: 'GET',
  });

  useEffect(() => {
    getForumDetails();
    getCommentList();
  }, []);

  useEffect(() => {
    if (forumDetailsResponse) {
      if (forumDetailsResponse?.statusCode === 200) {
        setForumDetails(forumDetailsResponse?.data?.forum);
      }
    }
  }, [forumDetailsResponse]);

  useEffect(() => {
    if (forumDetailsError) {
      if (forumDetailsError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: forumDetailsError?.message,
        });
      }
    }
  }, [forumDetailsError]);

  const [addComment, addCommentResponse, addCommentError, isAddCommentLoading] =
    useApi({
      url: URL.ADD_COMMENT,
      method: 'POST',
    });

  const [
    getCommentList,
    commentListResponse,
    commentListError,
    isCommentListLoading,
  ] = useApi({
    url: URL.GET_FORUM_COMMENTS + id + '?page=' + page,
    method: 'GET',
  });

  useEffect(() => {
    if (addCommentResponse) {
      if (addCommentResponse?.statusCode === 200) {
        if (replyData) {
          const result = commentList?.map((item: any) => {
            if (replyData?.id === item?.id) {
              item.childComments = [
                ...item?.childComments,
                addCommentResponse?.data?.comment,
              ];
            }
            return item;
          });
          setCommentsList(result);
        } else {
          setCommentsList([addCommentResponse?.data?.comment, ...commentList]);
        }
        setTotalCount(totalCount + 1);
        setComments('');
        setReplyData(null);
      }
    }
  }, [addCommentResponse]);

  useEffect(() => {
    if (addCommentError) {
      if (addCommentError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: addCommentError?.message,
        });
      }
    }
  }, [addCommentError]);

  useEffect(() => {
    if (commentListResponse) {
      if (commentListResponse?.statusCode === 200) {
        setTotalPages(commentListResponse?.data?.totalPages);
        if (page === 1) {
          setCommentsList(commentListResponse?.data?.comments);
        } else {
          setCommentsList([
            ...commentList,
            ...commentListResponse?.data?.comments,
          ]);
        }
        setTotalCount(commentListResponse?.data?.totalCount);
        setComments('');
        setLoading(false);
        setReplyData(null);
        setIsPaginationLoading(false);
      }
    }
  }, [commentListResponse]);

  useEffect(() => {
    if (commentListError) {
      if (commentListError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: commentListError?.message,
        });
        setComments('');
        setLoading(false);
        setReplyData(null);
        setIsPaginationLoading(false);
      }
    }
  }, [commentListError]);

  useEffect(() => {
    if (page > 1) {
      getCommentList();
    }
  }, [page]);

  return (
    <KeyboardAvoidingView style={styles.parent} behavior={'height'} enabled>
      <SafeAreaView
        edges={['top']}
        style={[styles.parent, {backgroundColor: COLORS.PRIMARY_COLOR}]}>
        <StatusBar
          backgroundColor={COLORS.STATUS_BAR_COLOR}
          barStyle={BAR_STYLE}
        />
        <Pressable
          onPress={() => {
            setShowTooltip(false);
          }}
          style={[styles.header, styles.row]}>
          <Pressable onPress={() => navigation.goBack()} style={styles.more}>
            <Back />
          </Pressable>
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
          {userDetails?.id !== forumDetails?.user?.id && (
            <Pressable onPress={() => setShowTooltip(true)} style={styles.more}>
              <More />
            </Pressable>
          )}
          {showTooltip && renderTooltip()}
        </Pressable>
        {isForumDetailsLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator />
          </View>
        ) : (
          <View style={{flex: 1}}>
            <View style={styles.container}>
              <FlatList
                data={commentList}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={ListHeaderComponent}
                style={{flex: 1, marginBottom: replyData ? 120 : 80}}
                contentContainerStyle={{
                  flex: commentList?.length === 0 ? 0.8 : 0,
                }}
                renderItem={({item}) => (
                  <View style={{marginHorizontal: 20}}>
                    <FeedComment item={item} setReplyData={setReplyData} />
                  </View>
                )}
                ListEmptyComponent={() => (
                  <View style={styles.nodata}>
                    <Text
                      style={{
                        color: COLORS.PRIMARY_TEXT_COLOR,
                        fontFamily: FONTS.MONTSERRAT.BOLD,
                        textAlign: 'center',
                      }}>
                      {t(LOCALES.HOME.NO_ANSWERS)}
                    </Text>
                  </View>
                )}
                onEndReachedThreshold={0}
                onEndReached={() => {
                  if (page < totalPages) {
                    setIsPaginationLoading(true);
                    setPage(page + 1);
                  }
                }}
                ListFooterComponent={() => {
                  return isPaginationLoading ? <ActivityIndicator /> : null;
                }}
              />
            </View>
            <View
              style={[
                styles.footer,
                {
                  borderColor: COLORS.RADIO_BUTTON_BACKGROUND_COLOR,
                  backgroundColor: COLORS.MODAL_BACKGROUND_COLOR,
                  paddingBottom:
                    Platform.OS === 'ios' ? (isOpen ? 12 : bottom) : 12,
                },
              ]}>
              {replyData && (
                <View style={[{marginVertical: 10}, styles.row]}>
                  <View>
                    <Text
                      style={{
                        color: COLORS.SECONDARY_TEXT_COLOR,
                        fontFamily: FONTS.MONTSERRAT.MEDIUM,
                        fontSize: responsiveFontSize(12),
                        marginBottom: 4,
                      }}>
                      {t(LOCALES.HOME.REPLY_TO)} {replyData?.name}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: COLORS.PRIMARY_TEXT_COLOR,
                        fontFamily: FONTS.MONTSERRAT.MEDIUM,
                        fontSize: responsiveFontSize(12),
                      }}>
                      {replyData?.text}
                    </Text>
                  </View>
                  <Pressable onPress={() => setReplyData(null)}>
                    <CloseReply />
                  </Pressable>
                </View>
              )}
              <View style={styles.row}>
                <View>
                  <Image
                    source={
                      userDetails?.avatar
                        ? {
                            uri: userDetails?.avatar?.mediaUrl,
                          }
                        : USER_PROFILE
                    }
                    style={[
                      styles.image,
                      {
                        marginBottom:
                          Platform.OS === 'android' ? (isOpen ? 20 : 0) : 0,
                      },
                    ]}
                  />
                  <View style={styles.userStatus}>
                    {userDetails?.isActiveSubscription ? (
                      <Premium />
                    ) : userDetails?.isKycVerified ? (
                      <Verify />
                    ) : null}
                  </View>
                </View>
                <View style={styles.input}>
                  <TextInput
                    placeholder={`${t(LOCALES.HOME.WRITE_ANSWER)}`}
                    placeholderTextColor={COLORS.SECONDARY_TEXT_COLOR}
                    style={{
                      fontSize: responsiveFontSize(14),
                      color: COLORS.PRIMARY_TEXT_COLOR,
                      fontFamily: FONTS.MONTSERRAT.REGULAR,
                      marginBottom:
                        Platform.OS === 'android' ? (isOpen ? 20 : 0) : 0,
                    }}
                    value={comments}
                    onChangeText={setComments}
                  />
                </View>
                <Pressable
                  onPress={() => {
                    if (
                      loading ||
                      isAddCommentLoading ||
                      isCommentListLoading ||
                      isPaginationLoading
                    ) {
                      return;
                    }
                    let data = {};
                    if (replyData) {
                      data = {
                        commentOn: 'FORUM',
                        forumId: id,
                        text: comments,
                        parentCommentId: replyData?.id,
                      };
                    } else {
                      data = {
                        commentOn: 'FORUM',
                        forumId: id,
                        text: comments,
                      };
                    }
                    addComment(data);
                  }}>
                  {isAddCommentLoading ? (
                    <ActivityIndicator />
                  ) : (
                    <Text
                      style={{
                        color: COLORS.SECONDARY_COLOR,
                        fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                        fontSize: responsiveFontSize(12),
                        marginBottom:
                          Platform.OS === 'android' ? (isOpen ? 20 : 0) : 0,
                      }}>
                      {t(LOCALES.HOME.POST)}
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
            {!userDetails?.isActiveSubscription && (
              <BlurView
                style={styles.absolute}
                blurType="dark"
                blurAmount={5}
                reducedTransparencyFallbackColor="white">
                <Pressable
                  onPress={() => {
                    setShowTooltip(false);
                  }}
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: COLORS.PRIMARY_TEXT_COLOR,
                      fontFamily: FONTS.MONTSERRAT.MEDIUM,
                      textAlign: 'center',
                      textAlignVertical:
                        Platform.OS === 'android' ? 'center' : 'auto',
                      paddingHorizontal: 20,
                    }}>
                    Please buy a subscription to access the forums discussion
                  </Text>
                </Pressable>
              </BlurView>
            )}
          </View>
        )}
        <ReportModal
          bottomSheetModalRef={reportModalRef}
          reportType={isReportUser ? 'USER' : 'FORUM'}
          reportId={reportId}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ForumsDetails;

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  container: {
    marginTop: 15,
    flex: 1,
  },
  header: {
    height: 66,
    paddingHorizontal: 20,
    zIndex: 999,
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
  image: {
    height: 46,
    width: 46,
    borderRadius: 23,
  },
  section: {
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  labelContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  comment: {
    fontSize: responsiveFontSize(12),
    marginBottom: 20,
    marginHorizontal: 20,
  },
  footer: {
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
  },
  input: {flex: 1, paddingHorizontal: 15},
  tooltip: {
    position: 'absolute',
    right: 20,
    top: 10,
    width: 216,
    borderRadius: 17,
    borderWidth: 1,
    zIndex: 99999,
  },
  tooltipLabelContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
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
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 5,
  },
  userStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
