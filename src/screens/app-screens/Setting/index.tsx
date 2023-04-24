import {
  FlatList,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import useTheme from '../../../theme/hooks/useTheme';
import LOCALES from '../../../localization/constants';
import {useTranslation} from 'react-i18next';
import Setting from '../../../assets/icons/svg/Settings/Setting';
import Notification from '../../../assets/icons/svg/Settings/Notification';
import Permissions from '../../../assets/icons/svg/Settings/Permissions';
import Reviews from '../../../assets/icons/svg/Settings/Reviews';
import Support from '../../../assets/icons/svg/Settings/Support';
import Logout from '../../../assets/icons/svg/Settings/Logout';
import ForwardArrow from '../../../assets/icons/svg/ForwardArrow';
import Diamond from '../../../assets/icons/svg/Diamond';
import {responsiveFontSize} from '../../../theme/responsiveFontSize';
import Header from '../../../components/Header';
import {SettingsScreenProps} from '../../../types/navigation/appTypes';
import useCleanUp from '../../../hooks/useCleanUp';
import {useAppSelector} from '../../../store';
import {appAlert} from '../../../components/appAlert';

const SettingsScreen = ({navigation}: SettingsScreenProps) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();
  const {userDetails} = useAppSelector(state => state.auth);
  const [logoutUser] = useCleanUp();

  const settingsData = useMemo(
    () => [
      {
        id: 0,
        title: t(LOCALES.SETTING.LBL_ACCOUNT_SETTINGS),
        icon: <Setting />,
        showRightIcon: true,
      },
      {
        id: 1,
        title: t(LOCALES.SETTING.LBL_NOTIFICATIONS),
        icon: <Notification />,
        showRightIcon: true,
      },
      {
        id: 2,
        title: t(LOCALES.SETTING.LBL_PERMISSIONS),
        icon: <Permissions />,
        showRightIcon: true,
      },
      {
        id: 3,
        title: t(LOCALES.SETTING.LBL_RATE_REVIEWS),
        icon: <Reviews />,
        showRightIcon: true,
      },
      {
        id: 4,
        title: t(LOCALES.SETTING.LBL_HELP_SUPPORT),
        icon: <Support />,
        showRightIcon: true,
      },
      {
        id: 5,
        title: t(LOCALES.SETTING.LBL_LOGOUT),
        icon: <Logout />,
        showRightIcon: false,
      },
    ],
    [],
  );

  const handleNavigation = useCallback((id: number) => {
    switch (id) {
      case 0:
        navigation.navigate('AccountSettingsScreen');
        break;
      case 1:
        navigation.navigate('NotificationsScreen');
        break;
      case 2:
        navigation.navigate('PermissionsScreen');
        break;
      case 3:
        navigation.push('ProfileStack', {
          screen: 'ReviewsScreen',
          params: {
            isMyProfileScreen: true,
            userId: userDetails?.id,
          },
        });
        break;
      case 4:
        navigation.navigate('SupportScreen');
        break;
      case 5:
        logoutUser();
        break;
      default:
        break;
    }
  }, []);

  const renderItem = useCallback(({item}: any) => {
    return (
      <Pressable
        onPress={() => handleNavigation(item?.id)}
        style={[
          styles.row,
          styles.section,
          {borderColor: COLORS.INPUT_BACKGROUND_COLOR},
        ]}>
        <View style={{}}>{item?.icon}</View>
        <View style={{flex: 1, paddingHorizontal: 15}}>
          <Text
            style={{
              fontSize: responsiveFontSize(14),
              fontFamily: FONTS.MONTSERRAT.MEDIUM,
              color: COLORS.PRIMARY_TEXT_COLOR,
            }}>
            {item?.title}
          </Text>
        </View>
        {item?.showRightIcon && <ForwardArrow />}
      </Pressable>
    );
  }, []);

  const ListHeaderComponent = useCallback(() => {
    return (
      <>
        {userDetails?.subscription?.subscriptionStatus !== 'CURRENT' ? (
          <Pressable
            onPress={() => {
              if (
                userDetails?.isEmailVerified &&
                userDetails?.isPhoneNumberVerified
              ) {
                navigation.navigate('PremiumPlan');
              } else {
                let message = 'Your email or phone number is not verified.';
                if (!userDetails?.isEmailVerified) {
                  message = 'Your email is not verified.';
                } else if (!userDetails?.isPhoneNumberVerified) {
                  message = 'Your phone number is not verified.';
                }
                appAlert({
                  title: t(LOCALES.ERROR.LBL_ERROR),
                  message: message,
                });
              }
            }}
            style={[
              styles.row,
              styles.premiumPlans,
              {backgroundColor: COLORS.SECONDARY_COLOR},
            ]}>
            <View
              style={[
                styles.diamonds,
                {backgroundColor: COLORS.DIAMONDS_BACKGROUND_COLOR},
              ]}>
              <Diamond />
            </View>
            <View style={{flex: 1, marginLeft: 11}}>
              <Text
                style={{
                  fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                  fontSize: responsiveFontSize(14),
                  color: COLORS.PRIMARY_TEXT_COLOR,
                }}>
                {t(LOCALES.SETTING.LBL_TRY_PREMIUM_PLAN)}
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.MONTSERRAT.REGULAR,
                  fontSize: responsiveFontSize(14),
                  color: COLORS.PRIMARY_TEXT_COLOR,
                  opacity: 0.5,
                  marginTop: 10,
                }}>
                {t(LOCALES.SETTING.LBL_UNLOCK_FEATURES)}
              </Text>
            </View>
            <ForwardArrow />
          </Pressable>
        ) : null}
      </>
    );
  }, [userDetails]);

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
        title={t(LOCALES.SETTING.LBL_SETTINGS)}
        onBackPress={() => navigation.goBack()}
      />
      <FlatList
        data={settingsData}
        renderItem={renderItem}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={styles.container}
      />
      <Text
        style={{
          fontSize: responsiveFontSize(14),
          fontFamily: FONTS.MONTSERRAT.MEDIUM,
          color: COLORS.PRIMARY_TEXT_COLOR,
          textAlign: 'center',
          paddingBottom: Platform.OS === 'android' ? 20 : 0,
        }}>
        App version {Platform.OS === 'android' ? '1.0.50' : '1.0.50'}
      </Text>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  section: {
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  premiumPlans: {
    padding: 18,
    borderRadius: 3,
    marginBottom: 10,
  },
  diamonds: {
    height: 54,
    width: 54,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
