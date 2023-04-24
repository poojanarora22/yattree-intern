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
import {PermissionsScreenProps} from '../../../../types/navigation/appTypes';
import Switch from '../../../../components/Switch';
import {useApi} from '../../../../hooks/useApi';
import {URL} from '../../../../constants/URLS';
import {appAlert} from '../../../../components/appAlert';
import {setUserDetails} from '../../../../store/slice/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch} from '../../../../store';

const PermissionsScreen = ({navigation}: PermissionsScreenProps) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const PermissionsData = useMemo(
    () => [
      {
        id: 0,
        title: t(LOCALES.SETTING.LBL_ENABLE_LOCATION_SERVICES),
        isSelected: false,
        key: 'locationService',
      },
      {
        id: 1,
        title: t(LOCALES.SETTING.LBL_SHARE_LOCATION),
        isSelected: false,
        key: 'shareLocation',
      },
      {
        id: 2,
        title: t(LOCALES.SETTING.LBL_ALLOW_COMMENTS),
        isSelected: false,
        key: 'allowComments',
      },
    ],
    [],
  );
  const [Permissions, setPermissions] = useState(PermissionsData);

  const [
    getPermissionsData,
    permissionsResponse,
    permissionsError,
    isPermissionsLoading,
  ] = useApi({
    url: URL.PERMISSION,
    method: 'GET',
  });

  useEffect(() => {
    getPermissionsData();
  }, []);

  useEffect(() => {
    if (permissionsResponse) {
      if (permissionsResponse?.statusCode === 200) {
        const result: any = permissionsResponse?.data?.permissionSettings;
        const data = Permissions.map(permissions => {
          if (result.hasOwnProperty(permissions.key)) {
            permissions.isSelected = result[permissions.key];
          }
          return permissions;
        });
        setPermissions(data);
      }
    }
  }, [permissionsResponse]);

  useEffect(() => {
    if (permissionsError) {
      if (permissionsError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: permissionsError?.message,
        });
      }
    }
  }, [permissionsError]);

  const [
    updatePermissionsData,
    updatePermissionsResponse,
    updatePermissionsError,
    isUpdatePermissionsLoading,
  ] = useApi({
    url: URL.PERMISSION,
    method: 'PUT',
  });

  useEffect(() => {
    if (updatePermissionsResponse) {
      if (updatePermissionsResponse?.statusCode === 200) {
      }
    }
  }, [updatePermissionsResponse]);

  useEffect(() => {
    if (updatePermissionsError) {
      if (updatePermissionsError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: updatePermissionsError?.message,
        });
      }
    }
  }, [updatePermissionsError]);

  const handlePress = useCallback((id: number) => {
    if (id === 1) {
      if (!Permissions[0].isSelected) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: 'Please enable location services to share location',
        });
        return;
      }
    }
    const array = [...Permissions];
    array[id].isSelected = !array[id].isSelected;
    if (!array[0].isSelected) {
      array[1].isSelected = false;
    }
    let data: any = {};
    array.map(item => {
      data[item.key] = item.isSelected;
    });
    setPermissions(array);
    updatePermissionsData(data);
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
        title={t(LOCALES.SETTING.LBL_PERMISSIONS)}
        onBackPress={() => navigation.goBack()}
      />
      {isPermissionsLoading ? (
        <View style={styles.activityIndicator}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={Permissions}
          renderItem={renderItem}
          contentContainerStyle={styles.container}
        />
      )}
    </SafeAreaView>
  );
};

export default PermissionsScreen;

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
