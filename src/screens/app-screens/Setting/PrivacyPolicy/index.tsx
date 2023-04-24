import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import useTheme from '../../../../theme/hooks/useTheme';
import LOCALES from '../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../../../components/Header';
import {PrivacyPolicyScreenProps} from '../../../../types/navigation/appTypes';
import {APP_LOGO_BLACK} from '../../../../assets/images';
import {useApi} from '../../../../hooks/useApi';
import {URL} from '../../../../constants/URLS';
import {appAlert} from '../../../../components/appAlert';
import RenderHTML from 'react-native-render-html';

const PrivacyPolicy = ({navigation}: PrivacyPolicyScreenProps) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();
  const {width} = useWindowDimensions();
  const [privacyPolicyHtml, setPrivacyPolicyHtml] = useState('');

  const [
    getPrivacyPolicyData,
    privacyPolicyResponse,
    privacyPolicyError,
    isPrivacyPolicyLoading,
  ] = useApi({
    url: URL.GET_PRIVACY_POLICY,
    method: 'GET',
    isSecureEntry: false,
  });

  useEffect(() => {
    getPrivacyPolicyData();
  }, []);

  useEffect(() => {
    if (privacyPolicyResponse) {
      if (privacyPolicyResponse?.statusCode === 200) {
        setPrivacyPolicyHtml(privacyPolicyResponse.data.content);
      }
    }
  }, [privacyPolicyResponse]);

  useEffect(() => {
    if (privacyPolicyError) {
      if (privacyPolicyError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: privacyPolicyError?.message,
        });
      }
    }
  }, [privacyPolicyError]);

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
        title={t(LOCALES.SETTING.LBL_PRIVACY_POLICY)}
        onBackPress={() => navigation.goBack()}
      />
      {isPrivacyPolicyLoading ? (
        <View style={styles.activityIndicator}>
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView style={styles.container}>
          <View style={styles.imageContainer}>
            <Image source={APP_LOGO_BLACK} style={styles.image} />
          </View>
          <View style={styles.htmlContant}>
            <RenderHTML
              contentWidth={width}
              source={{
                html: privacyPolicyHtml,
              }}
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {},
  imageContainer: {
    marginVertical: 70,
    alignSelf: 'center',
  },
  image: {
    height: 40,
    width: 260,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  htmlContant: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
});
