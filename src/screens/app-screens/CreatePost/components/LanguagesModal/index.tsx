import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import useTheme from '../../../../../theme/hooks/useTheme';
import LOCALES from '../../../../../localization/constants';
import {useTranslation} from 'react-i18next';
import TextField from '../../../../../components/TextField';
import {SEARCH} from '../../../../../assets/icons/svg';
import {responsiveFontSize} from '../../../../../theme/responsiveFontSize';
import CheckBox from '../../../../../components/CheckBox';
import {BlurView} from '@react-native-community/blur';

type LanguagesModalType = {
  bottomSheetModalRef: any;
  language: any;
  handleLanguagesChange: any;
};

const LanguagesModal = ({
  bottomSheetModalRef,
  language,
  handleLanguagesChange,
}: LanguagesModalType) => {
  const {FONTS, COLORS} = useTheme();
  const {t} = useTranslation();
  const snapPoints = useMemo(() => ['60%', '85%'], []);
  const [search, setSearch] = useState('');

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

  const MemorizedList = useMemo(
    () =>
      language.filter((item: any) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [search, language],
  );

  const list = useMemo(
    () => (search?.length > 0 ? MemorizedList : language),
    [search, MemorizedList, language],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      snapPoints={snapPoints}
      backgroundStyle={{backgroundColor: COLORS.MODAL_BACKGROUND_COLOR}}
      handleComponent={handleComponent}
      backdropComponent={renderBackdrop}>
      <BottomSheetScrollView style={[styles.contentContainerStyle]}>
        <View style={styles.container}>
          <Text
            style={[
              styles.language,
              {
                fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                color: COLORS.PRIMARY_TEXT_COLOR,
              },
            ]}>
            {t(LOCALES.CREATE_POST.LBL_SELECT_LANGUAGES)}
          </Text>
          <TextField
            placeholder={t(LOCALES.CREATE_POST.LBL_SEARCH_LANGUAGES)}
            leftIcon={<SEARCH />}
            containerStyle={{backgroundColor: COLORS.PRIMARY_COLOR}}
            parentStyle={{marginBottom: 10}}
            customLeftIconStyle={{marginRight: 8}}
            value={search}
            onChangeText={setSearch}
          />
          {list.map((item: any) => (
            <Pressable
              style={styles.row}
              key={item.id}
              onPress={() => handleLanguagesChange(item.id)}>
              <Text
                style={{
                  fontSize: responsiveFontSize(14),
                  fontFamily: FONTS.MONTSERRAT.REGULAR,
                  color: COLORS.PRIMARY_TEXT_COLOR,
                }}>
                {item.name}
              </Text>
              <CheckBox
                value={item.isSelected}
                onChange={() => handleLanguagesChange(item.id)}
              />
            </Pressable>
          ))}
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

export default LanguagesModal;

const styles = StyleSheet.create({
  handle: {
    height: 3,
    width: 60,
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 15,
  },
  contentContainerStyle: {flex: 1, marginBottom: 20},
  container: {
    marginHorizontal: 20,
  },
  language: {
    fontSize: responsiveFontSize(14),
    marginTop: 12,
    alignSelf: 'center',
    marginBottom: 30,
  },
  handleContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 0,
  },
});
