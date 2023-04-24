import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import WrapperScreen from '../WrapperScreen';
import {
  ImagePickerResponse,
  launchImageLibrary,
  Asset,
  launchCamera,
} from 'react-native-image-picker';
import useTheme from '../../../../theme/hooks/useTheme';
import LOCALES from '../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {UploadPhotoScreenProps} from '../../../../types/navigation/authTypes';
import {useAppDispatch, useAppSelector} from '../../../../store';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import Camera from '../../../../assets/icons/svg/Camera';
import {useApi} from '../../../../hooks/useApi';
import {URL} from '../../../../constants/URLS';
import {
  getFileFromServer,
  setFileOnServer,
} from '../../../../utilities/uploadDocument';
import {appAlert} from '../../../../components/appAlert';
import {setProfilePicture} from '../../../../store/slice/profileSlice';
import {setProfileSetupUserData} from '../../../../store/slice/authSlice';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import ImagePickerModal from './ImagePickerModal';

const UploadPhoto = ({navigation}: UploadPhotoScreenProps) => {
  const {COLORS, FONTS} = useTheme();
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const ImagePickerModalRef = useRef<BottomSheetModal>(null);
  const [image, setImage] = useState<Asset | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const {profileSetupUserData} = useAppSelector(state => state.auth);

  const pickImageFromCamera = useCallback(async () => {
    ImagePickerModalRef?.current?.close();
    const result: ImagePickerResponse = await launchCamera({
      mediaType: 'photo',
      quality: 0.2,
    });
    if (result && result?.assets) {
      setImage(result?.assets[0]);
    }
  }, []);

  const pickImageFromGallery = useCallback(async () => {
    ImagePickerModalRef?.current?.close();
    const result: ImagePickerResponse = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.2,
    });
    if (result && result?.assets) {
      setImage(result?.assets[0]);
    }
  }, []);

  const [getUploadUrl, uploadUrlResponse, uploadUrlError, isUploadUrlLoading] =
    useApi({
      url: URL.GET_UPLOAD_URL,
      method: 'POST',
    });

  useEffect(() => {
    const init = async () => {
      try {
        await setFileOnServer(uploadUrlResponse?.data?.url, image?.uri || '');
        const result = await getFileFromServer(uploadUrlResponse?.data?.url);
        dispatch(setProfilePicture(result.url));
        dispatch(
          setProfileSetupUserData({
            ...profileSetupUserData,
            avatarId: uploadUrlResponse?.data?.fileId,
          }),
        );
        setIsLoadingImage(false);
        navigation.navigate('ProfileVerification');
      } catch (error) {
        console.log('Error while uploading profile picture...', error);
        setIsLoadingImage(false);
      }
    };
    if (uploadUrlResponse) {
      if (uploadUrlResponse?.statusCode === 200) {
        init();
      }
    }
  }, [uploadUrlResponse]);

  useEffect(() => {
    if (uploadUrlError) {
      if (uploadUrlError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: uploadUrlError?.message,
        });
      }
    }
  }, [uploadUrlError]);

  const onContinue = useCallback(() => {
    const body = {
      fileName: image?.fileName,
      fileModule: 'USER_AVATAR',
      mimeType: image?.type,
    };
    getUploadUrl(body);
    setIsLoadingImage(true);
  }, [image]);

  const handleImagePickerModalPress = useCallback(() => {
    ImagePickerModalRef?.current?.present();
  }, []);

  return (
    <WrapperScreen
      disabled={!image || isUploadUrlLoading || isLoadingImage}
      onContinue={onContinue}
      onSkip={() => navigation.navigate('ProfileVerification')}
      loading={isUploadUrlLoading || isLoadingImage}>
      <View style={styles.container}>
        <Pressable
          disabled={isUploadUrlLoading || isLoadingImage}
          onPress={handleImagePickerModalPress}
          style={[
            styles.imageContainer,
            {
              backgroundColor: COLORS.INPUT_BACKGROUND_COLOR,
              borderColor: COLORS.INPUT_INACTIVE_BORDER_COLOR,
            },
          ]}>
          {image ? (
            <Image source={{uri: image.uri}} style={styles.image} />
          ) : null}
          <Pressable
            disabled={isUploadUrlLoading || isLoadingImage}
            onPress={handleImagePickerModalPress}
            style={[styles.icon, {backgroundColor: COLORS.SECONDARY_COLOR}]}>
            <Camera color={COLORS.TERTIARY_COLOR} />
          </Pressable>
        </Pressable>
        <View style={styles.labelContainer}>
          <Text
            style={[
              styles.label,
              {
                color: COLORS.PRIMARY_TEXT_COLOR,
                fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
              },
            ]}>
            {t(LOCALES.PROFILE.DESCRIPTION_3)}
          </Text>
          <Text
            style={[
              styles.label,
              {
                marginTop: 8,
                color: COLORS.PROFILE_TEXT_COLOR,
                fontFamily: FONTS.MONTSERRAT.REGULAR,
              },
            ]}>
            {t(LOCALES.PROFILE.DESCRIPTION_4)}
          </Text>
        </View>
      </View>
      <ImagePickerModal
        bottomSheetModalRef={ImagePickerModalRef}
        onCamera={pickImageFromCamera}
        onPhotoLibrary={pickImageFromGallery}
      />
    </WrapperScreen>
  );
};

export default UploadPhoto;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContainer: {marginTop: 30},
  label: {
    textAlign: 'center',
    fontSize: responsiveFontSize(14),
  },
  imageContainer: {
    alignSelf: 'center',
    justifyContent: 'flex-end',
    borderWidth: 1,
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  image: {
    height: '100%',
    width: '100%',
    borderRadius: 50,
  },
  icon: {
    position: 'absolute',
    height: 39,
    width: 39,
    borderRadius: 20,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
