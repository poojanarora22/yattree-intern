import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import useTheme from '../../../../../../theme/hooks/useTheme';
import LOCALES from '../../../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import FeedComment from '../../FeedComment';
import {USER_PROFILE} from '../../../../../../assets/images';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {responsiveFontSize} from '../../../../../../theme/responsiveFontSize';
import {BlurView} from '@react-native-community/blur';
import {useKeyboard} from '../../../../../../hooks/useKeaboard';
import {useApi} from '../../../../../../hooks/useApi';
import {URL} from '../../../../../../constants/URLS';
import {appAlert} from '../../../../../../components/appAlert';
import {useAppSelector} from '../../../../../../store';
import CloseReply from '../../../../../../assets/icons/svg/closeReply';
import Premium from '../../../../../../assets/icons/svg/premium';
import Verify from '../../../../../../assets/icons/svg/Verify';

type CommentsModalType = {
  bottomSheetModalRef: any;
  setIsModalOpen: any;
  tourId: string | null;
};

const CommentsModal = ({
  bottomSheetModalRef,
  tourId,
  setIsModalOpen,
}: CommentsModalType) => {
  const {FONTS, COLORS} = useTheme();
  const {isOpen} = useKeyboard();
  const {t} = useTranslation();
  const snapPoints = useMemo(() => ['60%', '85%'], []);
  const [comments, setComments] = useState('');
  const [commentList, setCommentsList] = useState<any>([]);
  const {userDetails} = useAppSelector(state => state.auth);
  const [loading, setLoading] = useState(true);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [replyData, setReplyData] = useState<any>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const renderBackdrop = useCallback(
    () => (
      <Pressable
        onPress={() => bottomSheetModalRef?.current?.close()}
        style={styles.absolute}>
        <BlurView
          style={styles.absolute}
          blurType="dark"
          blurAmount={10}
          reducedTransparencyFallbackColor="white"
        />
      </Pressable>
    ),
    [],
  );

  const {bottom} = useSafeAreaInsets();
  const handleComponent = useCallback(() => {
    return (
      <View style={styles.handleContainer}>
        <View
          style={[styles.handle, {backgroundColor: COLORS.TERTIARY_COLOR}]}
        />
      </View>
    );
  }, []);

  const ListHeaderComponent = useCallback(() => {
    return (
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
          {totalCount > 1 ? t(LOCALES.HOME.COMMENTS) : t(LOCALES.HOME.COMMENT)}
        </Text>
      </Text>
    );
  }, [totalCount]);

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
    url: URL.GET_TOUR_COMMENTS + tourId + '?page=' + page,
    method: 'GET',
  });

  useEffect(() => {
    if (tourId) {
      setLoading(true);
      setCommentsList([]);
      setPage(1);
      getCommentList();
    } else {
      setLoading(false);
      setCommentsList([]);
    }
  }, [tourId]);

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
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      snapPoints={snapPoints}
      backgroundStyle={{backgroundColor: COLORS.MODAL_BACKGROUND_COLOR}}
      keyboardBehavior="fillParent"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      handleComponent={handleComponent}
      backdropComponent={renderBackdrop}
      onChange={(index: number) => setIsModalOpen(!(index < 1))}>
      <View style={[styles.contentContainerStyle]}>
        <View style={styles.container}>
          {loading ? (
            <View style={styles.loader}>
              <ActivityIndicator />
            </View>
          ) : (
            <BottomSheetFlatList
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              data={commentList}
              renderItem={({item}) => (
                <FeedComment item={item} setReplyData={setReplyData} />
              )}
              style={{flex: 1, marginBottom: replyData ? 120 : 80}}
              contentContainerStyle={{
                flex: commentList?.length === 0 ? 0.8 : 0,
              }}
              ListHeaderComponent={ListHeaderComponent}
              ListEmptyComponent={() => (
                <View style={styles.nodata}>
                  <Text
                    style={{
                      color: COLORS.PRIMARY_TEXT_COLOR,
                      fontFamily: FONTS.MONTSERRAT.BOLD,
                      textAlign: 'center',
                    }}>
                    {t(LOCALES.HOME.NO_COMMENTS)}
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
          )}
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
                style={styles.image}
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
              <BottomSheetTextInput
                placeholder={`${
                  replyData
                    ? t(LOCALES.HOME.REPLY_AS)
                    : t(LOCALES.HOME.COMMENT_AS)
                } ${userDetails?.firstName} ${userDetails?.lastName}`}
                placeholderTextColor={COLORS.SECONDARY_TEXT_COLOR}
                style={{
                  fontSize: responsiveFontSize(14),
                  color: COLORS.PRIMARY_TEXT_COLOR,
                  fontFamily: FONTS.MONTSERRAT.REGULAR,
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
                    commentOn: 'TOUR',
                    tourId: tourId,
                    text: comments,
                    parentCommentId: replyData?.id,
                  };
                } else {
                  data = {
                    commentOn: 'TOUR',
                    tourId: tourId,
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
                  }}>
                  {t(LOCALES.HOME.POST)}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </BottomSheetModal>
  );
};

export default CommentsModal;

const styles = StyleSheet.create({
  handle: {
    height: 3,
    width: 60,
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 15,
  },
  handleContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  contentContainerStyle: {flex: 1},
  container: {
    marginHorizontal: 20,
    flex: 1,
  },
  comment: {
    fontSize: responsiveFontSize(14),
    marginTop: 12,
    alignSelf: 'center',
    marginBottom: 30,
  },
  image: {
    height: 46,
    width: 46,
    borderRadius: 23,
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
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 0,
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
  },
  userStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
