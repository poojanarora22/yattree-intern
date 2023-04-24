import {
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useMemo, useRef} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../../../components/Header';
import useTheme from '../../../../theme/hooks/useTheme';
import LOCALES from '../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import ForwardArrow from '../../../../assets/icons/svg/ForwardArrow';
import {AccountSettingsScreenProps} from '../../../../types/navigation/appTypes';
import DeleteAccountModal from './DeleteAccountModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useAppSelector} from '../../../../store';
import {appAlert} from '../../../../components/appAlert';

const AccountSettingsScreen = ({navigation}: AccountSettingsScreenProps) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();
  const deleteAccountModalRef = useRef<BottomSheetModal>(null);
  const {userDetails} = useAppSelector(state => state.auth);

  const accountSettingsData = useMemo(
    () => [
      {
        id: 0,
        title: t(LOCALES.SETTING.LBL_PERSIONAL_INFORMATION),
        showRightIcon: true,
      },
      {
        id: 1,
        title: t(LOCALES.SETTING.LBL_CHANGE_PASSWORD),
        showRightIcon: true,
      },
      {
        id: 2,
        title: t(LOCALES.SETTING.LBL_PROFILE_VERIFICATION),
        showRightIcon: true,
      },
      {
        id: 3,
        title: t(LOCALES.SETTING.LBL_MY_INTERESTS),
        showRightIcon: true,
      },
      {
        id: 4,
        title: t(LOCALES.SETTING.LBL_BUCKET_LIST),
        showRightIcon: true,
      },
      {
        id: 5,
        title: t(LOCALES.SETTING.LBL_DELETE_ACCOUNT),
        showRightIcon: false,
      },
    ],
    [],
  );

  const handleNavigation = useCallback((id: number) => {
    switch (id) {
      case 0:
        navigation.navigate('PersonalInformation');
        break;
      case 1:
        navigation.navigate('ChangePassword');
        break;
      case 2:
        if (userDetails?.isKycVerified) {
          appAlert({
            title: t(LOCALES.ERROR.LBL_ERROR),
            message: 'Your profile has already been verified.',
          });
        } else {
          navigation.navigate('ProfileVerification');
        }
        break;
      case 3:
        navigation.navigate('MyInterests');
        break;
      case 4:
        navigation.navigate('BucketList');
        break;
      case 5:
        deleteAccountModalPress();
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
        <View style={{flex: 1}}>
          <Text
            style={{
              fontSize: responsiveFontSize(14),
              fontFamily: FONTS.MONTSERRAT.MEDIUM,
              color: item?.showRightIcon
                ? COLORS.PRIMARY_TEXT_COLOR
                : COLORS.DELETE_ACCOUNT_TEXT_COLOR,
            }}>
            {item?.title}
          </Text>
        </View>
        {item?.showRightIcon && <ForwardArrow />}
      </Pressable>
    );
  }, []);

  const deleteAccountModalPress = useCallback(() => {
    deleteAccountModalRef.current?.present();
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
        title={t(LOCALES.SETTING.LBL_ACCOUNT_SETTINGS)}
        onBackPress={() => navigation.goBack()}
      />
      <FlatList
        data={accountSettingsData}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
      />
      <DeleteAccountModal bottomSheetModalRef={deleteAccountModalRef} />
    </SafeAreaView>
  );
};

export default AccountSettingsScreen;

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
});
