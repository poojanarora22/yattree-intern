import {
  Image,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import useTheme from '../../../../../../theme/hooks/useTheme';
import {useTranslation} from 'react-i18next';
import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import {Rating} from 'react-native-ratings';
import {BlurView} from '@react-native-community/blur';
import LOCALES from '../../../../../../localization/constants';
import {responsiveFontSize} from '../../../../../../theme/responsiveFontSize';
import {HOME_PROFILE_3} from '../../../../../../assets/images';
import Button from '../../../../../../components/Button';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type RateReviewModalType = {
  bottomSheetModalRef: any;
};

const RateReviewModal = ({bottomSheetModalRef}: RateReviewModalType) => {
  const {COLORS, FONTS} = useTheme();
  const {t} = useTranslation();
  const {bottom} = useSafeAreaInsets();
  const [isFocused, setIsFocused] = useState(false);
  const initialSnapPoints = useMemo(() => [150, 'CONTENT_HEIGHT'], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const renderBackdrop = useCallback(
    () => (
      <Pressable
        onPress={() => bottomSheetModalRef?.current?.close()}
        style={styles.absolute}>
        <BlurView
          style={styles.absolute}
          blurType="dark"
          blurAmount={10}
          reducedTransparencyFallbackColor="white"
        />
      </Pressable>
    ),
    [],
  );

  const handleComponent = useCallback(() => {
    return (
      <View style={styles.handleContainer}>
        <View
          style={[styles.handle, {backgroundColor: COLORS.TERTIARY_COLOR}]}
        />
      </View>
    );
  }, []);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      keyboardBehavior="fillParent"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      snapPoints={animatedSnapPoints}
      backgroundStyle={{backgroundColor: COLORS.MODAL_BACKGROUND_COLOR}}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      backdropComponent={renderBackdrop}
      handleComponent={handleComponent}
      enablePanDownToClose={true}>
      <BottomSheetView
        style={[styles.contentContainerStyle]}
        onLayout={handleContentLayout}>
        <Pressable
          onPress={() => Keyboard.dismiss()}
          style={{
            paddingBottom: Platform.OS === 'ios' ? bottom : 20,
          }}>
          <Text
            style={{
              color: COLORS.PRIMARY_TEXT_COLOR,
              fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
              fontSize: responsiveFontSize(14),
              textAlign: 'center',
            }}>
            {t(LOCALES.HOME.RATE_REVIEW)}
          </Text>
          <Image source={HOME_PROFILE_3} style={styles.image} />
          <View>
            <Text
              style={{
                color: COLORS.PRIMARY_TEXT_COLOR,
                fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                fontSize: responsiveFontSize(14),
                textAlign: 'center',
                marginTop: 12,
              }}>
              Helena Harrison
            </Text>
            <Text
              style={{
                color: COLORS.SECONDARY_TEXT_COLOR,
                fontFamily: FONTS.MONTSERRAT.REGULAR,
                fontSize: responsiveFontSize(12),
                textAlign: 'center',
                marginTop: 6,
              }}>
              @helena.harrison
            </Text>
            <Rating
              type="custom"
              ratingCount={5}
              imageSize={30}
              ratingColor={COLORS.ACTIVE_RETINGS_COLOR}
              ratingBackgroundColor={COLORS.INACTIVE_RETINGS_COLOR}
              tintColor={COLORS.MODAL_BACKGROUND_COLOR}
              onFinishRating={() => {}}
              style={{paddingVertical: 15}}
            />
            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.input,
                  {
                    borderColor: isFocused
                      ? COLORS.INPUT_ACTIVE_BORDER_COLOR
                      : COLORS.INPUT_INACTIVE_BORDER_COLOR,
                  },
                ]}>
                <BottomSheetTextInput
                  placeholder={t(LOCALES.HOME.PARTICIPANTS_PLACEHOLDER)}
                  placeholderTextColor={COLORS.INPUT_PLACEHOLDER_COLOR}
                  textAlignVertical="top"
                  style={{
                    fontSize: responsiveFontSize(14),
                    color: COLORS.PRIMARY_TEXT_COLOR,
                    fontFamily: FONTS.MONTSERRAT.REGULAR,
                    height: 130,
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  multiline={true}
                />
              </View>
              <Button
                title={t(LOCALES.HOME.SAVE_CONTINUE)}
                containerStyle={{marginTop: 30}}
              />
            </View>
          </View>
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default RateReviewModal;

const styles = StyleSheet.create({
  contentContainerStyle: {
    flex: 1,
  },
  handle: {
    height: 3,
    width: 60,
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 15,
  },
  handleContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 0,
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 30,
  },
  inputContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 13,
  },
});
