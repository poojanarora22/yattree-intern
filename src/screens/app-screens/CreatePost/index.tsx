import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useRef} from 'react';
import useTheme from '../../../theme/hooks/useTheme';
import CreatePostModal from './components/CreatePostModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useIsFocused} from '@react-navigation/native';
import {CreatePostScreenProps} from '../../../types/navigation/appTypes';
import {setClearCreatePostData} from '../../../store/slice/createPostSlice';
import {useAppDispatch} from '../../../store';

const CreatePost = ({navigation}: CreatePostScreenProps) => {
  const {COLORS, BAR_STYLE} = useTheme();
  const createPostModalRef = useRef<BottomSheetModal>(null);
  const isFocused = useIsFocused();
  const dispatch = useAppDispatch();
  const handleCreatePostModalPress = useCallback(() => {
    createPostModalRef?.current?.present();
  }, []);

  const handleBackNavigation = useCallback(() => {
    navigation.goBack();
  }, []);

  const handleForwardNavigation = useCallback(() => {
    navigation.navigate('CreatePostStack', {
      screen: 'CreatePostStepOne',
    });
    dispatch(setClearCreatePostData(null));
  }, []);

  useEffect(() => {
    if (isFocused) {
      handleCreatePostModalPress();
    }
  }, [isFocused]);

  return (
    <View style={[styles.container, {backgroundColor: COLORS.PRIMARY_COLOR}]}>
      <StatusBar
        backgroundColor={COLORS.STATUS_BAR_COLOR}
        barStyle={BAR_STYLE}
      />
      <CreatePostModal
        bottomSheetModalRef={createPostModalRef}
        handleBackNavigation={handleBackNavigation}
        handleForwardNavigation={handleForwardNavigation}
      />
    </View>
  );
};

export default CreatePost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
