import {
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import useTheme from '../../../../../../theme/hooks/useTheme';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import CLOSE from '../../../../../../assets/icons/svg/Close';
import Button from '../../../../../../components/Button';

type ModalTypes = {
  showModal: boolean;
  closeModal: () => void;
  onOkay: () => void;
  onRetake: () => void;
  imageUrl: string;
};

const ViewPhotos = ({
  showModal,
  closeModal = () => {},
  onOkay = () => {},
  onRetake = () => {},
  imageUrl,
}: ModalTypes) => {
  const {COLORS} = useTheme();
  return (
    <Modal
      transparent
      visible={showModal}
      statusBarTranslucent={true}
      animationType="fade">
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
            <View style={styles.buttonContainer}>
              <Button
                title="Retake"
                onPress={onRetake}
                containerStyle={{
                  borderWidth: 1,
                  width: '40%',
                  alignSelf: 'flex-end',
                  backgroundColor: COLORS.PRIMARY_COLOR,
                  borderColor: COLORS.SECONDARY_COLOR,
                }}
              />
              <Button
                title="OK"
                onPress={onOkay}
                containerStyle={{width: '40%', alignSelf: 'flex-end'}}
              />
            </View>
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
  },
  image: {
    height: '80%',
    width: '100%',
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
    marginBottom: Platform.OS === 'android' ? 20 : 0,
    flex: 1,
  },
});
