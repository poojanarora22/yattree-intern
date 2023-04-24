import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Linking,
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
import {PersonalInformationScreenProps} from '../../../../types/navigation/appTypes';
import {USER_PROFILE} from '../../../../assets/images';
import Camera from '../../../../assets/icons/svg/Camera';
import {responsiveFontSize} from '../../../../theme/responsiveFontSize';
import TextField from '../../../../components/TextField';
import DropdownArrowFill from '../../../../assets/icons/svg/DropdownArrowFill';
import Check from '../../../../assets/icons/svg/Check';
import Wrong from '../../../../assets/icons/svg/Wrong';
import CountryPickerModal from '../../../auth-screens/SignUp/components/CountryPickerModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import Picker from '../../../../components/Picker';
import Button from '../../../../components/Button';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import CustomModal from '../components/CustomModal';
import {useAppDispatch, useAppSelector} from '../../../../store';
import {
  Asset,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import ImagePickerModal from '../../../auth-screens/Profile/UploadPhoto/ImagePickerModal';
import {appAlert} from '../../../../components/appAlert';
import {useApi} from '../../../../hooks/useApi';
import {URL} from '../../../../constants/URLS';
import {setFileOnServer} from '../../../../utilities/uploadDocument';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setUserDetails} from '../../../../store/slice/authSlice';
import {useDebounce} from '../../../../hooks/useDebounce';
import {REGEX} from '../../../../constants';
import {setProfileInformation} from '../../../../store/slice/profileSlice';
import {getParamsFromURL} from '../../../../utilities/functions';

type modalTypes = 'GENDER' | 'RELATIONSHIP_STATUS';

