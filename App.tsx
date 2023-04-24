import React, {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import OneSignal from 'react-native-onesignal';
import {Provider} from 'react-redux';

import './src/localization/i18n';
import RootNavigator from './src/navigation';
import {store} from './src/store';
import {withIAPContext} from 'react-native-iap';
import NetInfo from '@react-native-community/netinfo';
import {appAlert} from './src/components/appAlert';
import LOCALES from './src/localization/constants';
import {useTranslation} from 'react-i18next';

const App = () => {
  const {t} = useTranslation();

  useEffect(() => {
    if (Platform.OS === 'ios') {
      OneSignal.setAppId('73ff5a6d-7221-4b52-84fb-b1a2f6aa3afb');
    } else {
      OneSignal.setAppId('1e8d7e8f-596c-40a4-8c15-1742df2ce822');
    }
    OneSignal.promptForPushNotificationsWithUserResponse();
  }, []);

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener(state => {
      if (state.isConnected === false && state.isInternetReachable === false) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: t(LOCALES.ERROR.LBL_NO_INTERNET),
        });
      }
    });
    return () => removeNetInfoSubscription();
  }, []);

  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
};

export default withIAPContext(App);
