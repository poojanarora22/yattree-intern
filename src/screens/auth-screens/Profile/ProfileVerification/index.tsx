import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import WrapperScreen from '../WrapperScreen';
import {PROFILE_VERIFICATION, USER_PROFILE} from '../../../../assets/images';
import useTheme from '../../../../theme/hooks/useTheme';
import LOCALES from '../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {ProfileVerificationScreenProps} from '../../../../types/navigation/authTypes';
import {DELETE_ICON, DOCUMENT_UPLOAD} from '../../../../assets/icons/svg';
import {useAppDispatch, useAppSelector} from '../../../../store';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import {useApi} from '../../../../hooks/useApi';
import {URL} from '../../../../constants/URLS';
import {appAlert} from '../../../../components/appAlert';
import {
  getFileFromServer,
  setFileOnServer,
} from '../../../../utilities/uploadDocument';
import {setProfileSetupUserData} from '../../../../store/slice/authSlice';
import ImagePickerModal from '../../../auth-screens/Profile/UploadPhoto/ImagePickerModal';
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import Check from '../../../../assets/icons/svg/Check';
import ViewPhotos from '../../../app-screens/Setting/components/CustomModal/ViewPhotos';

const ProfileVerification = ({navigation}: ProfileVerificationScreenProps) => {
  const {COLORS, FONTS} = useTheme();
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const [isDocumentUploaded, setIsDocumentUploaded] = useState(false);
  const [file, setFile] = useState<any>(null);
  const {profilePicture} = useAppSelector(state => state.profile);
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  const ImagePickerModalRef = useRef<BottomSheetModal>(null);
  const {profileSetupUserData} = useAppSelector(state => state.auth);
  const {userDetails} = useAppSelector(state => state.auth);
  const [showModal, setShowModal] = useState(false);

  const instructions = [
    'Make sure the photo was taken in good light in order to get it right.',
    'Details on Id card are visible',
    'Ignore glare and reflection on ID',
  ];

  const pickImageFromGallery = useCallback(async () => {
    ImagePickerModalRef?.current?.close();
    const result: ImagePickerResponse = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.2,
    });
    if (result && result?.assets) {
      setFile({
        name: result?.assets[0]?.fileName,
        uri: result?.assets[0]?.uri,
        type: result?.assets[0]?.type,
      });
      setShowModal(true);
    }
  }, []);

  const pickImageFromCamera = useCallback(async () => {
    ImagePickerModalRef?.current?.close();
    const result: ImagePickerResponse = await launchCamera({
      mediaType: 'photo',
      quality: 0.2,
    });
    if (result && result?.assets) {
      setFile({
        name: result?.assets[0]?.fileName,
        uri: result?.assets[0]?.uri,
        type: result?.assets[0]?.type,
      });
      setShowModal(true);
    }
  }, []);

  const onDeleteDocuments = useCallback(() => {
    setFile(null);
    setIsDocumentUploaded(false);
  }, []);

  const getUploadDocumentsView = useCallback(() => {
    if (isDocumentUploaded) {
      return (
        <Text
          numberOfLines={2}
          style={{
            fontSize: responsiveFontSize(14),
            fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
            color: COLORS.PRIMARY_TEXT_COLOR,
          }}>
          {file?.name}
        </Text>
      );
    } else {
      return (
        <>
          <Text
            style={{
              fontSize: responsiveFontSize(14),
              fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
              color: COLORS.PRIMARY_TEXT_COLOR,
            }}>
            {t(LOCALES.PROFILE.DESCRIPTION_6)}
          </Text>
          <Text
            style={{
              fontSize: responsiveFontSize(12),
              marginTop: 7,
              fontFamily: FONTS.MONTSERRAT.REGULAR,
              color: COLORS.PROFILE_TEXT_COLOR,
            }}>
            {t(LOCALES.PROFILE.DESCRIPTION_7)}
          </Text>
        </>
      );
    }
  }, [isDocumentUploaded, COLORS, FONTS]);

  const [getUploadUrl, uploadUrlResponse, uploadUrlError, isUploadUrlLoading] =
    useApi({
      url: URL.GET_UPLOAD_URL,
      method: 'POST',
    });

  useEffect(() => {
    const init = async () => {
      try {
        await setFileOnServer(uploadUrlResponse?.data?.url, file?.uri || '');
        const result = await getFileFromServer(uploadUrlResponse?.data?.url);
        // console.log('Upload File url.............', result.url);
        if (result.url) {
          dispatch(
            setProfileSetupUserData({
              ...profileSetupUserData,
              KYCDocumentId: uploadUrlResponse?.data?.fileId,
            }),
          );
          setIsLoadingDoc(false);
          navigation.navigate('Bio');
        }
      } catch (error) {
        console.log('Error while uploading kyc Document....', error);
        setIsLoadingDoc(false);
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
        setIsLoadingDoc(false);
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: uploadUrlError?.message,
        });
      }
    }
  }, [uploadUrlError]);

  const onContinue = useCallback(() => {
    const body = {
      fileName: file?.name,
      fileModule: 'USER_KYC_DOC',
      mimeType: file?.type,
    };
    getUploadUrl(body);
    setIsLoadingDoc(true);
  }, [file]);

  const handleImagePickerModalPress = useCallback(() => {
    ImagePickerModalRef?.current?.present();
  }, []);

  return (
    <WrapperScreen
      onContinue={onContinue}
      onSkip={() => navigation.navigate('Bio')}
      disabled={!file || isUploadUrlLoading || isLoadingDoc || showModal}
      loading={isUploadUrlLoading || isLoadingDoc}>
      <View style={styles.container}>
        <Image
          source={profilePicture ? {uri: profilePicture} : USER_PROFILE}
          style={styles.image}
        />
        <View style={styles.labelContainer}>
          <Text
            style={[
              styles.label,
              {
                color: COLORS.PRIMARY_TEXT_COLOR,
                fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
              },
            ]}>
            {t(LOCALES.PROFILE.GREETING_TEXT)} {userDetails?.firstName}{' '}
            {userDetails?.lastName}!
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
            {t(LOCALES.PROFILE.DESCRIPTION_5)}
          </Text>
        </View>

        <View style={styles.docParent}>
          <Pressable
            disabled={isUploadUrlLoading || isLoadingDoc}
            onPress={handleImagePickerModalPress}
            style={[
              styles.docContainer,
              {
                backgroundColor: COLORS.INPUT_BACKGROUND_COLOR,
                borderColor: COLORS.INPUT_INACTIVE_BORDER_COLOR,
              },
            ]}>
            <View
              style={[
                styles.uploadDocuments,
                {backgroundColor: COLORS.PRIMARY_COLOR},
              ]}>
              <DOCUMENT_UPLOAD />
            </View>
            <View style={{flex: 1}}>{getUploadDocumentsView()}</View>
            {isDocumentUploaded && (
              <Pressable
                disabled={isUploadUrlLoading || isLoadingDoc}
                style={styles.delete}
                onPress={onDeleteDocuments}>
                <DELETE_ICON />
              </Pressable>
            )}
          </Pressable>
        </View>

        <View style={styles.instructionsParent}>
          <View
            style={[
              styles.instructionsImageContainer,
              {
                borderColor: COLORS.CHIP_INACTIVE_BORDER_COLOR,
                backgroundColor: COLORS.PRIMARY_CHIP_COLOR,
              },
            ]}>
            <Image
              source={PROFILE_VERIFICATION}
              style={styles.instructionsImage}
            />
          </View>
        </View>

        <View style={styles.instructionsContainer}>
          {instructions.map((item: string, index: number) => (
            <View style={{flexDirection: 'row', marginBottom: 12}} key={index}>
              <View
                style={[styles.right, {borderColor: COLORS.SECONDARY_COLOR}]}>
                <Check height={10} width={10} />
              </View>
              <Text
                style={{
                  flex: 1,
                  color: COLORS.PROFILE_TEXT_COLOR,
                  fontFamily: FONTS.MONTSERRAT.REGULAR,
                  fontSize: responsiveFontSize(14),
                  marginLeft: 10,
                }}>
                {item}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <ImagePickerModal
        isProfileVerification={true}
        bottomSheetModalRef={ImagePickerModalRef}
        onCamera={pickImageFromCamera}
        onPhotoLibrary={pickImageFromGallery}
      />
      <ViewPhotos
        imageUrl={file?.uri}
        showModal={showModal}
        onOkay={() => {
          setShowModal(false);
          setIsDocumentUploaded(true);
        }}
        onRetake={() => {
          setShowModal(false);
          setIsDocumentUploaded(false);
          setFile(null);
        }}
        closeModal={() => {
          setShowModal(false);
          setIsDocumentUploaded(false);
          setFile(null);
        }}
      />
    </WrapperScreen>
  );
};

export default ProfileVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  labelContainer: {marginTop: 20},
  label: {
    textAlign: 'center',
    fontSize: responsiveFontSize(14),
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 20,
  },
  docParent: {
    marginTop: 30,
    width: '100%',
  },
  docContainer: {
    marginHorizontal: 20,
    height: 68,
    borderRadius: 13,
    borderStyle: 'dashed',
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadDocuments: {
    margin: 10,
    height: 47,
    width: 47,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  delete: {
    margin: 22,
  },
  right: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionsContainer: {
    width: '100%',
    marginVertical: 20,
    marginHorizontal: 20,
  },
  instructionsParent: {
    width: '100%',
    marginTop: 25,
  },
  instructionsImageContainer: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  instructionsImage: {
    height: 130,
    width: 130,
    alignSelf: 'center',
  },
});
