import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {PremiumPlanScreenProps} from '../../../../types/navigation/appTypes';
import Header from '../../../../components/Header';
import {SafeAreaView} from 'react-native-safe-area-context';
import useTheme from '../../../../theme/hooks/useTheme';
import {APP_LOGO_PLANS} from '../../../../assets/images';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import Check from '../../../../assets/icons/svg/Check';
import Button from '../../../../components/Button';
import {Purchase, useIAP} from 'react-native-iap';
import DeviceInfo from 'react-native-device-info';
import {useApi} from '../../../../hooks/useApi';
import {URL} from '../../../../constants/URLS';
import {appAlert} from '../../../../components/appAlert';
import LOCALES from '../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {setUserDetails} from '../../../../store/slice/authSlice';
import {setProfileInformation} from '../../../../store/slice/profileSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch} from '../../../../store';

const PremiumPlan = ({navigation}: PremiumPlanScreenProps) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();
  const {
    connected,
    subscriptions,
    getSubscriptions,
    finishTransaction,
    requestSubscription,
    currentPurchase,
    currentPurchaseError,
  } = useIAP();

  const PLANS =
    Platform.select({
      ios: ['monthly_899', 'Six_Month_2999', 'Annually_4999'],
      android: ['monthly_899', 'six_month_2999', 'annually_4999'],
    }) ?? [];

  const [plans, setPlans] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [isPlanLoading, setIsPlanLoading] = useState(true);

  const FEATURE = [
    'No advertisements',
    'Chat with anyone',
    'Access Map functionality',
    'Get full access of Forums',
    'No limit for holiday, event or activity creation',
    'No limit to join holidays, events or activities',
    'Get your holiday/event/activity displayed first',
  ];

  const onPlanChange = (id: number) => {
    const result = plans.map((item: any) => {
      if (item?.productId === id) {
        item.isSelected = true;
      } else {
        item.isSelected = false;
      }
      return item;
    });
    setPlans(result);
  };

  useEffect(() => {
    if (connected) {
      getSubscriptions({skus: PLANS});
    } else {
      setIsPlanLoading(false);
    }
  }, [getSubscriptions]);

  useEffect(() => {
    if (subscriptions.length > 0) {
      const array: any = [];
      subscriptions.map(item => {
        array.push({
          ...item,
          isSelected: false,
        });
      });
      setPlans(array.reverse());
      setIsPlanLoading(false);
    }
  }, [subscriptions]);

  const getProducName = (id: string) => {
    if (id === 'monthly_899') {
      return 'Monthly';
    } else if (id === 'Six_Month_2999') {
      return 'Six Month';
    } else if (id === 'Annually_4999') {
      return 'Annually';
    } else {
      return '';
    }
  };

  const getProducDuration = (id: string) => {
    if (id === 'monthly_899') {
      return 'MONTHLY';
    } else if (id === 'Six_Month_2999' || id === 'six_month_2999') {
      return 'SIX_MONTHLY';
    } else if (id === 'Annually_4999' || id === 'annually_4999') {
      return 'ANNUALLY';
    } else {
      return '';
    }
  };

  const checkCurrentPurchase = async (purchase?: Purchase): Promise<void> => {
    if (purchase) {
      const receipt =
        Platform.OS === 'android'
          ? purchase?.purchaseToken
          : purchase?.transactionReceipt;
      const selectedPlan = plans.find((item: any) => item.isSelected);
      if (receipt && selectedPlan) {
        const itemSku = selectedPlan?.productId;
        const duration = getProducDuration(selectedPlan?.productId);
        const amount = {
          currency:
            Platform.OS === 'android'
              ? selectedPlan?.subscriptionOfferDetails[0]?.pricingPhases
                  ?.pricingPhaseList[0]?.priceCurrencyCode
              : selectedPlan?.currency,
          value:
            Platform.OS === 'android'
              ? parseInt(
                  selectedPlan?.subscriptionOfferDetails[0]?.pricingPhases
                    ?.pricingPhaseList[0]?.priceAmountMicros,
                ) / 1000000
              : selectedPlan?.price,
        };
        const invoiceNumber = purchase?.originalTransactionIdentifierIOS || '';
        const purchasedFrom =
          Platform.OS === 'ios' ? 'APP_STORE' : 'PLAY_STORE';
        const transactionId = purchase?.transactionId || '';
        const transactionInfo = {
          ...purchase,
        };
        const deviceName = await DeviceInfo.getDeviceName();
        const deviceId = DeviceInfo.getDeviceId();
        const version = DeviceInfo.getVersion();
        const buildNumber = DeviceInfo.getBuildNumber();
        const systemVersion = DeviceInfo.getSystemVersion();
        const brand = DeviceInfo.getBrand();
        const source = {
          deviceId,
          deviceName,
          version,
          buildNumber,
          systemVersion,
          brand,
        };
        let data = {
          itemSku,
          invoiceNumber,
          purchasedFrom,
          transactionId,
          transactionInfo,
          source,
          amount,
          duration,
        };
        createSubscription(data);
      }
    }
  };

  useEffect(() => {
    if (currentPurchase) {
      checkCurrentPurchase(currentPurchase);
    }
  }, [currentPurchase]);

  useEffect(() => {
    if (currentPurchaseError) {
      setLoading(false);
      appAlert({
        title: t(LOCALES.ERROR.LBL_ERROR),
        message: currentPurchaseError?.message,
      });
    }
  }, [currentPurchaseError]);

  const [getMyProfile, myProfileResponse, myProfileError, isMyProfileLoading] =
    useApi({
      url: URL.GET_MY_PROFILE,
      method: 'GET',
    });

  useEffect(() => {
    const init = async () => {
      if (myProfileResponse) {
        if (myProfileResponse?.statusCode === 200) {
          setLoading(false);
          appAlert({
            title: t(LOCALES.SUCCESS.LBL_SUCCESS),
            message: 'Subscription has been created successfully.',
          });
          dispatch(setUserDetails(myProfileResponse?.data));
          dispatch(
            setProfileInformation({
              name:
                myProfileResponse?.data?.firstName +
                ' ' +
                myProfileResponse?.data?.lastName,
              bio: myProfileResponse?.data?.bio,
              relationShipStatus: myProfileResponse?.data?.relationShipStatus,
              interests: myProfileResponse?.data?.interests,
              wishLists: myProfileResponse?.data?.wishLists,
              socialHandleLinks: myProfileResponse?.data?.socialHandleLinks,
            }),
          );
          await AsyncStorage.setItem(
            'userDetails',
            JSON.stringify(myProfileResponse?.data),
          );
          navigation.goBack();
        }
      }
    };
    init();
  }, [myProfileResponse]);

  useEffect(() => {
    if (myProfileError) {
      if (myProfileError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: myProfileError?.message,
        });
        setLoading(false);
      }
    }
  }, [myProfileError]);

  const [
    createSubscription,
    createSubscriptionResponse,
    createSubscriptionError,
    isCreateSubscriptionLoading,
  ] = useApi({
    url: URL.CREATE_SUBSCRIPTION,
    method: 'POST',
  });

  useEffect(() => {
    if (createSubscriptionResponse) {
      if (createSubscriptionResponse?.statusCode === 200) {
        getMyProfile();
        if (currentPurchase) {
          finishTransaction({purchase: currentPurchase, isConsumable: false});
        }
      }
    }
  }, [createSubscriptionResponse]);

  useEffect(() => {
    if (createSubscriptionError) {
      if (createSubscriptionError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: createSubscriptionError?.message,
        });
        setLoading(false);
      }
    }
  }, [createSubscriptionError]);

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
      <Header title={''} onBackPress={() => navigation.goBack()} />
      {isPlanLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView
          style={styles.container}
          scrollEnabled={!loading}
          showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <Image source={APP_LOGO_PLANS} style={styles.image} />
          </View>
          <Text
            style={{
              color: COLORS.PRIMARY_TEXT_COLOR,
              fontSize: responsiveFontSize(16),
              fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
              textAlign: 'center',
            }}>
            Upgrade to Premium plan
          </Text>
          <Text
            style={{
              color: COLORS.SECONDARY_TEXT_COLOR,
              fontSize: responsiveFontSize(14),
              fontFamily: FONTS.MONTSERRAT.REGULAR,
              textAlign: 'center',
              marginTop: 10,
            }}>
            {`Get the premium feature and unlimited\naccess of the app.`}
          </Text>
          <ScrollView
            horizontal
            scrollEnabled={!loading}
            style={{marginTop: 60, flexDirection: 'row'}}
            showsHorizontalScrollIndicator={false}>
            {plans.map((item: any, index: number) => {
              return (
                <Pressable
                  disabled={loading}
                  onPress={() => {
                    onPlanChange(item?.productId);
                  }}
                  key={index}
                  style={[
                    styles.planParent,
                    {
                      borderColor: item?.isSelected
                        ? COLORS.SECONDARY_COLOR
                        : COLORS.CHIP_INACTIVE_BORDER_COLOR,
                    },
                  ]}>
                  <View
                    style={[
                      styles.planContainer,
                      {
                        backgroundColor: item?.isSelected
                          ? COLORS.SECONDARY_COLOR
                          : COLORS.PRIMARY_CHIP_COLOR,
                      },
                    ]}>
                    <Text
                      style={{
                        color: COLORS.PRIMARY_TEXT_COLOR,
                        fontSize: responsiveFontSize(12),
                        fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                      }}>
                      {Platform.OS === 'android'
                        ? item?.name
                        : getProducName(item?.productId)}
                    </Text>
                  </View>
                  <View style={styles.prise}>
                    <Text
                      style={{
                        color: COLORS.PRIMARY_TEXT_COLOR,
                        fontSize: responsiveFontSize(16),
                        fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                      }}>
                      {Platform.OS === 'android'
                        ? item?.subscriptionOfferDetails[0]?.pricingPhases
                            ?.pricingPhaseList[0]?.formattedPrice
                        : item?.localizedPrice}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={{marginTop: 26}}>
            {FEATURE.map((item: any, index: number) => (
              <View
                style={{flexDirection: 'row', alignItems: 'center'}}
                key={index}>
                <Check />
                <Text
                  style={{
                    color: COLORS.SECONDARY_TEXT_COLOR,
                    fontSize: responsiveFontSize(14),
                    fontFamily: FONTS.MONTSERRAT.REGULAR,
                    marginBottom: 11,
                    marginLeft: 15,
                  }}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
      <View
        style={{
          marginHorizontal: 20,
          marginBottom: Platform.OS == 'android' ? 20 : 0,
        }}>
        <Button
          title="Subscribe now"
          containerStyle={{}}
          disabled={
            !plans.find((item: any) => item.isSelected) ||
            loading ||
            isCreateSubscriptionLoading ||
            isPlanLoading
          }
          loading={loading || isCreateSubscriptionLoading}
          onPress={() => {
            const subscription = plans.find((item: any) => item.isSelected);
            if (subscription) {
              setLoading(true);
              if (Platform.OS === 'ios') {
                requestSubscription({
                  sku: subscription?.productId,
                });
              } else {
                requestSubscription({
                  sku: subscription?.productId,
                  subscriptionOffers: [
                    {
                      sku: subscription?.productId,
                      offerToken:
                        subscription?.subscriptionOfferDetails[0]?.offerToken,
                    },
                  ],
                });
              }
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default PremiumPlan;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
  },
  imageContainer: {
    marginVertical: 20,
    alignSelf: 'center',
  },
  image: {
    height: 45,
    width: 45,
    resizeMode: 'contain',
  },
  planParent: {
    height: 102,
    width: 118,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 10,
  },
  planContainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 14,
    borderTopEndRadius: 14,
  },
  prise: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
