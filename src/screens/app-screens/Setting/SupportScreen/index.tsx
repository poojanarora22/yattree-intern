import {
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../../../components/Header';
import useTheme from '../../../../theme/hooks/useTheme';
import LOCALES from '../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import ForwardArrow from '../../../../assets/icons/svg/ForwardArrow';
import {SupportScreenProps} from '../../../../types/navigation/appTypes';

const SupportScreen = ({navigation}: SupportScreenProps) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();

  const supportData = useMemo(
    () => [
      {
        id: 0,
        title: t(LOCALES.SETTING.LBL_ABOUT_US),
      },
      {
        id: 1,
        title: t(LOCALES.SETTING.LBL_PRIVACY_POLICY),
      },
      {
        id: 2,
        title: t(LOCALES.SETTING.LBL_TERMS_CONDITIONS),
      },
      {
        id: 3,
        title: t(LOCALES.SETTING.LBL_CONTACT_US),
      },
    ],
    [],
  );

  const handleNavigation = useCallback((id: number) => {
    switch (id) {
      case 0:
        navigation.navigate('AboutUs');
        break;
      case 1:
        navigation.navigate('PrivacyPolicy');
        break;
      case 2:
        navigation.navigate('TermsConditions');
        break;
      case 3:
        navigation.navigate('ContactUs');
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
              color: COLORS.PRIMARY_TEXT_COLOR,
            }}>
            {item?.title}
          </Text>
        </View>
        <ForwardArrow />
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
        title={t(LOCALES.SETTING.LBL_HELP_SUPPORT)}
        onBackPress={() => navigation.goBack()}
      />
      <FlatList
        data={supportData}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
      />
    </SafeAreaView>
  );
};

export default SupportScreen;

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
