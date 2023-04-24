import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../../../components/Header';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import useTheme from '../../../../theme/hooks/useTheme';
import LOCALES from '../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {NotificationsScreenProps} from '../../../../types/navigation/appTypes';
import Switch from '../../../../components/Switch';
import {useApi} from '../../../../hooks/useApi';
import {URL} from '../../../../constants/URLS';
import {appAlert} from '../../../../components/appAlert';

const NotificationsScreen = ({navigation}: NotificationsScreenProps) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();

  const notificationsData = useMemo(
    () => [
      {
        id: 0,
        title: t(LOCALES.SETTING.LBL_KYC_VERIFIED),
        isSelected: false,
        key: 'kycVerified',
      },
      {
        id: 1,
        title: t(LOCALES.SETTING.LBL_CHAT_NOTIFICATIONS),
        isSelected: false,
        key: 'chat',
      },
      {
        id: 2,
        title: t(LOCALES.SETTING.LBL_FOLLOW_NOTIFICATIONS),
        isSelected: false,
        key: 'follow',
      },
      {
        id: 3,
        title: t(LOCALES.SETTING.LBL_EVENT_HOLIDAY_ACTIVITY_REQUESTED),
        isSelected: false,
        key: 'tourRequested',
      },
      {
        id: 4,
        title: t(LOCALES.SETTING.LBL_REQUEST_ACCEPTED),
        isSelected: false,
        key: 'requestAccepted',
      },
      {
        id: 5,
        title: t(LOCALES.SETTING.LBL_REQUEST_DECLINED),
        isSelected: false,
        key: 'requestDenied',
      },
      {
        id: 6,
        title: t(LOCALES.SETTING.LBL_LIKE_NOTIFICATIONS),
        isSelected: false,
        key: 'like',
      },
      {
        id: 7,
        title: t(LOCALES.SETTING.LBL_COMMENT_NOTIFICATIONS),
        isSelected: false,
        key: 'comment',
      },
    ],
    [],
  );
  const [notifications, setNotifications] = useState(notificationsData);

  const [
    getNotificationData,
    notificationResponse,
    notificationError,
    isNotificationLoading,
  ] = useApi({
    url: URL.NOTIFICATION,
    method: 'GET',
  });

  useEffect(() => {
    getNotificationData();
  }, []);

  useEffect(() => {
    if (notificationResponse) {
      if (notificationResponse?.statusCode === 200) {
        const result: any = notificationResponse?.data?.notificationSettings;
        const data = notifications.map(notification => {
          if (result.hasOwnProperty(notification.key)) {
            notification.isSelected = result[notification.key];
          }
          return notification;
        });
        setNotifications(data);
      }
    }
  }, [notificationResponse]);

  useEffect(() => {
    if (notificationError) {
      if (notificationError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: notificationError?.message,
        });
      }
    }
  }, [notificationError]);

  const [
    updateNotificationData,
    updateNotificationResponse,
    updateNotificationError,
    isUpdateNotificationLoading,
  ] = useApi({
    url: URL.NOTIFICATION,
    method: 'PUT',
  });

  useEffect(() => {
    if (updateNotificationResponse) {
      if (updateNotificationResponse?.statusCode === 200) {
      }
    }
  }, [updateNotificationResponse]);

  useEffect(() => {
    if (updateNotificationError) {
      if (updateNotificationError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: updateNotificationError?.message,
        });
      }
    }
  }, [updateNotificationError]);

  const handlePress = useCallback((id: number) => {
    const arr = notifications.map(item => {
      if (item.id === id) {
        item.isSelected = !item.isSelected;
        let result: any = {};
        notifications.map(item => {
          result[item.key] = item.isSelected;
        });
        const data = {
          ...result,
          [item.key]: item.isSelected,
        };
        updateNotificationData(data);
      }
      return item;
    });
    setNotifications(arr);
  }, []);

  const renderItem = useCallback(({item}: any) => {
    return (
      <Pressable
        onPress={() => handlePress(item?.id)}
        style={[
          styles.row,
          styles.section,
          {borderColor: COLORS.INPUT_BACKGROUND_COLOR},
        ]}>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontSize: responsiveFontSize(14),
              fontFamily: FONTS.MONTSERRAT.MEDIUM,
              color: COLORS.PRIMARY_TEXT_COLOR,
            }}>
            {item?.title}
          </Text>
        </View>
        <Switch
          value={item?.isSelected}
          onChange={() => handlePress(item?.id)}
        />
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
        title={t(LOCALES.SETTING.LBL_NOTIFICATIONS)}
        onBackPress={() => navigation.goBack()}
      />
      {isNotificationLoading ? (
        <View style={styles.activityIndicator}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          contentContainerStyle={styles.container}
        />
      )}
    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 10,
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
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
