import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import useTheme from '../../../../../theme/hooks/useTheme';
import {responsiveFontSize} from '../../../../../theme/responsiveFontSize';
import UploadPhotosIcon from '../../../../../assets/icons/svg/UploadPhotos';
import {
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import LOCALES from '../../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '../../../../../store';
import {setDestinationPhotoList} from '../../../../../store/slice/createPostSlice';
import CLOSE from '../../../../../assets/icons/svg/Close';
import ViewPhotos from '../ViewPhotos';

const {width} = Dimensions.get('screen');
const imageSize = (width - 80) / 3;

const UploadPhotos = ({disabled = false}) => {
  const {COLORS, FONTS} = useTheme();
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {destinationPhotoList, editTourData} = useAppSelector(
    state => state.createPost,
  );
  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const pickImageFromGallery = useCallback(async () => {
    const result: ImagePickerResponse = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.2,
    });
    if (result && result?.assets) {
      dispatch(
        setDestinationPhotoList([
          ...destinationPhotoList,
          {
            fileName: result?.assets[0]?.fileName,
            fileModule: 'USER_EVENT',
            uri: result?.assets[0]?.uri,
            mimeType: result?.assets[0]?.type,
          },
        ]),
      );
    }
  }, [destinationPhotoList]);

  const removeImages = useCallback(
    (currentIndex: number) => {
      dispatch(
        setDestinationPhotoList(
          destinationPhotoList.filter(
            (item: any, index: number) => index !== currentIndex,
          ),
        ),
      );
    },
    [destinationPhotoList],
  );

  useEffect(() => {
    if (editTourData) {
      if (editTourData?.destinationPhotos?.length > 0) {
        let array: any = [];
        editTourData?.destinationPhotos?.map((destinationPhoto: any) => {
          array.push({
            fileName: destinationPhoto?.fileName,
            fileModule: 'USER_EVENT',
            uri: destinationPhoto?.mediaUrl,
            mimeType: destinationPhoto?.mimeType,
          });
        });
        dispatch(setDestinationPhotoList(array));
      }
    }
  }, [editTourData]);

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: COLORS.PRIMARY_TEXT_COLOR,
          fontSize: responsiveFontSize(14),
          fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
          marginBottom: 5,
        }}>
        {t(LOCALES.CREATE_POST.LBL_UPLOAD_PHOTOS)}
      </Text>
      <Text
        style={{
          color: COLORS.SECONDARY_TEXT_COLOR,
          fontSize: responsiveFontSize(12),
          fontFamily: FONTS.MONTSERRAT.REGULAR,
          marginBottom: 16,
        }}>
        {t(LOCALES.CREATE_POST.LBL_UPLOAD_PHOTOS_INSTRUCTION)}
      </Text>
      <View style={styles.uploadImageParent}>
        {destinationPhotoList?.map((item: any, index: number) => (
          <Pressable
            disabled={disabled}
            key={index}
            onPress={() => {
              setShowModal(true);
              setImageUrl(item?.uri);
            }}
            style={[
              styles.uploadImageContainer,
              {marginHorizontal: (index + 2) % 3 === 0 ? 10 : 0},
            ]}>
            <Image source={{uri: item?.uri}} style={styles.image} />
            <Pressable onPress={() => removeImages(index)} style={styles.close}>
              <CLOSE color={COLORS.TERTIARY_COLOR} height={20} width={20} />
            </Pressable>
          </Pressable>
        ))}
        <Pressable
          disabled={disabled}
          onPress={pickImageFromGallery}
          style={[
            styles.uploadIconContainer,
            {
              borderColor: COLORS.INPUT_INACTIVE_BORDER_COLOR,
              marginLeft: (destinationPhotoList?.length + 2) % 3 === 0 ? 10 : 0,
            },
          ]}>
          <UploadPhotosIcon />
          <Text
            style={{
              fontFamily: FONTS.MONTSERRAT.REGULAR,
              fontSize: responsiveFontSize(16),
              marginTop: 10,
              color: COLORS.INPUT_INACTIVE_BORDER_COLOR,
            }}>
            {t(LOCALES.CREATE_POST.LBL_UPLOAD)}
          </Text>
        </Pressable>
      </View>
      <ViewPhotos
        imageUrl={imageUrl}
        showModal={showModal}
        closeModal={() => setShowModal(false)}
      />
    </View>
  );
};

export default UploadPhotos;

const styles = StyleSheet.create({
  container: {},
  uploadIconContainer: {
    height: imageSize,
    width: imageSize,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 30,
    opacity: 0.8,
  },
  uploadImageContainer: {
    height: imageSize,
    width: imageSize,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  remove: {
    position: 'absolute',
    fontSize: responsiveFontSize(14),
  },
  uploadImageParent: {
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
  },
  close: {
    height: 30,
    width: 30,
    position: 'absolute',
    top: 5,
    right: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
