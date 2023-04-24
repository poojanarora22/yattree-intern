import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback} from 'react';
import {HOME_PROFILE_3, USER_PROFILE} from '../../../../../assets/images';
import useTheme from '../../../../../theme/hooks/useTheme';
import {responsiveFontSize} from '../../../../../theme/responsiveFontSize';
import LOCALES from '../../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import Premium from '../../../../../assets/icons/svg/premium';
import Verify from '../../../../../assets/icons/svg/Verify';

const CommentReply = ({item, setReplyData}: any) => {
  const {FONTS, COLORS} = useTheme();
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <View>
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
              <Premium />
            ) : item?.user?.isKycVerified ? (
              <Verify />
            ) : null}
          </View>
        </View>
      </View>
      <View style={styles.textContainer}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            style={[
              styles.label,
              {
                color: COLORS.PRIMARY_TEXT_COLOR,
                fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
              },
            ]}>
            {item?.user?.firstName} {item?.user?.lastName}
          </Text>
          <Text
            style={[
              styles.label,
              {
                color: COLORS.COMMENTS_TEXT_COLOR,
                fontFamily: FONTS.MONTSERRAT.MEDIUM,
              },
            ]}>
            {moment(item?.createdAt).fromNow()}
          </Text>
        </View>
        <Text
          style={[
            styles.label,
            {
              color: COLORS.PRIMARY_TEXT_COLOR,
              fontFamily: FONTS.MONTSERRAT.REGULAR,
            },
          ]}>
          {item?.text}
        </Text>
        <Pressable
          onPress={() => {
            setReplyData({
              name: item?.user?.firstName + ' ' + item?.user?.lastName,
              text: item?.text,
              id: item?.parentCommentId,
            });
          }}>
          <Text
            style={[
              styles.label,
              {
                color: COLORS.SECONDARY_COLOR,
                fontFamily: FONTS.MONTSERRAT.MEDIUM,
              },
            ]}>
            {t(LOCALES.HOME.REPLY)}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default CommentReply;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 50,
    marginBottom: 20,
  },
  image: {
    height: 48,
    width: 48,
    borderRadius: 24,
  },
  label: {
    fontSize: responsiveFontSize(14),
    marginBottom: 8,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  userStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
