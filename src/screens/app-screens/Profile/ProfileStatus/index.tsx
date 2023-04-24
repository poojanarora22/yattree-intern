import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Button from '../../../../components/Button';
import useTheme from '../../../../theme/hooks/useTheme';
import Header from '../../../../components/Header';
import {ProfileStatusScreenProps} from '../../../../types/navigation/appTypes';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import Check from '../../../../assets/icons/svg/Check';
import TextField from '../../../../components/TextField';
import LOCALES from '../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {useApi} from '../../../../hooks/useApi';
import {URL} from '../../../../constants/URLS';
import {appAlert} from '../../../../components/appAlert';
import {setUserDetails} from '../../../../store/slice/authSlice';
import {useAppDispatch, useAppSelector} from '../../../../store';
import {setProfileInformation} from '../../../../store/slice/profileSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileStatus = ({navigation}: ProfileStatusScreenProps) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();
  const {userDetails} = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const statusData = useMemo(
    () => [
      {
        id: 0,
        title: t(LOCALES.APP_PROFILE.LBL_AVAILABLE),
        isSelected:
          userDetails?.statusText === t(LOCALES.APP_PROFILE.LBL_AVAILABLE),
      },
      {
        id: 1,
        title: t(LOCALES.APP_PROFILE.LBL_BUSY),
        isSelected: userDetails?.statusText === t(LOCALES.APP_PROFILE.LBL_BUSY),
      },
      {
        id: 2,
        title: t(LOCALES.APP_PROFILE.LBL_TRAVEL_THERAPY),
        isSelected:
          userDetails?.statusText === t(LOCALES.APP_PROFILE.LBL_TRAVEL_THERAPY),
      },
      {
        id: 3,
        title: t(LOCALES.APP_PROFILE.LBL_SEARCHING_COUCH_SURFING),
        isSelected:
          userDetails?.statusText ===
          t(LOCALES.APP_PROFILE.LBL_SEARCHING_COUCH_SURFING),
      },
      {
        id: 4,
        title: t(LOCALES.APP_PROFILE.LBL_LOOKING_FOR_HOST),
        isSelected:
          userDetails?.statusText ===
          t(LOCALES.APP_PROFILE.LBL_LOOKING_FOR_HOST),
      },
    ],
    [userDetails],
  );
  const [statusText, setStatusText] = useState('');
  const [status, setStatus] = useState(statusData);
  const handleStatusPress = useCallback((id: number) => {
    const arr = status.map(item => {
      if (item.id === id) {
        item.isSelected = !item.isSelected;
        if (item.isSelected) {
          setStatusText('');
        }
      } else {
        item.isSelected = false;
      }
      return item;
    });
    setStatus(arr);
  }, []);

  const [
    updateProfile,
    updateProfileResponse,
    updateProfileError,
    isUpdateProfileLoading,
  ] = useApi({
    url: URL.UPDATE_PROFILE,
    method: 'PUT',
  });

  useEffect(() => {
    if (updateProfileResponse) {
      if (updateProfileResponse?.statusCode === 200) {
        appAlert({
          title: t(LOCALES.SUCCESS.LBL_SUCCESS),
          message: t(LOCALES.SUCCESS.LBL_PROFILE_STATUS_UPDATE_SUCCESS),
        });
        const result = updateProfileResponse?.data?.user;
        dispatch(setUserDetails(result));
        dispatch(
          setProfileInformation({
            name: result?.firstName + ' ' + result?.lastName,
            bio: result?.bio,
            interests: result?.interests,
            wishLists: result?.wishLists,
            socialHandleLinks: result?.socialHandleLinks,
          }),
        );
        AsyncStorage.setItem('userDetails', JSON.stringify(result));
        navigation.goBack();
      }
    }
  }, [updateProfileResponse]);

  useEffect(() => {
    if (updateProfileError) {
      if (updateProfileError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: updateProfileError?.message,
        });
      }
    }
  }, [updateProfileError]);

  useEffect(() => {
    if (userDetails) {
      if (!statusData.find(item => item.isSelected)) {
        setStatusText(userDetails?.statusText);
      }
    }
  }, [statusData, userDetails]);

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
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled>
        <Header
          title={t(LOCALES.APP_PROFILE.LBL_WHATS_YOUR_MIND)}
          onBackPress={() => navigation.goBack()}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.header}>
            <View style={styles.container}>
              {status.map(status => (
                <View key={status.id}>
                  <Pressable
                    style={styles.row}
                    onPress={() => handleStatusPress(status.id)}>
                    <Text
                      style={{
                        fontSize: responsiveFontSize(14),
                        fontFamily: FONTS.MONTSERRAT.MEDIUM,
                        color: COLORS.PRIMARY_TEXT_COLOR,
                      }}>
                      {status.title}
                    </Text>
                    {status.isSelected && <Check />}
                  </Pressable>
                  <View
                    style={[
                      styles.line,
                      {borderColor: COLORS.FEED_BACKGROUND_COLOR},
                    ]}
                  />
                </View>
              ))}
              <View style={{marginVertical: 20}} />
              <TextField
                editable={
                  !isUpdateProfileLoading &&
                  !status.find(item => item.isSelected)
                }
                placeholder={t(LOCALES.APP_PROFILE.LBL_TYPE_STATUS)}
                containerStyle={{height: 145, paddingVertical: 10}}
                textInputStyle={{
                  height: '100%',
                  fontSize: responsiveFontSize(14),
                }}
                multiline={true}
                value={statusText}
                onChangeText={setStatusText}
              />
            </View>
          </View>
          <View style={[styles.footer, {marginHorizontal: 20}]}>
            <Button
              title={t(LOCALES.APP_PROFILE.LBL_SAVE)}
              onPress={() => {
                let statusTextApi = '';
                if (status.find(item => item.isSelected)) {
                  const data = status?.find(item => item.isSelected);
                  statusTextApi = data?.title || '';
                } else {
                  statusTextApi = statusText.trim();
                }
                const data = {
                  statusText: statusTextApi,
                };
                updateProfile(data);
              }}
              containerStyle={{
                marginBottom: Platform.OS === 'android' ? 20 : 0,
              }}
              loading={isUpdateProfileLoading}
              disabled={
                isUpdateProfileLoading ||
                (!status.find(item => item.isSelected) && !statusText.trim())
              }
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProfileStatus;

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  line: {
    borderWidth: 1,
  },
});
