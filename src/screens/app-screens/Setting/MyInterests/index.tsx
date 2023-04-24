import {
  ActivityIndicator,
  Keyboard,
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
import Header from '../../../../components/Header';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import useTheme from '../../../../theme/hooks/useTheme';
import LOCALES from '../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {MyInterestsScreenProps} from '../../../../types/navigation/appTypes';
import TextField from '../../../../components/TextField';
import {SEARCH} from '../../../../assets/icons/svg';
import Chip from '../../../../components/Chip';
import Button from '../../../../components/Button';
import {useApi} from '../../../../hooks/useApi';
import {URL} from '../../../../constants/URLS';
import {appAlert} from '../../../../components/appAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setUserDetails} from '../../../../store/slice/authSlice';
import {useAppDispatch, useAppSelector} from '../../../../store';
import {setProfileInformation} from '../../../../store/slice/profileSlice';

type interestListType = {
  id: string;
  name: string;
  urn: string;
  isSelected: boolean;
}[];

const MyInterests = ({navigation}: MyInterestsScreenProps) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
  const [chipData, setChipData] = useState<interestListType>([]);
  const {userDetails} = useAppSelector(state => state.auth);

  const handleChipPress = useCallback(
    (id: string) => {
      const arr = chipData.map(item => {
        if (item.id === id) {
          item.isSelected = !item.isSelected;
        }
        return item;
      });
      setChipData(arr);
    },
    [chipData],
  );
  const [
    getInterestList,
    interestListResponse,
    interestListError,
    isInterestListLoading,
  ] = useApi({
    url: URL.GET_INTEREST_LIST,
    method: 'GET',
    isSecureEntry: false,
  });

  useEffect(() => {
    if (interestListResponse) {
      if (interestListResponse?.statusCode === 200) {
        const result = interestListResponse?.data?.interests?.map(
          (item: any, index: number) => ({
            ...item,
            isSelected: userDetails?.interests?.some(
              (e: any) => e.id == item.id,
            ),
          }),
        );
        setChipData(result);
      }
    }
  }, [interestListResponse]);

  useEffect(() => {
    if (interestListError) {
      if (interestListError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: interestListError?.message,
        });
      }
    }
  }, [interestListError]);

  useEffect(() => {
    getInterestList();
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
          message: t(LOCALES.SUCCESS.LBL_INTREST_ADDED_SUCCESS),
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

  const MemorizedList = useMemo(
    () =>
      chipData.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [search, chipData],
  );

  const interestList = useMemo(
    () => (search?.length > 0 ? MemorizedList : chipData),
    [search, MemorizedList, chipData],
  );

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
        title={t(LOCALES.SETTING.LBL_MY_INTERESTS)}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flex: isInterestListLoading ? 1 : 0,
        }}>
        <View style={styles.container}>
          <TextField
            leftIcon={<SEARCH />}
            placeholder={t(LOCALES.PROFILE.SEARCH)}
            customLeftIconStyle={{marginRight: 10}}
            value={search}
            onChangeText={setSearch}
          />
          {isInterestListLoading ? (
            <View style={styles.activityIndicator}>
              <ActivityIndicator />
            </View>
          ) : (
            <>
              <Pressable
                style={styles.chipParent}
                onPress={() => Keyboard.dismiss()}>
                {interestList.map(data => (
                  <Chip
                    onPress={() => {
                      if (!isUpdateProfileLoading) {
                        handleChipPress(data.id);
                      }
                    }}
                    key={data.id}
                    isSelected={data.isSelected}
                    title={data.name}
                    customLabelStyle={{
                      fontFamily: FONTS.MONTSERRAT.MEDIUM,
                      flex: 0,
                      fontSize: responsiveFontSize(12),
                    }}
                    containerStyle={[
                      data.isSelected && {
                        backgroundColor: COLORS.PRIMARY_BUTTON_COLOR,
                      },
                      styles.chipContainer,
                    ]}
                    parentStyle={{width: 'auto'}}
                  />
                ))}
              </Pressable>
              <View style={{marginBottom: 20}} />
            </>
          )}
        </View>
      </ScrollView>
      <View style={{marginHorizontal: 20}}>
        <Button
          title={t(LOCALES.SETTING.LBL_SUBMIT)}
          containerStyle={{
            marginBottom: Platform.OS === 'android' ? 20 : 0,
          }}
          onPress={() => {
            const interestIds = chipData
              .filter(item => item.isSelected)
              .map(item => item.id);
            let formdata = new FormData();
            interestIds?.map((item: string, index: number) =>
              formdata.append(`interestIds[${index}]`, item),
            );
            updateProfile(formdata);
          }}
          loading={isUpdateProfileLoading}
          disabled={
            chipData.filter(item => item.isSelected).length === 0 ||
            isUpdateProfileLoading
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default MyInterests;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 40,
  },
  chipParent: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chipContainer: {
    width: 'auto',
    borderRadius: 10,
    marginHorizontal: 8,
    marginBottom: 15,
    height: 40,
    minWidth: '28%',
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
