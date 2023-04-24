import {Image, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import useTheme from '../../../../../theme/hooks/useTheme';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import CLOSE from '../../../../../assets/icons/svg/Close';

type ModalTypes = {
  showModal: boolean;
  closeModal: () => void;
  imageUrl: string;
};

const ViewPhotos = ({
  showModal,
  closeModal = () => {},
  imageUrl,
}: ModalTypes) => {
  const {COLORS} = useTheme();
  return (
    <Modal
      transparent
      visible={showModal}
      statusBarTranslucent={true}
      onDismiss={closeModal}
      animationType="fade"
      onRequestClose={closeModal}>
      <SafeAreaProvider>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: COLORS.PRIMARY_COLOR,
          }}>
          <View style={styles.container}>
            <Pressable onPress={closeModal} style={styles.close}>
              <CLOSE color={COLORS.TERTIARY_COLOR} />
            </Pressable>
            <Image source={{uri: imageUrl}} style={styles.image} />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
};

export default ViewPhotos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  close: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    position: 'absolute',
    zIndex: 999,
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
});
