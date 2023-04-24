import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import useTheme from '../../../../../theme/hooks/useTheme';
import {responsiveFontSize} from '../../../../../theme/responsiveFontSize';
import LOCALES from '../../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import Premium from '../../../../../assets/icons/svg/premium';
import Verify from '../../../../../assets/icons/svg/Verify';

type UserInfoType = {
  name: string;
  location: string;
  userProfile: any;
  onRateReviews: () => void;
  followerCount: number;
  followingCount: number;
  rate: string;
  isActiveSubscription: boolean;
  isKycVerified: boolean;
};

const UserInfo = ({
  name,
  location,
  userProfile,
  onRateReviews = () => {},
  followerCount = 0,
  followingCount = 0,
  rate = '',
  isActiveSubscription = false,
  isKycVerified = false,
}: UserInfoType) => {
  const {COLORS, FONTS} = useTheme();
  const {t} = useTranslation();
  const titleStyle = useMemo(
    () => [
      {
        fontSize: responsiveFontSize(14),
        fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
        color: COLORS.PRIMARY_TEXT_COLOR,
      },
    ],
    [FONTS, COLORS],
  );
  const descriptionStyle = useMemo(
    () => [
      {
        fontSize: responsiveFontSize(14),
        fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
        color: COLORS.PRIMARY_TEXT_COLOR,
        opacity: 0.3,
      },
    ],
    [FONTS, COLORS],
  );
  const nameStyle = useMemo(
    () => [
      {
        fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
        fontSize: responsiveFontSize(16),
        marginBottom: 5,
        color: COLORS.PRIMARY_TEXT_COLOR,
      },
    ],
    [FONTS, COLORS],
  );
  const locatrionStyle = useMemo(
    () => [
      {
        fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
        fontSize: responsiveFontSize(12),
        color: COLORS.SECONDARY_COLOR,
      },
    ],
    [FONTS, COLORS],
  );

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View>
          <Image source={userProfile} style={styles.image} />
          <View style={styles.userStatus}>
            {isActiveSubscription ? (
              <Premium height={24} width={24} />
            ) : isKycVerified ? (
              <Verify height={24} width={24} />
            ) : null}
          </View>
        </View>
        <View style={{marginLeft: 20}}>
          <Text style={nameStyle}>{name}</Text>
          <Text style={locatrionStyle}>{location}</Text>
        </View>
        <View style={{flex: 1}} />
      </View>
      <View style={[styles.row, {marginTop: 30}]}>
        <View>
          <Text style={titleStyle}>{followingCount}</Text>
          <Text style={descriptionStyle}>
            {t(LOCALES.APP_PROFILE.LBL_FOLLOWING)}
          </Text>
        </View>
        <View
          style={[
            styles.line,
            {borderColor: COLORS.CHIP_INACTIVE_BORDER_COLOR},
          ]}
        />
        <View>
          <Text style={titleStyle}>{followerCount}</Text>
          <Text style={descriptionStyle}>
            {t(LOCALES.APP_PROFILE.LBL_FOLLOWERS)}
          </Text>
        </View>
        <View
          style={[
            styles.line,
            {borderColor: COLORS.CHIP_INACTIVE_BORDER_COLOR},
          ]}
        />
        <Pressable onPress={onRateReviews}>
          <Text style={titleStyle}>{rate}</Text>
          <Text style={descriptionStyle}>
            {t(LOCALES.APP_PROFILE.LBL_RATE_REVIEW)}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default UserInfo;

const styles = StyleSheet.create({
  container: {marginTop: -40, marginHorizontal: 20, zIndex: 20},
  image: {
    height: 96,
    width: 96,
    borderRadius: 45,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  line: {
    borderLeftWidth: 1,
    height: 21,
    marginHorizontal: 20,
  },
  userStatus: {
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
});
