import {
  Dimensions,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import useTheme from '../../../../../theme/hooks/useTheme';
import {responsiveFontSize} from '../../../../../theme/responsiveFontSize';
import Chip from '../../../../../components/Chip';
import {
  INSTAGRAM,
  TWITTER,
  FACEBOOK,
  LINKEDIN,
} from '../../../../../assets/icons/svg';
import LOCALES from '../../../../../localization/constants';
import {useRoute} from '@react-navigation/native';
import {useAppSelector} from '../../../../../store';

const ProfileDetails = () => {
  const {params} = useRoute<any>();
  const {COLORS, FONTS} = useTheme();
  const {t} = useTranslation();
  const {profileInformation} = useAppSelector(state => state.profile);

  const titleStyle = useMemo(
    () => [
      {
        color: COLORS.PRIMARY_TEXT_COLOR,
        fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
        fontSize: responsiveFontSize(14),
        marginBottom: 10,
      },
    ],
    [COLORS, FONTS],
  );

  const descriptionStyle = useMemo(
    () => [
      {
        color: COLORS.SECONDARY_TEXT_COLOR,
        fontFamily: FONTS.MONTSERRAT.REGULAR,
        fontSize: responsiveFontSize(14),
      },
    ],
    [COLORS, FONTS],
  );

  const userInterests = useMemo(
    () => [
      {
        id: 0,
        title: t(LOCALES.PROFILE.INTEREST_1),
      },
      {
        id: 1,
        title: t(LOCALES.PROFILE.INTEREST_2),
      },
      {
        id: 2,
        title: t(LOCALES.PROFILE.INTEREST_3),
      },
      {
        id: 3,
        title: t(LOCALES.PROFILE.INTEREST_4),
      },
      {
        id: 4,
        title: t(LOCALES.PROFILE.INTEREST_5),
      },
    ],
    [],
  );

  const getRelationShipStatus = (name: string) => {
    if (name === 'SINGLE') {
      return t(LOCALES.CREATE_POST.LBL_SINGLE);
    } else if (name === 'COMMITTED') {
      return t(LOCALES.CREATE_POST.LBL_COMMITTED);
    } else {
      return '';
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: COLORS.PRIMARY_COLOR}]}>
      <ScrollView
        horizontal
        scrollEnabled={false}
        contentContainerStyle={{width: Dimensions.get('screen').width}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          contentContainerStyle={{
            paddingBottom: 60,
            paddingHorizontal: 20,
          }}>
          <Text style={titleStyle}>
            {t(LOCALES.APP_PROFILE.LBL_ABOUT)}{' '}
            {params?.isMyProfileScreen
              ? t(LOCALES.APP_PROFILE.LBL_ME)
              : profileInformation?.name}
          </Text>
          <Text style={descriptionStyle}>{profileInformation?.bio}</Text>
          <View
            style={[styles.line, {borderColor: COLORS.FEED_BACKGROUND_COLOR}]}
          />
          {/* <Text style={titleStyle}>
            {t(LOCALES.APP_PROFILE.LBL_RELATIONSHIP_STATUS)}
          </Text>
          <Text style={descriptionStyle}>
            {getRelationShipStatus(profileInformation?.relationShipStatus)}
          </Text>
          <View
            style={[styles.line, {borderColor: COLORS.FEED_BACKGROUND_COLOR}]}
          /> */}
          <Text style={titleStyle}>{t(LOCALES.APP_PROFILE.LBL_INTERESTS)}</Text>
          <View style={styles.interestsParent}>
            {profileInformation?.interests?.map(
              (interest: any, index: number) => (
                <View
                  key={interest.id}
                  style={[
                    styles.interestsContainer,
                    {
                      backgroundColor: COLORS.PRIMARY_CHIP_COLOR,
                      marginHorizontal: 5,
                    },
                  ]}>
                  <Text
                    style={{
                      fontFamily: FONTS.MONTSERRAT.MEDIUM,
                      fontSize: responsiveFontSize(13),
                      color: COLORS.PRIMARY_TEXT_COLOR,
                    }}>
                    {interest.name}
                  </Text>
                </View>
              ),
            )}
          </View>
          <View
            style={[
              styles.line,
              {
                borderColor: COLORS.FEED_BACKGROUND_COLOR,
                marginTop:
                  userInterests.length > 0 && !params?.isMyProfileScreen
                    ? 10
                    : 30,
              },
            ]}
          />
          <Text style={titleStyle}>
            {t(LOCALES.APP_PROFILE.LBL_BUCKET_LIST)}
          </Text>

          {profileInformation?.wishLists?.map((item: any, index: number) => (
            <Text style={[descriptionStyle, {marginBottom: 10}]} key={index}>
              {item?.address}
            </Text>
          ))}
          {/* <View
            style={[styles.line, {borderColor: COLORS.FEED_BACKGROUND_COLOR}]}
          />
          <Text style={titleStyle}>
            {t(LOCALES.APP_PROFILE.LBL_SOCIAL_MEDIA)}
          </Text>
          <View style={[styles.row, {marginTop: 10}]}>
            {profileInformation?.socialHandleLinks?.instagram && (
              <Chip
                onPress={() => {
                  Linking.openURL(
                    profileInformation?.socialHandleLinks?.instagram,
                  );
                }}
                title={t(LOCALES.SIGNIN.INSTAGRAM)}
                parentStyle={{width: '48%'}}
                leftIcon={INSTAGRAM}
                customLabelStyle={{textAlign: 'center'}}
              />
            )}
            {profileInformation?.socialHandleLinks?.facebook && (
              <Chip
                onPress={() => {
                  Linking.openURL(
                    profileInformation?.socialHandleLinks?.facebook,
                  );
                }}
                title={t(LOCALES.SIGNIN.FACEBOOK)}
                parentStyle={{width: '48%'}}
                leftIcon={FACEBOOK}
                customLabelStyle={{textAlign: 'center'}}
              />
            )}
          </View>
          <View style={{marginBottom: 24}} />
          <View style={styles.row}>
            {profileInformation?.socialHandleLinks?.twitter && (
              <Chip
                onPress={() => {
                  Linking.openURL(
                    profileInformation?.socialHandleLinks?.twitter,
                  );
                }}
                title={t(LOCALES.SIGNIN.TWITTER)}
                parentStyle={{width: '48%'}}
                leftIcon={TWITTER}
                customLabelStyle={{textAlign: 'center'}}
              />
            )}
            {profileInformation?.socialHandleLinks?.linkedIn && (
              <Chip
                onPress={() => {
                  Linking.openURL(
                    profileInformation?.socialHandleLinks?.linkedIn,
                  );
                }}
                title={t(LOCALES.SIGNIN.LINKEDIN)}
                parentStyle={{width: '48%'}}
                leftIcon={LINKEDIN}
                customLabelStyle={{textAlign: 'center'}}
              />
            )}
          </View> */}
        </ScrollView>
      </ScrollView>
    </View>
  );
};

export default ProfileDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },
  line: {
    borderWidth: 1,
    marginVertical: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  interestsParent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  interestsContainer: {
    marginBottom: 20,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 11,
    height: 40,
    minWidth: '28%',
  },
});
