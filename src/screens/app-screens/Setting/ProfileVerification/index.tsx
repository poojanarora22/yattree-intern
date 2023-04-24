import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../../../components/Header';
import useTheme from '../../../../theme/hooks/useTheme';
import LOCALES from '../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import {ProfileVerificationScreenProps} from '../../../../types/navigation/appTypes';
import {PROFILE_VERIFICATION, USER_PROFILE} from '../../../../assets/images';
import {DELETE_ICON, DOCUMENT_UPLOAD} from '../../../../assets/icons/svg';
import Button from '../../../../components/Button';
import {useApi} from '../../../../hooks/useApi';
import {URL} from '../../../../constants/URLS';
import {setFileOnServer} from '../../../../utilities/uploadDocument';
import {appAlert} from '../../../../components/appAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setUserDetails} from '../../../../store/slice/authSlice';
import {useAppDispatch, useAppSelector} from '../../../../store';
import {setProfileInformation} from '../../../../store/slice/profileSlice';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import ImagePickerModal from '../../../auth-screens/Profile/UploadPhoto/ImagePickerModal';
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import Check from '../../../../assets/icons/svg/Check';
import ViewPhotos from '../components/CustomModal/ViewPhotos';

const ProfileVerification = ({navigation}: ProfileVerificationScreenProps) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {userDetails} = useAppSelector(state => state.auth);
  const [isDocumentUploaded, setIsDocumentUploaded] = useState(false);
  const [file, setFile] = useState<any>(null);
  const ImagePickerModalRef = useRef<BottomSheetModal>(null);
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  const [isDocumentUpdated, setIsDocumentUpdated] = useState(false);
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
  }, [isDocumentUploaded, COLORS, FONTS, file]);

  const [getUploadUrl, uploadUrlResponse, uploadUrlError, isUploadUrlLoading] =
    useApi({
      url: URL.GET_UPLOAD_URL,
      method: 'POST',
    });

  useEffect(() => {
    const init = async () => {
      try {
        await setFileOnServer(uploadUrlResponse?.data?.url, file?.uri || '');
        let formdata = new FormData();
        if (uploadUrlResponse?.data?.fileId) {
          formdata.append('KYCDocumentId', uploadUrlResponse?.data?.fileId);
        }
        updateProfile(formdata);
        setIsLoadingDoc(false);
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
          message: t(LOCALES.SUCCESS.LBL_ID_PROOF_ADDED_SUCCESS),
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
      if (userDetails?.kycDocument) {
        setFile({
          name: userDetails?.kycDocument?.fileName,
        });
        setIsDocumentUploaded(true);
      }
    }
  }, [userDetails]);

  const handleImagePickerModalPress = useCallback(() => {
    ImagePickerModalRef?.current?.present();
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
        title={t(LOCALES.SETTING.LBL_PROFILE_VERIFICATION)}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView style={styles.container}>
        <Image
          source={
            userDetails?.avatar
              ? {uri: userDetails?.avatar?.mediaUrl}
              : USER_PROFILE
          }
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
            {t(LOCALES.PROFILE.GREETING_TEXT)} {userDetails?.firstName}!
          </Text>
          <Text
            style={[
              styles.label,
              {
                marginTop: 5,
                color: COLORS.PROFILE_TEXT_COLOR,
                fontFamily: FONTS.MONTSERRAT.REGULAR,
              },
            ]}>
            {t(LOCALES.PROFILE.DESCRIPTION_5)}
          </Text>
        </View>

        <View style={styles.docParent}>
          <Pressable
            disabled={
              isUploadUrlLoading || isLoadingDoc || isUpdateProfileLoading
            }
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
                style={styles.delete}
                onPress={onDeleteDocuments}
                disabled={
                  isUploadUrlLoading || isLoadingDoc || isUpdateProfileLoading
                }>
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
      </ScrollView>
      <View style={{marginHorizontal: 20}}>
        <Button
          title={t(LOCALES.SETTING.LBL_SUBMIT)}
          containerStyle={{
            marginBottom: Platform.OS === 'android' ? 20 : 0,
          }}
          onPress={() => {
            const body = {
              fileName: file?.name,
              fileModule: 'USER_KYC_DOC',
              mimeType: file?.type,
            };
            getUploadUrl(body);
            setIsLoadingDoc(true);
          }}
          disabled={
            !file ||
            isUploadUrlLoading ||
            isLoadingDoc ||
            isUpdateProfileLoading ||
            !isDocumentUpdated ||
            showModal
          }
          loading={isUploadUrlLoading || isLoadingDoc || isUpdateProfileLoading}
        />
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
          setIsDocumentUpdated(true);
        }}
        onRetake={() => {
          setShowModal(false);
          setIsDocumentUploaded(false);
          setIsDocumentUpdated(false);
          setFile(null);
        }}
        closeModal={() => {
          setShowModal(false);
          setIsDocumentUploaded(false);
          setIsDocumentUpdated(false);
          setFile(null);
        }}
      />
    </SafeAreaView>
  );
};

export default ProfileVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  labelContainer: {marginTop: 10, marginHorizontal: 20},
  label: {
    textAlign: 'center',
    fontSize: responsiveFontSize(14),
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 40,
  },
  docParent: {
    marginTop: 30,
    width: '100%',
    height: 67,
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
    marginTop: 20,
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