const PersonalInformation = ({navigation}: PersonalInformationScreenProps) => {
  const {COLORS, BAR_STYLE, FONTS} = useTheme();
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {userDetails} = useAppSelector(state => state.auth);
  const [countryCode, setCountryCode] = useState('+91');
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const ImagePickerModalRef = useRef<BottomSheetModal>(null);
  const [modalType, setModalType] = useState<modalTypes | null>(null);
  const CustomModalRef = useRef<BottomSheetModal>(null);
  const [image, setImage] = useState<Asset | null>(null);
  const [userImage, setUserImage] = useState<any>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [nationality, setNationality] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [bio, setBio] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState('');
  const [openCalender, setOpenCalender] = useState(false);
  const [request, setRequest] = useState<any>({});
  const [customModalResult, setCustomModalResult] = useState<any>(null);
  const [isCountrySelected, setIsCountrySelected] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isUserNameSearching, setIsUserNameSearching] = useState(false);
  const [isUserNameAvailable, setIsUserNameAvailable] = useState(false);

  const debouncedUserName = useDebounce(userName, 500);

  const [
    getUserNameAvailable,
    userNameAvailableResponse,
    userNameAvailableError,
  ] = useApi({
    url: URL.USERNAME_AVAILABLE + userName,
    method: 'GET',
  });

  useEffect(() => {
    if (userName.length >= 2 && debouncedUserName) {
      if (REGEX.USERNAME.test(userName)) {
        setIsUserNameSearching(true);
        getUserNameAvailable();
      } else {
        setIsUserNameSearching(false);
        setIsUserNameAvailable(false);
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: t(LOCALES.ERROR.LBL_USERNAME_ERROR),
        });
      }
    } else {
      setIsUserNameSearching(false);
    }
  }, [debouncedUserName]);

  useEffect(() => {
    if (userNameAvailableResponse) {
      if (userNameAvailableResponse?.statusCode === 200) {
        setIsUserNameSearching(false);
        setIsUserNameAvailable(
          userNameAvailableResponse?.data?.userNameAvailable,
        );
      }
    }
  }, [userNameAvailableResponse]);

  useEffect(() => {
    if (userNameAvailableError) {
      if (userNameAvailableError?.statusCode === 400) {
        setIsUserNameSearching(false);
        setIsUserNameAvailable(false);
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: userNameAvailableError?.message,
        });
      }
    }
  }, [userNameAvailableError]);

  const titleStyle = useMemo(
    () => [
      [
        styles.title,
        {
          color: COLORS.SECONDARY_TEXT_COLOR,
          fontFamily: FONTS.MONTSERRAT.REGULAR,
        },
      ],
    ],
    [],
  );
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const onCountrySelect = useCallback(
    (item: any) => {
      // setCountryCode(item.phoneCode);
      setNationality(item?.name);
      setIsCountrySelected(true);
      bottomSheetModalRef.current?.close();
    },
    [request],
  );

  useEffect(() => {
    if (isCountrySelected) {
      const obj = {...request};
      // obj.phoneCode = countryCode?.replace('+', '');
      obj.nationality = nationality;
      setRequest(obj);
    }
  }, [countryCode, nationality, isCountrySelected]);

  const handleCustomModalPress = useCallback(() => {
    CustomModalRef.current?.present();
  }, []);

  const leftIcon = useCallback(() => {
    return (
      <Pressable
        style={styles.leftIconContainer}
        // onPress={handlePresentModalPress}
      >
        <Text
          style={{
            color: COLORS.PRIMARY_TEXT_COLOR,
            fontSize: responsiveFontSize(16),
            fontFamily: FONTS.MONTSERRAT.REGULAR,
          }}>
          {countryCode.includes('+') ? countryCode : '+' + countryCode}
        </Text>
        <View
          style={[
            styles.leftIcon,
            {borderRightColor: COLORS.SOCIAL_LOGIN_BORDER_COLOR},
          ]}>
          <DropdownArrowFill />
        </View>
      </Pressable>
    );
  }, [countryCode]);

  const [sendEmail, sendEmailResponse, sendEmailError, isSendEmailLoading] =
    useApi({
      url: URL.SEND_EMAIL,
      method: 'POST',
    });
  const [
    verifyEmail,
    verifyEmailResponse,
    verifyEmailError,
    isVerifyEmailLoading,
  ] = useApi({
    url: URL.VERIFY_EMAIL,
    method: 'GET',
    isCustomURL: true,
  });

  useEffect(() => {
    if (sendEmailResponse) {
      if (sendEmailResponse?.statusCode === 200) {
        appAlert({
          title: t(LOCALES.SUCCESS.LBL_SUCCESS),
          message: t(LOCALES.SUCCESS.LBL_EMAIL_VERIFICATION_SEND_SUCCESS),
        });
      }
    }
  }, [sendEmailResponse]);

  useEffect(() => {
    if (sendEmailError) {
      if (sendEmailError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: sendEmailError?.message,
        });
      }
    }
  }, [sendEmailError]);

  useEffect(() => {
    if (verifyEmailResponse) {
      if (verifyEmailResponse?.statusCode === 200) {
        appAlert({
          title: t(LOCALES.SUCCESS.LBL_SUCCESS),
          message: t(LOCALES.SUCCESS.LBL_EMAIL_VERIFICATION_SUCCESS),
        });
        const result = {
          ...userDetails,
          isEmailVerified: true,
        };
        dispatch(setUserDetails(result));
        AsyncStorage.setItem('userDetails', JSON.stringify(result));
      }
    }
  }, [verifyEmailResponse]);

  useEffect(() => {
    if (verifyEmailError) {
      if (verifyEmailError?.statusCode === 400) {
        appAlert({
          title: t(LOCALES.ERROR.LBL_ERROR),
          message: verifyEmailError?.message,
        });
      }
    }
  }, [verifyEmailError]);

  const handleDynamicLink = (link: any) => {
    const params = getParamsFromURL(link?.url);
    if (params?.email && params?.token) {
      verifyEmail(
        null,
        `${URL.VERIFY_EMAIL}email=${params?.email}&token=${params?.token}`,
      );
    }
  };

  useEffect(() => {
    Linking.addEventListener('url', handleDynamicLink);
    return () => Linking.removeAllListeners('url');
  }, []);

  const rightIcon = useCallback(
    (name: 'phoneNumber' | 'email', isVerified: boolean) => {
      if (isSendEmailLoading && name === 'email') {
        return <ActivityIndicator />;
      } else {
        return (
          <Text
            onPress={() => {
              if (
                isUpdateProfileLoading ||
                isUploadUrlLoading ||
                isLoadingImage ||
                isVerifyEmailLoading ||
                isSendEmailLoading
              ) {
              } else {
                if (name === 'email' && !isVerified) {
                  const body = {
                    email: userDetails?.email,
                    userId: userDetails?.id,
                  };
                  sendEmail(body);
                }
              }
            }}
            style={{
              fontSize: responsiveFontSize(14),
              fontFamily: FONTS.MONTSERRAT.REGULAR,
              color: COLORS.SECONDARY_COLOR,
            }}>
            {!isVerified
              ? t(LOCALES.SETTING.LBL_VERIFY)
              : t(LOCALES.SETTING.LBL_VERIFIED)}
          </Text>
        );
      }
    },
    [isSendEmailLoading],
  );

  const getGender = (name: string) => {
    if (name === 'MALE') {
      return t(LOCALES.CREATE_POST.LBL_MALE);
    } else if (name === 'FEMALE') {
      return t(LOCALES.CREATE_POST.LBL_FEMALE);
    } else if (name === 'OTHER') {
      return t(LOCALES.CREATE_POST.LBL_OTHER);
    } else {
      return '';
    }
  };

  const getRelationShipStatus = (name: string) => {
    if (name === 'SINGLE') {
      return t(LOCALES.CREATE_POST.LBL_SINGLE);
    } else if (name === 'COMMITTED') {
      return t(LOCALES.CREATE_POST.LBL_COMMITTED);
    } else {
      return '';
    }
  };

  const handleImagePickerModalPress = useCallback(() => {
    ImagePickerModalRef?.current?.present();
  }, []);

  const pickImageFromCamera = useCallback(async () => {
    ImagePickerModalRef?.current?.close();
    const result: ImagePickerResponse = await launchCamera({
      mediaType: 'photo',
      quality: 0.2,
    });
    if (result && result?.assets) {
      setImage(result?.assets[0]);
      setUserImage(result?.assets[0]?.uri);
      const obj = {...request};
      obj.imageUrl = result?.assets[0]?.uri;
      setRequest(obj);
    }
  }, [request]);

  const pickImageFromGallery = useCallback(async () => {
    ImagePickerModalRef?.current?.close();
    const result: ImagePickerResponse = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.2,
    });
    if (result && result?.assets) {
      setImage(result?.assets[0]);
      setUserImage(result?.assets[0]?.uri);
      const obj = {...request};
      obj.imageUrl = result?.assets[0]?.uri;
      setRequest(obj);
    }
  }, [request]);

  useEffect(() => {
    setUserImage(userDetails?.avatar?.mediaUrl || null);
    setFirstName(userDetails?.firstName || '');
    setLastName(userDetails?.lastName || '');
    setUserName(userDetails?.userName || '');
    setEmail(userDetails?.email || '');
    setPhoneNumber(userDetails?.phoneNumber || '');
    setCountryCode('+' + userDetails?.phoneCode);
    setGender(getGender(userDetails?.gender) || '');
    setNationality(userDetails?.nationality || '');
    setBirthDate(userDetails?.dateOfBirth || '');
    setBio(userDetails?.bio || '');
    setRelationshipStatus(
      getRelationShipStatus(userDetails?.relationShipStatus) || '',
    );
  }, [userDetails]);

  useEffect(() => {
    if (customModalResult) {
      if (customModalResult?.GENDER?.title) {
        const obj = {...request};
        obj.gender = customModalResult?.GENDER?.value;
        setGender(customModalResult?.GENDER?.title);
        setRequest(obj);
      }
      if (customModalResult?.RELATIONSHIP_STATUS?.title) {
        const obj = {...request};
        obj.relationShipStatus = customModalResult?.RELATIONSHIP_STATUS?.value;
        setRelationshipStatus(customModalResult?.RELATIONSHIP_STATUS?.title);
        setRequest(obj);
      }
    }
  }, [customModalResult]);

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
          message: t(LOCALES.SUCCESS.LBL_PROFILE_UPDATE_SUCCESS),
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

  const [getUploadUrl, uploadUrlResponse, uploadUrlError, isUploadUrlLoading] =
    useApi({
      url: URL.GET_UPLOAD_URL,
      method: 'POST',
    });

  useEffect(() => {
    const init = async () => {
      try {
        await setFileOnServer(uploadUrlResponse?.data?.url, image?.uri || '');
        onUpdateProfile(uploadUrlResponse?.data?.fileId);
        setIsLoadingImage(false);
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

  const onUpdateProfile = (avatarId: string | null) => {
    let formdata = new FormData();

    if (avatarId) {
      formdata.append('avatarId', avatarId);
    }
    if (request?.firstName) {
      formdata.append('firstName', request?.firstName);
    }
    if (request?.lastName) {
      formdata.append('lastName', request?.lastName);
    }
    if (request?.userName && isUserNameAvailable) {
      formdata.append('userName', request?.userName);
    }
    // if (request?.email) {
    //   formdata.append('email', request?.email);
    // }
    // if (request?.phoneNumber) {
    //   formdata.append('phoneNumber', request?.phoneNumber);
    // }
    // if (request?.phoneCode) {
    //   formdata.append('phoneCode', request?.phoneCode);
    // }
    if (request?.gender) {
      formdata.append('gender', request?.gender);
    }
    if (request?.nationality) {
      formdata.append('nationality', request?.nationality);
    }
    if (request?.dateOfBirth) {
      formdata.append('dateOfBirth', request?.dateOfBirth);
    }
    formdata.append('bio', bio.trim());

    // if (request?.relationShipStatus) {
    //   formdata.append('relationShipStatus', request?.relationShipStatus);
    // }
    updateProfile(formdata);
  };

  const userNameRightIcon = useCallback(() => {
    if (isUserNameSearching) {
      return <ActivityIndicator />;
    } else if (request?.userName && isUserNameAvailable) {
      return <Check color={COLORS.COMPLETE_CHECK_ICON_COLOR} />;
    } else if (request?.userName && !isUserNameAvailable) {
      return <Wrong />;
    } else return null;
  }, [isUserNameSearching, isUserNameAvailable, userName]);

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
        title={t(LOCALES.SETTING.LBL_EDIT_PERSONAL_INFORMATION)}
        onBackPress={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled>
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled={
            !(
              isUpdateProfileLoading ||
              isUploadUrlLoading ||
              isLoadingImage ||
              isVerifyEmailLoading ||
              isSendEmailLoading
            )
          }>
          <View style={styles.container}>
            <View style={styles.imageContainer}>
              <Image
                source={userImage ? {uri: userImage} : USER_PROFILE}
                style={styles.image}
              />
              <Pressable
                onPress={() => {
                  if (
                    isUpdateProfileLoading ||
                    isUploadUrlLoading ||
                    isLoadingImage ||
                    isVerifyEmailLoading ||
                    isSendEmailLoading
                  ) {
                  } else {
                    handleImagePickerModalPress();
                  }
                }}
                style={[styles.icon, {backgroundColor: COLORS.TERTIARY_COLOR}]}>
                <Camera />
              </Pressable>
            </View>
            <View>
              <View style={styles.row}>
                <View style={styles.name}>
                  <Text style={titleStyle}>
                    {t(LOCALES.SETTING.LBL_FIRST_NAME)}
                  </Text>
                  <TextField
                    editable={
                      !(
                        isUpdateProfileLoading ||
                        isUploadUrlLoading ||
                        isLoadingImage ||
                        isVerifyEmailLoading ||
                        isSendEmailLoading
                      )
                    }
                    value={firstName}
                    onChangeText={text => {
                      const obj = {...request};
                      obj.firstName = text;
                      setFirstName(text);
                      setRequest(obj);
                    }}
                  />
                </View>
                <View style={styles.name}>
                  <Text style={titleStyle}>
                    {t(LOCALES.SETTING.LBL_LAST_NAME)}
                  </Text>
                  <TextField
                    editable={
                      !(
                        isUpdateProfileLoading ||
                        isUploadUrlLoading ||
                        isLoadingImage ||
                        isVerifyEmailLoading ||
                        isSendEmailLoading
                      )
                    }
                    value={lastName}
                    onChangeText={text => {
                      const obj = {...request};
                      obj.lastName = text;
                      setLastName(text);
                      setRequest(obj);
                    }}
                  />
                </View>
              </View>
              <Text style={titleStyle}>{t(LOCALES.SETTING.LBL_USER_NAME)}</Text>
              <TextField
                editable={
                  !(
                    isUpdateProfileLoading ||
                    isUploadUrlLoading ||
                    isLoadingImage ||
                    isVerifyEmailLoading ||
                    isSendEmailLoading
                  )
                }
                rightIcon={userNameRightIcon}
                value={userName}
                onChangeText={text => {
                  const obj = {...request};
                  obj.userName = text;
                  setUserName(text);
                  setRequest(obj);
                }}
              />
              <Text style={titleStyle}>{t(LOCALES.SETTING.LBL_EMAIL)}</Text>
              <TextField
                editable={false}
                rightIcon={() =>
                  rightIcon('email', userDetails?.isEmailVerified)
                }
                value={email}
                onChangeText={text => {
                  const obj = {...request};
                  obj.email = text;
                  setEmail(text);
                  setRequest(obj);
                }}
              />
              <Text style={titleStyle}>
                {t(LOCALES.SETTING.LBL_PHONE_NUMBER)}
              </Text>
              <TextField
                editable={false}
                customLeftIconStyle={{marginRight: 15}}
                keyboardType="phone-pad"
                leftIcon={leftIcon}
                rightIcon={() =>
                  rightIcon('phoneNumber', userDetails?.isPhoneNumberVerified)
                }
                value={phoneNumber}
                onChangeText={text => {
                  const obj = {...request};
                  obj.phoneNumber = text;
                  setPhoneNumber(text);
                  setRequest(obj);
                }}
              />
              <Text style={titleStyle}>{t(LOCALES.SETTING.LBL_GENDER)}</Text>
              <Picker
                value={gender}
                onPress={() => {
                  if (
                    isUpdateProfileLoading ||
                    isUploadUrlLoading ||
                    isLoadingImage ||
                    isVerifyEmailLoading ||
                    isSendEmailLoading
                  ) {
                  } else {
                    setModalType('GENDER');
                    handleCustomModalPress();
                  }
                }}
              />
              <Text style={[titleStyle, {marginTop: 30}]}>
                {t(LOCALES.SETTING.LBL_NATIONALITY)}
              </Text>
              <Picker
                value={nationality}
                onPress={() => {
                  if (
                    isUpdateProfileLoading ||
                    isUploadUrlLoading ||
                    isLoadingImage ||
                    isVerifyEmailLoading ||
                    isSendEmailLoading
                  ) {
                  } else {
                    handlePresentModalPress();
                  }
                }}
              />
              <Text style={[titleStyle, {marginTop: 30}]}>
                {t(LOCALES.SETTING.LBL_BIRTH_DATE)}
              </Text>
              <Picker
                value={birthDate}
                onPress={() => {
                  if (
                    isUpdateProfileLoading ||
                    isUploadUrlLoading ||
                    isLoadingImage ||
                    isVerifyEmailLoading ||
                    isSendEmailLoading
                  ) {
                  } else {
                    setOpenCalender(true);
                  }
                }}
              />
              <Text style={[titleStyle, {marginTop: 30}]}>
                {t(LOCALES.SETTING.LBL_BIO)}
              </Text>
              <TextField
                editable={
                  !(
                    isUpdateProfileLoading ||
                    isUploadUrlLoading ||
                    isLoadingImage ||
                    isVerifyEmailLoading ||
                    isSendEmailLoading
                  )
                }
                containerStyle={{height: 145, paddingVertical: 10}}
                textInputStyle={{height: '100%'}}
                multiline={true}
                value={bio}
                onChangeText={text => {
                  const obj = {...request};
                  obj.bio = text;
                  setBio(text);
                  setRequest(obj);
                }}
              />
              {/* <Text style={titleStyle}>
                {t(LOCALES.SETTING.LBL_RELATIONSHIP_STATUS)}
              </Text>
              <Picker
                value={relationshipStatus}
                onPress={() => {
                  if (
                    isUpdateProfileLoading ||
                    isUploadUrlLoading ||
                    isLoadingImage ||
                    isVerifyEmailLoading ||
                    isSendEmailLoading
                  ) {
                  } else {
                    setModalType('RELATIONSHIP_STATUS');
                    handleCustomModalPress();
                  }
                }}
              /> */}
              <Button
                title={t(LOCALES.SETTING.LBL_UPDATE)}
                disabled={
                  isUpdateProfileLoading ||
                  isUploadUrlLoading ||
                  isLoadingImage ||
                  isVerifyEmailLoading ||
                  isSendEmailLoading ||
                  !firstName.trim() ||
                  !lastName.trim() ||
                  !userName.trim()
                }
                loading={
                  isUpdateProfileLoading ||
                  isUploadUrlLoading ||
                  isLoadingImage ||
                  isVerifyEmailLoading ||
                  isSendEmailLoading
                }
                onPress={() => {
                  if (request?.imageUrl) {
                    const body = {
                      fileName: image?.fileName,
                      fileModule: 'USER_AVATAR',
                      mimeType: image?.type,
                    };
                    getUploadUrl(body);
                    setIsLoadingImage(true);
                  } else {
                    onUpdateProfile(null);
                  }
                }}
                containerStyle={{
                  marginTop: 40,
                  marginBottom: Platform.OS === 'android' ? 20 : 0,
                }}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <CountryPickerModal
        bottomSheetModalRef={bottomSheetModalRef}
        onCountrySelect={onCountrySelect}
      />
      <CustomModal
        bottomSheetModalRef={CustomModalRef}
        type={modalType}
        customModalResult={customModalResult}
        setCustomModalResult={setCustomModalResult}
      />
      <DatePicker
        modal
        open={openCalender}
        date={new Date()}
        maximumDate={new Date()}
        mode={'date'}
        onConfirm={date => {
          const obj = {...request};
          obj.dateOfBirth = moment(date).format('YYYY-MM-DD');
          setOpenCalender(false);
          setBirthDate(moment(date).format('YYYY-MM-DD'));
          setRequest(obj);
        }}
        onCancel={() => {
          setOpenCalender(false);
        }}
      />
      <ImagePickerModal
        bottomSheetModalRef={ImagePickerModalRef}
        onCamera={pickImageFromCamera}
        onPhotoLibrary={pickImageFromGallery}
      />
    </SafeAreaView>
  );
};

export default PersonalInformation;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginHorizontal: 20,
  },
  imageContainer: {
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
  image: {
    height: 100,
    width: 100,
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
  row: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  name: {
    width: '45%',
    marginTop: 30,
  },
  title: {
    fontSize: responsiveFontSize(14),
    marginBottom: 10,
  },
  leftIconContainer: {flexDirection: 'row', alignItems: 'center'},
  leftIcon: {
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
  },
});
