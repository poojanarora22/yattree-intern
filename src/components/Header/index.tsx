import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';

import Back from '../../assets/icons/svg/Back';
import useTheme from '../../theme/hooks/useTheme';
import {HeaderType} from '../../types/components/Header';
import {responsiveFontSize} from '../../theme/responsiveFontSize';

const Header = ({title, onBackPress = () => {}}: HeaderType) => {
  const {FONTS, COLORS} = useTheme();
  return (
    <View style={[styles.container, {backgroundColor: COLORS.PRIMARY_COLOR}]}>
      <View style={styles.row}>
        <Pressable onPress={onBackPress} style={styles.back}>
          <Back />
        </Pressable>
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              {
                fontFamily: FONTS.MONTSERRAT.SEMI_BOLD,
                color: COLORS.PRIMARY_TEXT_COLOR,
              },
            ]}>
            {title}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: 66,
    width: '100%',
    paddingHorizontal: 20,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  title: {
    fontSize: responsiveFontSize(18),
  },
  back: {
    height: 24,
    width: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
