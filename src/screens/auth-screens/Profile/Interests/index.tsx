import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import WrapperScreen from '../WrapperScreen';
import LOCALES from '../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import useTheme from '../../../../theme/hooks/useTheme';
import Chip from '../../../../components/Chip';
import TextField from '../../../../components/TextField';
import {SEARCH} from '../../../../assets/icons/svg';
import {InterestsScreenProps} from '../../../../types/navigation/authTypes';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import {useAppDispatch, useAppSelector} from '../../../../store';
import {useApi} from '../../../../hooks/useApi';
import {URL} from '../../../../constants/URLS';
import {appAlert} from '../../../../components/appAlert';
import {setProfileSetupUserData} from '../../../../store/slice/authSlice';

type interestListType = {
  id: string;
  name: string;
  urn: string;
  isSelected: boolean;
}[];

const Interests = ({navigation}: InterestsScreenProps) => {
  const {t} = useTranslation();
  const {COLORS, FONTS} = useTheme();
  const [search, setSearch] = useState('');
  const [chipData, setChipData] = useState<interestListType>([]);
  const dispatch = useAppDispatch();
  const {profileSetupUserData} = useAppSelector(state => state.auth);

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
          (item: any) => ({
            ...item,
            isSelected: false,
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
    <WrapperScreen
      onContinue={() => {
        const result = chipData
          .filter(item => item.isSelected)
          .map(item => item.id);
        dispatch(
          setProfileSetupUserData({
            ...profileSetupUserData,
            interestIds: result,
          }),
        );
        navigation.navigate('BucketList');
      }}
      disabled={chipData.filter(item => item.isSelected).length === 0}
      onSkip={() => navigation.navigate('BucketList')}>
      <Pressable style={styles.container} onPress={() => Keyboard.dismiss()}>
        <Text
          style={[
            styles.label,
            {
              color: COLORS.PRIMARY_TEXT_COLOR,
              fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
            },
          ]}>
          {t(LOCALES.PROFILE.DESCRIPTION_12)}
        </Text>
        <TextField
          leftIcon={<SEARCH />}
          placeholder={t(LOCALES.PROFILE.SEARCH)}
          customLeftIconStyle={{marginRight: 10}}
          value={search}
          onChangeText={setSearch}
        />
      </Pressable>
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
                onPress={() => handleChipPress(data.id)}
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
    </WrapperScreen>
  );
};

export default Interests;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
    marginBottom: 10,
  },
  label: {
    alignSelf: 'center',
    marginBottom: 20,
    fontSize: responsiveFontSize(18),
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
